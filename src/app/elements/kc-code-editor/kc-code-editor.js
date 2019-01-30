import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import 'monaco-editor-element/dist/monaco-editor/vs/loader.js';
import 'monaco-editor-element/monaco-editor.js';
import '../../scripts/kano/make-apps/store.js';
import '../kano-style/themes/dark.js';
import { Store } from '../../scripts/legacy/store.js';

class KCCodeEditor extends Store.StateReceiver(PolymerElement) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                background-color: var(--color-grey-darker, grey);
            }
        </style>
        <monaco-editor id="editor" namespace="bower_components/monaco-editor-element/dist/monaco-editor/vs" theme="vs-dark" on-ready="_editorReady" on-changed="_editorSourceChanged"></monaco-editor>
`;
    }

    static get is() { return 'kc-code-editor'; }
    static get properties() {
        return {
            noUser: {
                type: Boolean,
                value: true,
            },
            noBack: {
                type: Boolean,
                value: true,
            },
            toolbox: {
                type: Array,
                linkState: 'toolbox',
            },
            code: {
                type: Object,
                linkState: 'code',
            },
            source: {
                type: Object,
                linkState: 'source',
                observer: '_sourceChanged',
            },
            user: {
                type: Object,
                linkState: 'user',
            },
            logoutEnabled: {
                type: Boolean,
                linkState: 'editor.logoutEnabled',
            },
        };
    }
    _sourceChanged() {
        this.$.editor.value = this.source;
    }
    _editorReady() {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2015,
            allowNonTsExtensions: true,
        });
        this._sourceChanged();
        this.computeToolbox();
    }
    _editorSourceChanged() {
        const code = this.$.editor.value;
        this.dispatch({ type: 'UPDATE_CODE', code });
    }
    computeToolbox() {
        if (!this.toolbox || !window.monaco) {
            return;
        }
        this.toolbox.forEach((category) => {
            monaco.languages.typescript.javascriptDefaults
                .addExtraLib(category.definitionFile, category.id);
        });
    }
    getSource() {
        return this.$.editor.value;
    }
}

customElements.define(KCCodeEditor.is, KCCodeEditor);
