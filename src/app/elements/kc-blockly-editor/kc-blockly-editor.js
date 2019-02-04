import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import '@kano/kwc-blockly/kwc-blockly.js';
// TODO: This forces loading the en messages. Blockly has synchronous msg loading
import '@kano/kwc-blockly/blockly_built/msg/js/en.js';
import '@kano/kwc-blockly/blocks.js';
import '@kano/kwc-blockly/javascript.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import '../kano-style/themes/dark.js';
import { Store } from '../../scripts/legacy/store.js';

const behaviors = [
    AppEditorBehavior,
    AppElementRegistryBehavior,
];

class KCBlocklyEditor extends Store.StateReceiver(mixinBehaviors([behaviors], PolymerElement)) {
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
                @apply(--layout-fit);
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
                    on-blockly-ready="_onBlocklyReady"
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
                linkState: 'toolbox',
                value: null,
            },
            code: {
                type: Object,
                linkState: 'code',
            },
            blocks: {
                type: Object,
                observer: 'blocksChanged',
                linkState: 'source',
            },
            flyoutMode: {
                linkState: 'blockly.flyoutMode',
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
        const { config } = this.getState();
        this.media = config.BLOCKLY_MEDIA;
        this.toolboxReady = false;
    }
    _onBlocklyReady() {
        const binGroup = this.$['code-editor'].workspace.svgGroup_;
        if (binGroup) {
            this._registerElement('blockly-bin', binGroup.querySelector('.blocklyTrash'));
        }
        this._registerElement('blockly-toolbox', this.$['code-editor'].getToolbox());
        // TODO: kwc-blockly should be able to report this at any moment. But at this exact point
        // it doesn't. Use `getFlyout` once kwc-blockly fixes this issue
        const flyout = this.flyout ? this.$['code-editor'].$.flyout : this.$['code-editor'].$.toolbox.$.flyout;
        this._registerElement('blockly-flyout', flyout);
    }
    _onCodeChanged(e) {
        this.dispatchEvent(new CustomEvent('code-changed', { detail: { value: e.detail.value } }));
    }
    blocksChanged() {
        this.$['code-editor'].loadBlocks(this.blocks);
    }
    _onBlocklyChanged(e) {
        // Check if a create event follows a close-flyout event. If so, do not notify
        // of the close-flyout event
        if (e.detail.type === 'close-flyout') {
            // Defer the notification
            this.closeFlyoutTimeoutId = setTimeout(() => {
                this.notifyChange('blockly', { event: e.detail });
            });
        } else {
            // A create event will cancel its previous close-flyout event
            if (e.detail.type === 'create') {
                clearTimeout(this.closeFlyoutTimeoutId);
            }
            this.notifyChange('blockly', { event: e.detail });
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
        // Update the flyout element as it can change
        // TODO: kwc-blockly should be able to report this at any moment. But at this exact point
        // it doesn't. Use `getFlyout` once kwc-blockly fixes this issue
        const flyout = this.flyout ? this.$['code-editor'].$.flyout : this.$['code-editor'].$.toolbox.$.flyout;
        this._registerElement('blockly-flyout', flyout);
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
