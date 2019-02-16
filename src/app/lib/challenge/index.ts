import { Editor } from '../editor/editor.js';
import { KanoCodeChallenge } from './kano-code.js';
import { BlocklySourceEditor } from '../editor/source-editor/blockly.js';
import { transformChallenge } from './legacy.js';
import { IToolboxWhitelist } from '../editor/toolbox.js';

interface IChallengeData {
    version? : string;
    steps : any[];
    defaultApp? : string;
    partsWhitelist? : IToolboxWhitelist;
    whitelist? : IToolboxWhitelist;
}

export class Challenge {
    public editor : Editor;
    private challengeData : IChallengeData;
    private engine? : KanoCodeChallenge;
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
        this.editor.queryEngine.registerTagHandler('alias', (selector) => {
            if (!selector.id) {
                throw new Error('Could not find alias: No id provided');
            }
            const s = this.engine!.aliases.get(selector.id);
            if (!s) {
                throw new Error(`Could not find alias: '${selector.id}' was not registered before`);
            }
            return this.editor.querySelector(s);
        });
        this.editor.queryEngine.registerTagHandler('banner-button', (selector) => {
            const widget = this.engine!.widgets.get('banner');
            if (!widget) {
                throw new Error('Could not query banner button: Banner is not displayed');
            }
            const domNode = widget.getDomNode();
            const bannerEl = domNode.querySelector('kc-editor-banner');
            if (!bannerEl) {
                throw new Error('Could not query banner button: Banner element does not exists');
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
    }
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start challenge: Editor was not injected');
        }
        // Engine is defined as the editor is injected
        const engine = this.engine!;
        engine.start();
    }
    dispose() {
        // Here get rid of all modifications made to the editor
    }
}