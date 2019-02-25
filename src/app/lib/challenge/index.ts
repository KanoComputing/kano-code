import { Editor } from '../editor/editor.js';
import { KanoCodeChallenge } from './kano-code.js';
import { BlocklySourceEditor } from '../editor/source-editor/blockly.js';
import { transformChallenge } from './legacy.js';
import { IToolboxWhitelist } from '../editor/toolbox.js';
import { subscribe, IDisposable, EventEmitter } from '@kano/common/index.js';

// window namespaces used for easy access to editors in development
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};

interface IChallengeData {
    version? : string;
    steps : any[];
    defaultApp? : string;
    partsWhitelist? : IToolboxWhitelist;
    whitelist? : IToolboxWhitelist;
}

// Trick to make the custom emitter from the challenge engine have a normal eventemitter api
(KanoCodeChallenge.prototype as any).on = (KanoCodeChallenge.prototype as any).addEventListener;

export class Challenge {
    public editor : Editor;
    private challengeData : IChallengeData;
    private engine? : KanoCodeChallenge;
    private subscriptions : IDisposable[] = [];
    private _onDidEnd : EventEmitter = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }
    constructor(editor : Editor, challengeData : IChallengeData) {
        this.editor = editor;
        if (!challengeData.version) {
            // Take care of legacy challenges
            transformChallenge(challengeData);
        }
        this.challengeData = challengeData;
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
        this.engine = new KanoCodeChallenge(this.editor);
        this.engine.setSteps(this.challengeData.steps || []);
        if (this.editor.sourceType === 'blockly') {
            (this.editor.sourceEditor as BlocklySourceEditor).onDidSourceChange((e : any) => {
                if (!this.engine) {
                    return;
                }
                this.engine.triggerEvent('blockly', { event: e });
            });
        }
        let sub : IDisposable;
        sub = this.editor.queryEngine.registerTagHandler('alias', (selector) => {
            if (!selector.id) {
                this.editor.queryEngine.warn('Could not find alias: No id provided');
                return null;
            }
            const s = this.engine!.aliases.get(selector.id);
            if (!s) {
                this.editor.queryEngine.warn(`Could not find alias: '${selector.id}' was not registered before`);
                return null;
            }
            return this.editor.querySelector(s);
        });
        this.subscriptions.push(sub);
        sub = this.editor.queryEngine.registerTagHandler('banner-button', (selector) => {
            const widget = this.engine!.widgets.get('banner');
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
        subscribe(engine, 'done', () => {
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