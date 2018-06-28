import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import '@kano/kwc-blockly/kwc-blockly.js';
import '@kano/kwc-blockly/blocks.js';
import '@kano/kwc-blockly/javascript.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-icon/iron-icon.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import '../kc-user-options/kc-user-options.js';
import '../kano-tooltip/kano-tooltip.js';
import '../kano-icons/kc-ui.js';
import '../../scripts/kano/make-apps/store.js';
import '../../scripts/kano/make-apps/actions/user.js';
import '../kano-style/themes/dark.js';
import { Store } from '../../scripts/legacy/store.js';

const behaviors = [
    AppEditorBehavior,
    AppElementRegistryBehavior,
    I18nBehavior,
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
            :host kano-code-editor,
            .shell {
                @apply(--layout-fit);
                transition: opacity 200ms linear;
            }
        
            :host kwc-blockly {
                --kwc-blockly-toolbox: {
                    padding-top: 0;
                    background: var(--kc-secondary-color);
                };
            }
        
            .shell {
                background-color: var(--kc-primary-color, white);
            }
        
            .shell .toolbox {
                content: ' ';
                position: absolute;
                @apply --kwc-blockly-toolbox;
                top: 0px;
                bottom: 0px;
                width: 142px;
            }
        
            :host([loading]) kwc-blockly {
                opacity: 0;
            }
        
            button.icon {
                background: transparent;
                border: 0;
                cursor: pointer;
                margin: 0px 6px;
            }
        
            button.icon:focus {
                outline: none;
            }
        
            button.icon iron-icon {
                fill: white;
                margin: 6px;
            }
        
            button.logo iron-icon {
                width: 50px;
                opacity: 0.7;
            }
        
            button.menu iron-icon {
                width: 24px;
                height: 24px;
                opacity: 0.5;
            }
        
            button.menu:hover iron-icon {
                opacity: 1;
            }
        
            button.icon:hover iron-icon {
                opacity: 1;
            }
        
            .toolbox-enhancer {
                background: var(--kc-secondary-color);
                color: white;
            }
        
            .toolbox-enhancer.above {
                @apply --layout-horizontal;
                @apply --layout-justified;
                padding: 6px 0px;
            }
        
            .toolbox-enhancer.under .wrapper {
                max-width: 142px;
                @apply --layout-vertical;
                @apply --layout-center;
            }
        
            .back {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                @apply --kano-button;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 2px;
                font-size: 14px;
                padding: 8px 22px;
                color: rgba(255, 255, 255, 0.75);
                font-weight: bold;
                margin-bottom: 12px;
            }
        
            .back:hover,
            .back:focus {
                background: rgba(255, 255, 255, 0.35);
                color: rgba(255, 255, 255, 1);
            }
        
            .back iron-icon {
                width: 12px;
                height: 12px;
                margin-right: 8px;
                fill: rgba(255, 255, 255, 0.5);
            }
        
            kano-tooltip {
                box-sizing: border-box;
            }
        
            [hidden] {
                display: none !important;
            }
        
            kano-tooltip {
                --kano-tooltip: {
                    border-radius: 6px;
                }
                ;
            }
        
            kc-user-options {
                border-radius: 6px;
                overflow: hidden;
            }
        </style>
        <div class="shell">
            <div class="toolbox"></div>
        </div>
        <kwc-blockly id="code-editor"
                    toolbox="[[toolbox]]"
                    no-toolbox="[[noToolbox]]"
                    flyout="[[flyout]]"
                    on-change="_onBlocklyChanged"
                    on-code-changed="_onCodeChanged"
                    on-blockly-ready="_onBlocklyReady"
                    media="[[media]]">
            <div id="toolbox-enhancer-above" class="toolbox-enhancer above" slot="above-toolbox">
                <button type="button" class="logo icon" on-tap="_exitButtonTapped" hidden\$="[[noUser]]">
                    <iron-icon class="block-logo" src\$="/assets/kano-logo-simple.svg"></iron-icon>
                </button>
                <button type="button" class="menu icon" on-tap="_menuButtonTapped" hidden\$="[[noUser]]">
                    <iron-icon id="menu-icon" class="block-logo" icon="kc-ui:hamburger"></iron-icon>
                </button>
            </div>
            <div class="toolbox-enhancer under" slot="under-toolbox">
                <div class="wrapper" hidden\$="[[noBack]]">
                    <a class="back" on-tap="_exitButtonTapped">
                        <iron-icon id="back-icon" icon="kano-icons:back"></iron-icon>
                        <span>[[localize('BACK', 'Back')]]</span>
                    </a>
                </div>
            </div>
        </kwc-blockly>
        <kano-tooltip id="tooltip" position="bottom" offset="8" auto-close="">
            <kc-user-options on-logout="_closeTooltip"></kc-user-options>
        </kano-tooltip>
`;
    }
    static get is() { return 'kc-blockly-editor'; }
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
            parts: {
                type: Array,
                linkState: 'addedParts',
            },
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
            mode: {
                type: Object,
                linkState: 'mode',
            },
            user: {
                type: Object,
                linkState: 'user',
            },
            logoutEnabled: {
                type: Boolean,
                linkState: 'editor.logoutEnabled',
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
            'computeToolbox(parts)',
            'computeToolbox(defaultCategories.*)',
            'computeToolbox(mode)',
            '_partsChanged(parts.*)',
        ];
    }
    _logoutTapped() {
        this.dispatchEvent(new CustomEvent('logout', { bubbles: true }));
        this._closeTooltip();
    }
    _loginTapped() {
        this.dispatchEvent(new CustomEvent('login', { bubbles: true }));
    }
    _isLogoutHidden(logoutEnabled, user) {
        return !logoutEnabled || !user;
    }
    _isProfileHidden(user) {
        return !user;
    }
    _closeTooltip() {
        this.$.tooltip.close();
    }
    _isAuthenticated(user) {
        return !!user;
    }
    _computeAvatar(user) {
        if (!user || !user.avatar || !user.avatar.urls || !user.avatar.urls.circle) {
            return '/assets/avatar/judoka-face.svg';
        }
        return user.avatar.urls.circle;
    }
    _menuButtonTapped(e) {
        this.$.tooltip.target = this.$['menu-icon'].getBoundingClientRect();
        this.$.tooltip.open();
    }
    _exitButtonTapped() {
        this.dispatchEvent(new CustomEvent('exit-tapped', { bubbles: true }));
    }
    _onBlocklyReady() {
        this._registerElement('blockly-bin', this.$['code-editor'].workspace.svgGroup_.querySelector('.blocklyTrash'));
        this._registerElement('blockly-toolbox', this.$['code-editor'].getToolbox());
        // TODO: kwc-blockly should be able to report this at any moment. But at this exact point
        // it doesn't. Use `getFlyout` once kwc-blockly fixes this issue
        const flyout = this.flyout ? this.$['code-editor'].$.flyout : this.$['code-editor'].$.toolbox.$.flyout;
        this._registerElement('blockly-flyout', flyout);
    }
    _onCodeChanged(e) {
        this.dispatch({ type: 'UPDATE_CODE', code: e.detail.value });
    }
    blocksChanged() {
        if (!this.blocks) {
            return;
        }
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
    ready() {
        super.ready();
        const { config } = this.getState();
        this.media = config.BLOCKLY_MEDIA;
        this.toolboxReady = false;
    }
    computeBlocks() {
        const blocks = [];
        if (this.parts) {
            this.parts
                .forEach((part) => {
                    part.blocks.forEach((definition) => {
                        if (typeof definition === 'object') {
                            blocks.push({ part, definition });
                        }
                    });
                    // Also register the legacy blocks to support shares made with previous block API
                    part.legacyBlocks.forEach((definition) => {
                        if (typeof definition === 'object') {
                            blocks.push({ part, definition });
                        }
                    });
                });
        }
        if (this.mode && this.mode.categories) {
            this.mode.categories.forEach((category) => {
                category.blocks.forEach((definition) => {
                    blocks.push({ part: this.mode, definition });
                });
            });
        }
        blocks.forEach(({ part, definition }) => this._registerBlock(part, definition));
    }
    _registerBlock(part, definition) {
        const block = definition.block(part);
        block.colour = part.colour;
        block.id = `${part.id}#${block.id}`;
        if (!block.doNotRegister) {
            Blockly.Blocks[block.id] = {
                init() {
                    this.jsonInit(block);
                },
            };
            Blockly.Blocks[block.id].customColor = block.colour;
        }
        Blockly.JavaScript[block.id] = definition.javascript(part);
        // Hack to register blocks from the normal mode under the dropzone id to support older shares
        if (part.id === 'normal') {
            block.id = block.id.replace('normal', 'dropzone');
            if (!block.doNotRegister) {
                Blockly.Blocks[block.id] = {
                    init() {
                        this.jsonInit(block);
                    },
                };
                Blockly.Blocks[block.id].customColor = block.colour;
            }
            Blockly.JavaScript[block.id] = definition.javascript(part);
        }
    }
    computeToolbox() {
        let categories,
            toolbox,
            parts = this.parts,
            blocks,
            weight;
        if (!this.defaultCategories) {
            return;
        }
        this.computeBlocks();
        weight = {
            ui: 1,
            data: 2,
            hardware: 3,
        };
        if (parts) {
            categories = parts
                .map((ui) => {
                    blocks = ui.blocks.map((definition) => {
                        if (typeof definition === 'string') {
                            return {
                                id: definition,
                                colour: ui.colour,
                            };
                        }
                        const block = definition.block(ui);
                        block.colour = ui.colour;
                        block.id = `${ui.id}#${block.id}`;
                        return {
                            id: block.id,
                            colour: block.colour,
                            shadow: block.shadow,
                        };
                    });
                    return {
                        name: ui.name,
                        colour: ui.colour,
                        id: ui.id,
                        weight: weight[ui.partType],
                        blocks,
                    };
                })
                .sort((a, b) => a.weight - b.weight);
        }

        categories = categories || [];
        categories = categories.filter(category => category.blocks.length);
        Object.keys(this.defaultCategories).forEach((id) => {
            const cat = this.defaultCategories[id];
            cat.blocks.forEach((block) => {
                block.colour = cat.colour;
            });
        });

        toolbox = Object.keys(this.defaultCategories).map(id => this.defaultCategories[id]);

        // Generate the toolbox for the special mode
        if (this.mode && this.mode.categories) {
            this.mode.categories.forEach((category) => {
                const modeCat = {
                    name: category.name,
                    id: category.id,
                    colour: category.colour,
                };
                modeCat.blocks = category.blocks.map((definition) => {
                    const block = definition.block(this.mode);
                    return {
                        id: `${this.mode.id}#${block.id}`,
                        colour: this.mode.colour,
                        shadow: block.shadow,
                    };
                });
                toolbox.push(modeCat);
            });
        }
        toolbox = toolbox.concat(categories);
        if (this.flyoutMode) {
            const flyout = toolbox.reduce((acc, entry) => acc.concat(entry.blocks), []);
            this.set('flyout', flyout);
            this.set('toolbox', null);
            this.set('noToolbox', true);
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
    _partsChanged(e) {
        // If the name changes, the id will do as well
        const idChanged = e.path.indexOf('name') === e.path.length - 4;
        if (e.path === 'parts' || e.path === 'parts.splices') {
            // Update the id registry when the parts array is changed or if any item is added/removed
            this._updateIdRegistry();
        }
        // Only update if the splices changes (part added or removed) or if the name of the part changes
        if (e.path === 'parts' || e.path === 'parts.splices' || idChanged) {
            this.computeToolboxDebounced();
            if (Blockly.Blocks && Blockly.Blocks.collision_event) {
                // Update the collision block with the new parts
                Blockly.Blocks.collision_event.setParts(this.parts);
            }
            // If the id changed, we need to upgrade the blocks already added
            if (idChanged) {
                this.debounce('reloadAfterIdChanged', () => {
                    let key = e.path.replace('parts.#', '').split('.').shift(),
                        oldId = this._idRegistry[key],
                        blocks = this.$['code-editor'].getBlocks(),
                        replaceRegexp = new RegExp(`type="${oldId}#`, 'g');

                    blocks = blocks.replace(replaceRegexp, `type="${this.parts[key].id}#`);
                    this.$['code-editor'].load({ blocks });
                    // Reflect the id change by updating the id registry
                    this._updateIdRegistry();
                }, 200);
            }
        }
    }
    _updateIdRegistry() {
        // Keeps a record of all the ids. If one changes, we can get the old value from here
        this._idRegistry = this.parts.map(part => part.id);
    }
    computeToolboxDebounced() {
        this.computeToolbox();
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
    canRemovePart(part) {
        let xmlString,
            xml,
            parser,
            blocks,
            block,
            blockId,
            pieces;
        // Get the blockly xml and parse it
        xmlString = this.$['code-editor'].getBlocks();
        parser = new DOMParser();
        xml = parser.parseFromString(xmlString, 'text/xml');
        // Get all the 'block' elements
        blocks = xml.getElementsByTagName('block');
        // Check for every one of them...
        for (let k = 0, len = blocks.length; k < len; k += 1) {
            block = blocks[k];
            blockId = block.getAttribute('type');
            pieces = blockId.split('#');
            // ...if the type of the block is the part we're trying to delete
            if (pieces[0] === part.id) {
                return true;
            }
        }
        return false;
    }
    getSource() {
        return this.$['code-editor'].getBlocks();
    }
}

customElements.define(KCBlocklyEditor.is, KCBlocklyEditor);
