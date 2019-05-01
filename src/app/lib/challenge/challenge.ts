import { BlocklySourceEditor } from '../source-editor/blockly.js';
import { transformChallenge } from './legacy.js';
import { IDisposable, EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { IToolboxWhitelist } from '../editor/toolbox.js';
import { Editor } from '../editor/editor.js';
import { Engine } from './engine.js';
import { ContributionManager } from '../contribution.js';

const registeredEngines = new ContributionManager<typeof Engine>();

export function registerChallengeEngine(id : string, engine : typeof Engine) {
    registeredEngines.register(id, engine);
}

// window namespaces used for easy access to editors in development
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};

export interface IChallengeEndBehavior {
    showNextButton : boolean;
}

export interface IChallengeOptions {
    end : IChallengeEndBehavior;
}

export interface IChallengeData {
    version? : string;
    steps : any[];
    defaultApp? : string;
    partsWhitelist? : IToolboxWhitelist;
    whitelist? : IToolboxWhitelist;
}

export class Challenge {
    public editor : Editor;
    private challengeData : IChallengeData;
    public engine : Engine;
    private subscriptions : IDisposable[] = [];
    private options : IChallengeOptions;
    
    private _onDidEnd : EventEmitter = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    private _onDidRequestNextChallenge : EventEmitter = new EventEmitter();
    get onDidRequestNextChallenge() { return this._onDidRequestNextChallenge.event; }

    constructor(editor : Editor, challengeData : IChallengeData, options : IChallengeOptions) {
        this.editor = editor;
        this.options = options;
        if (!challengeData.version) {
            // Take care of legacy challenges
            transformChallenge(challengeData);
        }
        this.challengeData = challengeData;
        const EngineContructor = registeredEngines.get(this.editor.sourceType);
        if (!EngineContructor) {
            throw new Error(`Could not create challenge: Challenge engine for source type '${this.editor.sourceType}' was not imported.`);
        }
        this.engine = new EngineContructor(this.editor);
        if (this.editor.injected) {
            this.onInject();
        } else {
            this.editor.onDidInject(() => this.onInject());
        }
        window.Kano.Code.mainChallenge = this;
    }
    onInject() {
        // Load the default app if provided
        if (this.challengeData.defaultApp) {
            this.editor.load(JSON.parse(this.challengeData.defaultApp));
        }
        if (this.challengeData.partsWhitelist) {
            this.editor.parts.setWhitelist(this.challengeData.partsWhitelist);
        }
        if (this.challengeData.whitelist) {
            this.editor.toolbox.setWhitelist(this.challengeData.whitelist);
        }
        const steps = this.challengeData.steps || [];
        // Add an extra empty step. The engine consider the last step as the end by default.
        // This tricks it to thing it's the end. Remove this when the einge updates
        steps.push({});
        this.engine.setSteps(steps);
        if (this.editor.sourceType === 'blockly') {
            (this.editor.sourceEditor as BlocklySourceEditor).onDidSourceChange((e : any) => {
                if (!this.engine) {
                    return;
                }
                this.engine.triggerEvent('blockly', { event: e });
            });
        }
        let sub : IDisposable;
        // This allows the querying of aliases defined during a challenge, parts blocks or positions
        sub = this.editor.queryEngine.registerTagHandler('alias', (selector) => {
            if (!selector.id) {
                this.editor.queryEngine.warn('Could not find alias: No id provided');
                return null;
            }
            const s = this.engine.aliases.get(selector.id);
            if (!s) {
                this.editor.queryEngine.warn(`Could not find alias: '${selector.id}' was not registered before`);
                return null;
            }
            return this.editor.querySelector(s);
        });
        this.subscriptions.push(sub);
        // This allows challenges to access the next button in the banner
        sub = this.editor.queryEngine.registerTagHandler('banner-button', (selector) => {
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
    dispose() {
        // Here get rid of all modifications made to the editor
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
        if (window.Kano.Code.mainChallenge === this) {
            window.Kano.Code.mainChallenge = null;
        }
    }
}
