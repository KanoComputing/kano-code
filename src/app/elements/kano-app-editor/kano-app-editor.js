/**
`kano-app-editor`

@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/

import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@polymer/paper-tabs/paper-tabs.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import 'js-beautify/js/lib/beautify.js';
import '../kano-workspace/kano-workspace.js';
import '../kano-part-editor/kano-part-editor.js';
import '../kano-animated-svg/kano-animated-svg.js';
import '../kano-code-display/kano-code-display.js';
import { Utils } from '../../scripts/kano/make-apps/utils.js';

class KanoAppEditor extends PolymerElement {
    static get is() { return 'kano-app-editor'; }
    static get properties() {
        return {
            code: {
                type: String,
            },
            workspaceTab: {
                type: String,
                value: 'workspace',
            },
            isResizing: {
                type: Boolean,
                value: false,
            },
            unsavedChanges: {
                type: Boolean,
                value: false,
                notify: true,
            },
        };
    }
    static get template() {
        return html`
        <style>
            :host {
                display: flex;
                flex-direction: row;
                position: relative;
                max-width: 100vw;
            }
            :host section {
                display: flex;
                flex-direction: row-reverse;
                flex: 1;
                flex-basis: 0.000000001px;
            }
            :host section #source-panel {
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                position: relative;
                min-width: 50%;
                max-width: 70%;
            }
            :host section #workspace-panel {
                display: flex;
                flex-direction: column;
                position: relative;
                min-width: 33%;
                max-width: 50%;
                width: 33%;
                background-color: var(--kano-app-editor-workspace-background, #f2f2f2);
            }
            .tab-selector {
                --paper-tabs: {
                    height: 32px;
                    background-color: var(--kano-app-editor-workspace-background, #f2f2f2);
                };
                --paper-tabs-selection-bar: {
                    border-bottom: none;
                };
            }
            .tab-selector .tab {
                --paper-tab: {
                    width: 50%;
                    color: #fff;
                    font-family: var(--font-body);
                    font-weight: bold;
                    text-transform: uppercase;
                    padding: 0;
                    border-top: 1px solid var(--kano-app-editor-workspace-background, #f2f2f2);
                    border-left: 1px solid var(--kano-app-editor-workspace-background, #f2f2f2);
                    padding: 0;
                };
                --paper-tab-content: {
                    padding: 0 8px;
                };
                --paper-tab-content-unselected: {
                    color: rgba(255, 255, 255, 0.5);
                    background-color: var(--color-abbey);
                };
                --paper-tab-ink: var(--color-dark);
            }
            :host iron-pages.workspace-pages {
                display: flex;
                flex-direction: column;
                flex: 1;
                flex-basis: 0.000000001px;
                overflow: visible;
            }
            :host #workspace-panel kano-workspace {
                flex: 1;
                flex-basis: 0.000000001px;
            }
            :host kano-code-display {
                @apply --flex-layout;
                margin: 16px;
            }
            :host [main] {
                display: flex;
                flex-direction: column;
                flex: 1;
                flex-basis: 0.000000001px;
                position: relative;
            }
            #source-container {
                display: flex;
                flex: 1;
            }
            #source-container>* {
                flex: 1;
            }
            :host #resize {
                position: absolute;
                width: 8px;
                top: 0px;
                bottom: 0px;
                right: -4px;
                cursor: ew-resize;
                background-color: transparent;
                z-index: 1;
            }
            :host .hidden {
                visibility: hidden;
                opacity: 0;
            }
            .editor {
                position: relative;
            }
            #edit-part-dialog {
                display: flex;
                flex-direction: column;
                flex: 1 1 auto;
                flex-shrink: 0;
                overflow: hidden;
                font-weight: bold;
                color: #fff;
            }
            .modal {
                width: 427px;
            }
            .large-modal {
                width: 880px;
            }
            :host([small-screen]) #edit-part-dialog {
                width: 100%;
                left: -32px !important;
            }
            :host #edit-part-dialog-content {
                margin: 0;
            }
            .icon-button {
                background: transparent;
                border: 0px;
                cursor: pointer;
            }
            paper-dialog {
                background-color: transparent;
                border-radius: 6px;
            }
            paper-dialog > * {
                border-radius: 6px;
            }
            .activity-bar {
                background: #1A1A1A;
                display: flex;
                flex-direction: column;
            }
            .activity-bar > button {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                width: 48px;
                height: 48px;
                background: transparent;
                border: none;
                padding: 8px;
                box-sizing: border-box;
                margin-bottom: 8px;
            }
            .activity-bar > button:not([disabled]) {
                cursor: pointer;
            }
            .activity-bar button:focus img {
                opacity: 1;
            }
            .activity-bar button:focus {
                outline: none;
            }
            .activity-bar button img.default {
                width: 24px;
                height: 24px;
            }
            .activity-bar button img.big {
                width: 32px;
                height: 32px;
            }
            .activity-bar button img:not(.important) {
                transition: opacity 0.15s ease;
                opacity: 0.5;
            }
            .activity-bar button:not([disabled]):hover img {
                opacity: 1;
            }
        </style>
        <div class="activity-bar" id="activity-bar"></div>
        <section id="section" on-mousemove="mouseMoved" on-mouseup="completedResizing">
            <div class="ui-edition" id="workspace-panel">
                <paper-tabs class="tab-selector" attr-for-selected="id" selected="{{workspaceTab}}" autoselect>
                    <paper-tab id="workspace" class="tab">Canvas</paper-tab>
                    <paper-tab id="code-display" class="tab">JavaScript</paper-tab>
                </paper-tabs>
                <iron-pages class="workspace-pages" attr-for-selected="id" selected="[[workspaceTab]]">
                    <kano-workspace id="workspace" class="visible-when-running"></kano-workspace>
                    <kano-code-display id="code-display" code="[[_setCodeDisplay(code, workspaceTab)]]" lang="javascript"></kano-code-display>
                </iron-pages>
            </div>
            <div name="code" class="editor" id="source-panel">
                <div id="resize" on-mousedown="resizeWorkspace" class="visible-when-running"></div>
                <div main="" class="main">
                    <slot name="above-code"></slot>
                    <div id="source-container"></div>
                    <slot name="under-code"></slot>
                </div>
            </div>
        </section>
        `;
    }
    /**
   * Load the saved work from the local storage
   */
    load(savedApp) {
        if (!savedApp) {
            return;
        }
        // Force a color update and a register block to make sure the loaded code will be
        // rendered with the right colors
        // TODO: Move to blockly plugin
        Utils.updatePartsColors(this.addedParts);
        this.$['root-view'].computeBlocks();
        this.unsavedChanges = false;
    }
    reset() {
        this.$['dialog-reset-warning'].open();
    }
    _toggleFullscreenModal(isFullScreen) {
        this.$['edit-part-dialog'].fitInto = isFullScreen ? window : this.$['source-panel'];
        this.$['edit-part-dialog'].withBackdrop = isFullScreen;
        this.toggleClass('large-modal', isFullScreen, this.$['edit-part-dialog-content']);
    }
    _repositionPanel(e) {
        const target = this.$[dom(e).rootTarget.id];
        this.async(() => target.parentElement.refit(), 10);
    }
    constructor() {
        super();
        this._openOfflineDialog = this._openOfflineDialog.bind(this);

        this.reset = this.reset.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.target = document.body;
        this.partEditorOpened = false;
        this.codeEditor = this.$['root-view'];
    }
    get sourceContainer() {
        return this.$['source-container']
    }
    _setCodeDisplay(code, workspaceTab) {
        if (workspaceTab === 'workspace') {
            return;
        }
        return js_beautify(code || '', { indent_size: 2 });
    }
    scaleToWorkspace(point) {
        let rect = this.workspaceRect,
            fullSize = this.mode.workspace.viewport;

        return {
            x: point.x / rect.width * fullSize.width,
            y: point.y / rect.height * fullSize.height,
        };
    }
    applyHiddenClass() {
        return this.running ? '' : 'hidden';
    }
    /**
   * Resize the workspace
   */
    resizeWorkspace(e) {
        this.pauseEvent(e);
        this.isResizing = true;
    }
    /**
   * Completed the resize action
   */
    completedResizing() {
        this.isResizing = false;
    }
    /**
   * Used to prevent text selection when dragging
   */
    pauseEvent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    /**
   * Mouse moved handler
   */
    mouseMoved(e) {
        const workspacePanel = this.$['workspace-panel'];
        const container = this.$.section;

        if (!this.isResizing) {
            return;
        }
        this.pauseEvent(e);

        const offsetPanel = container.getBoundingClientRect().right - e.clientX;
        workspacePanel.style.width = `${offsetPanel}px`;

        // We need to trigger the resize of the kano-ui-workspace and the blockly workspace
        window.dispatchEvent(new Event('resize'));
    }
    _onLockdownClicked() {
        this.fire('lockdown-clicked');
    }

    getBlockly() {
        return this.$['root-view'].getBlockly();
    }
    getBlocklyWorkspace() {
        return this.$['root-view'].getBlocklyWorkspace();
    }
    getWorkspace() {
        return this.$.workspace;
    }
    _openOfflineDialog() {
        this.$['dialog-offline'].open();
    }
}

customElements.define(KanoAppEditor.is, KanoAppEditor);
