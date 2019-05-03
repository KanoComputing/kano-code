import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import '@kano/kwc-blockly/kwc-blockly.js';
// TODO: This forces loading the en messages. Blockly has synchronous msg loading
import '@kano/kwc-blockly/blockly_built/msg/js/en.js';
import '@kano/kwc-blockly/blocks.js';
import '@kano/kwc-blockly/javascript.js';
import '../kano-style/themes/dark.js';

class KCBlocklyEditor extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                position: relative;
                background-color: var(--color-grey-darker, grey);
            }
        
            :host kwc-blockly,
            :host kano-code-editor {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: opacity 200ms linear;
            }
        
            :host kwc-blockly {
                --kwc-blockly-toolbox: {
                    background: var(--kc-secondary-color);
                };
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kwc-blockly id="code-editor"
                    toolbox="[[toolbox]]"
                    no-toolbox="[[noToolbox]]"
                    flyout="[[flyout]]"
                    on-change="_onBlocklyChanged"
                    on-code-changed="_onCodeChanged"
                    media="[[media]]">
        </kwc-blockly>
`;
    }
    static get is() { return 'kc-blockly-editor'; }
    static get properties() {
        return {
            toolbox: {
                type: Array,
            },
            noToolbox: {
                type: Boolean,
                value: false,
            },
            flyout: {
                type: Array,
            },
            defaultCategories: {
                type: Object,
                value: null,
            },
            blocks: {
                type: String,
            },
            flyoutMode: {
                type: Boolean,
            },
            media: {
                type: String,
            },
        };
    }
    static get observers() {
        return [
            'computeToolbox(defaultCategories.*)',
            'computeToolbox(flyoutMode)',
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        this.toolboxReady = false;
    }

    _onCodeChanged(e) {
        this.dispatchEvent(new CustomEvent('code-changed', { detail: { value: e.detail.value } }));
    }
    loadBlocks(xmlString) {
        this.$['code-editor'].loadBlocks(xmlString);
    }
    _onBlocklyChanged(e) {
        // Check if a create event follows a close-flyout event. If so, do not notify
        // of the close-flyout event
        if (e.detail.type === 'close-flyout') {
            // Defer the notification
            this.closeFlyoutTimeoutId = setTimeout(() => {
                this.dispatchEvent(new CustomEvent('action', { detail: e.detail }));
            });
        } else {
            // A create event will cancel its previous close-flyout event
            if (e.detail.type === 'create') {
                clearTimeout(this.closeFlyoutTimeoutId);
            }
            this.dispatchEvent(new CustomEvent('action', { detail: e.detail }));
        }
    }
    computeToolbox() {
        if (!this.defaultCategories) {
            return;
        }

        let toolbox = Object.keys(this.defaultCategories).map(id => this.defaultCategories[id]);

        const unorderedEntries = toolbox.filter(e => typeof e.order === 'undefined');
        const orderedEntries = toolbox.filter(e => typeof e.order !== 'undefined');
        toolbox = unorderedEntries
            .concat(orderedEntries.sort((a, b) => (a.order || 0) - (b.order || 0)))
            .filter(entry => entry.blocks.length);
        if (this.flyoutMode) {
            const flyout = toolbox.reduce((acc, entry) => acc.concat(entry.blocks), []);
            this.set('flyout', flyout);
            this.set('toolbox', null);
            this.set('noToolbox', true);
            // FIXME: kwc-blockly sets the background of the flyout to the same color as the
            // background of the workspace. This is a trick to change it
            const flyoutEl = this.$['code-editor'].getFlyout();
            flyoutEl.style.background = '#292f35';
            flyoutEl.classList.add('flyout-mode');
        } else {
            this.set('flyout', null);
            this.set('toolbox', toolbox);
            this.set('noToolbox', false);
        }
        if (!this.toolboxReady) {
            this.toolboxReady = true;
            this.$['code-editor'].loadBlocks(this.blocks);
        }
    }
    getBlocklyWorkspace() {
        return this.$['code-editor'].getWorkspace();
    }
    get workspace() {
        return this.getBlocklyWorkspace();
    }
    get Blockly() {
        // TODO: Get kwc-blockly to give it to us
        return window.Blockly;
    }
    getSource() {
        return this.$['code-editor'].getBlocks();
    }
    load(blocks) {
        this.$['code-editor'].load({ blocks });
    }
}

customElements.define(KCBlocklyEditor.is, KCBlocklyEditor);
