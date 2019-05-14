import { BlocklySourceEditor } from '../source-editor/blockly.js';
import { transformChallenge } from './legacy.js';
import { IDisposable, EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { IToolboxWhitelist } from '../editor/toolbox.js';
import { Editor } from '../editor/editor.js';
import { Engine } from './engine.js';
import { ContributionManager } from '../contribution.js';
import { ChallengeBase } from './base.js';

const registeredEngines = new ContributionManager<typeof Engine>();

export function registerChallengeEngine(id : string, engine : typeof Engine) {
    registeredEngines.register(id, engine);
}

// window namespaces used for easy access to editors in development
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};

export interface IChallengeData {
    id : string,
    version? : string;
    steps : any[];
    defaultApp? : string;
    partsWhitelist? : IToolboxWhitelist;
    whitelist? : IToolboxWhitelist;
}

export class Challenge extends ChallengeBase {
    public editor : Editor;
    public data : IChallengeData;
    public engine? : Engine;
    private subscriptions : IDisposable[] = [];

    private _onDidRequestNextChallenge : EventEmitter = new EventEmitter();
    get onDidRequestNextChallenge() { return this._onDidRequestNextChallenge.event; }

    constructor(editor : Editor, challengeData : IChallengeData) {
        super(editor);
        this.editor = editor;
        if (!challengeData.version) {
            // Take care of legacy challenges
            transformChallenge(challengeData);
        }
        this.data = challengeData;
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject());
        }
        window.Kano.Code.mainChallenge = this;
    }
    onInject() {
        this.reset();
        const steps = this.data.steps || [];
        // Add an extra empty step. The engine consider the last step as the end by default.
        // This tricks it to thing it's the end. Remove this when the einge updates
        steps.push({});
        const EngineContructor = registeredEngines.get(this.editor.sourceType);
        if (!EngineContructor) {
            throw new Error(`Could not create challenge: Challenge engine for source type '${this.editor.sourceType}' was not imported.`);
        }
        this.engine = new EngineContructor(this.editor);
        this.engine.setSteps(steps);
        if (this.editor.sourceType === 'blockly') {
            (this.editor.sourceEditor as BlocklySourceEditor).onDidSourceChange((e : any) => {
                if (!this.engine) {
                    return;
                }
                this.engine.triggerEvent('blockly', { event: e });
            });
        }
        // This allows challenges to access the next button in the banner
        const sub = this.editor.queryEngine.registerTagHandler('banner-button', (selector) => {
            if (!this.engine) {
                throw new Error('Could not query banner-button: Editor was not injected');
            }
            const widget = this.engine.widgets.get('banner');
            if (!widget) {
                this.editor.queryEngine.warn('Could not query banner button: Banner is not displayed');
                return null;
            }
            const domNode = widget.getDomNode();
            const bannerEl = domNode.querySelector('kc-editor-banner');
            if (!bannerEl) {
                this.editor.queryEngine.warn('Could not query banner button: Banner element does not exists');
                return null;
            }
            return {
                getHTMLElement() {
                    return bannerEl.shadowRoot!.querySelector('#banner-button') as HTMLElement;
                },
                getId() {
                    return 'banner-button';
                }
            };
        });
        this.subscriptions.push(sub);
    }
    reset() {
        // Load the default app if provided
        if (this.data.defaultApp) {
            this.editor.load(JSON.parse(this.data.defaultApp));
        }
        if (this.data.partsWhitelist) {
            this.editor.parts.setWhitelist(this.data.partsWhitelist);
        }
        if (this.data.whitelist) {
            this.editor.toolbox.setWhitelist(this.data.whitelist);
        }
    }
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start challenge: Editor was not injected');
        }
        // Engine is defined as the editor is injected
        const engine = this.engine!;
        // The engine uses a similar API to the DOM events
        subscribeDOM(engine as unknown as HTMLElement, 'done', () => {
            this.editor.toolbox.setWhitelist(null);
            this._onDidEnd.fire();
        }, this, this.subscriptions);
        engine.start();
    }
    stop() {
        if (!this.engine) {
            return;
        }
        if (this.engine.steps) {
            this.engine.steps = [];
            this.engine.stepIndex = 0;
        }
    }
    setData(data : any) {
        super.setData(data);
        if (this.engine) {
            this.engine.setSteps(data.steps);
        }
    }
    dispose() {
        // Here get rid of all modifications made to the editor
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
        if (window.Kano.Code.mainChallenge === this) {
            window.Kano.Code.mainChallenge = null;
        }
    }
}
