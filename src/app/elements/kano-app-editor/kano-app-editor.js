/**
`kano-app-editor`

@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/

import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/iron-overlay-behavior/iron-overlay-backdrop.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import 'interactjs/dist/interact.js';
import 'js-beautify/js/lib/beautify.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import { MediaQueryBehavior } from '../behaviors/kano-media-query-behavior.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import '../kano-media-query/kano-media-query.js';
import '../kano-workspace/kano-workspace.js';
import '../kano-part-editor/kano-part-editor.js';
import '../kc-blockly-editor/kc-blockly-editor.js';
import '../kano-animated-svg/kano-animated-svg.js';
import '../kano-code-display/kano-code-display.js';
import '../kano-alert/kano-alert.js';
import { Utils } from '../../scripts/kano/make-apps/utils.js';
import { Store } from '../../scripts/legacy/store.js';

class KanoAppEditor extends Store.StateReceiver(mixinBehaviors([
    AppEditorBehavior,
    AppElementRegistryBehavior,
    MediaQueryBehavior,
    I18nBehavior,
], PolymerElement)) {
    static get is() { return 'kano-app-editor'; }
    static get properties() {
        return {
            storeId: {
                type: Number,
            },
            parts: {
                type: Array,
                linkState: 'partsMap',
            },
            addedParts: {
                type: Array,
                linkState: 'addedParts',
            },
            code: {
                type: Object,
                linkState: 'code',
            },
            workspaceTab: {
                type: String,
                observer: '_workspaceTabChanged',
                linkState: 'workspaceTab',
            },
            remixMode: {
                type: Boolean,
                value: false,
            },
            selectedPartIndex: {
                linkState: 'selectedPartIndex',
            },
            selected: {
                linkArray: 'addedParts',
                linkIndex: 'selectedPartIndex',
            },
            running: {
                type: Boolean,
                observer: '_runningChanged',
                linkState: 'running',
            },
            editableLayout: {
                type: Boolean,
                value: false,
            },
            toolbox: {
                type: Object,
                linkState: 'toolbox',
            },
            isResizing: {
                type: Boolean,
                value: false,
            },
            mode: {
                type: Object,
                linkState: 'mode',
            },
            unsavedChanges: {
                type: Boolean,
                value: false,
                notify: true,
            },
        };
    }
    static get observers() {
        return [
            '_onPartsSet(parts)',
        ];
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
                @apply --layout-horizontal-reverse;
                flex: 1;
flex-basis: 0.000000001px;
            }
            :host section #source-panel {
                flex: 1 1 auto;
                display: flex;
flex-direction: column;
                @apply --kano-inset-box-shadow;
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
        <kano-media-query small-screen="{{smallScreen}}" medium-screen="{{mediumScreen}}" large-screen="{{largeScreen}}">
        </kano-media-query>
        <div class="activity-bar" id="activity-bar"></div>
        <section id="section" on-mousemove="mouseMoved" on-mouseup="completedResizing">
            <div class="ui-edition" id="workspace-panel">
                <paper-tabs class="tab-selector" attr-for-selected="id" selected="{{workspaceTab}}" autoselect="">
                    <paper-tab id="workspace" class="tab">Canvas</paper-tab>
                    <paper-tab id="code-display" class="tab">JavaScript</paper-tab>
                </paper-tabs>
                <iron-pages class="workspace-pages" attr-for-selected="id" selected="[[workspaceTab]]">
                    <kano-workspace id="workspace" store-id="[[storeId]]" class="visible-when-running" selected="{{selected}}" editable-layout="{{editableLayout}}" parts-menu-open="[[partsMenuOpen]]" on-ui-ready="workspaceUiReady" on-change="_proxyChange"></kano-workspace>
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
        <kano-alert id="dialog-reset-warning" heading="[[localize('RESET', 'Reset')]]" text="[[localize('ABOUT_TO_RESET', 'You\\'ll lose any unsaved changes')]]" on-iron-overlay-closed="_modalClosed" with-backdrop>
        </kano-alert>
        `;
    }
    _hasSelectedPart() {
        return typeof this.selectedPartIndex !== 'undefined' && this.selectedPartIndex !== null;
    }
    _exitTapped() {
        this.fire('tracking-event', {
            name: 'ide_exited',
        });
        this.fire('exit');
    }
    // Make sure that no conflicting modals are opened at the same time
    _manageModals(e) {
        const notifier = dom(e).rootTarget.id;
        const nonConcurringModalIds = [
            'edit-part-dialog',
        ];

        // Check if the notifier is on the check list and if it's opened
        if (nonConcurringModalIds.indexOf(notifier) < 0 || !this.$[notifier].opened) {
            return;
        }

        // Close all non-concurring modals except the one that has just been opened
        nonConcurringModalIds.forEach((modal) => {
            if (modal !== notifier && this.$[modal].opened) {
                this.$[modal].close();
            }
        });
    }
    _newPartRequest(e) {
        if (!e.detail || !e.detail.data || !e.detail.data.product) {
            return;
        }
        const model = e.detail.data;

        // Too early
        if (!Array.isArray(this.parts)) {
            this.queuedHardware = this.queuedHardware || [];
            this.queuedHardware.push(model);
            return;
        }

        if (!this.queuedHardware || this.queuedHardware.indexOf(model) === -1) {
            this._addHardwarePart(model.product);
        }
    }
    _addHardwarePart(product) {
        let model;
        for (let i = 0; i < this.parts.length; i += 1) {
            model = this.parts[i];
            if (model.supportedHardware && model.supportedHardware.indexOf(product) >= 0) {
                this._addPart({ detail: model.type });
                break;
            }
        }
    }
    _addPart(e) {
        const type = e.detail;
        this.dispatchEvent(new CustomEvent('add-part-request', { detail: type }));
    }
    _isPauseOverlayHidden(running, editableLayout) {
        return running || editableLayout;
    }
    _proxyChange(e) {
        // Bug on chrome 49 on the kit, the event from kano-blockly stops here
        e.preventDefault();
        e.stopPropagation();
        this.fire('change', e.detail);
    }
    _modalClosed(e) {
        if (e.detail.confirmed) {
            switch (dom(e).rootTarget.id) {
            case 'dialog-reset-warning': {
                this._dialogConfirmedReset();
                break;
            }
            default: {
                break;
            }
            }
        } else {
            switch (dom(e).rootTarget.id) {
            case 'dialog-reset-warning': {
                this.fire('tracking-event', {
                    name: 'workspace_reset_dialog_closed',
                });
                break;
            }
            default: {
                break;
            }
            }
        }
    }
    _dialogConfirmedReset() {
        this.fire('tracking-event', {
            name: 'workspace_reset_dialog_confirmed',
        });
        this.dispatchEvent(new CustomEvent('reset'));
        this.unsavedChanges = false;
    }
    isPartDeletionDisabled() {
        return this.partEditorOpened || this.running;
    }
    /**
   * Save the current work in the local storage
   */
    save(snapshot = false) {
        const state = this.getState();
        const savedApp = {};
        savedApp.code = state.code;
        savedApp.source = this.$['root-view'].getSource();
        if (state.mode) {
            savedApp.mode = state.mode.id;
        }
        if (snapshot) {
            savedApp.snapshot = true;
            savedApp.selectedPart = state.addedParts.indexOf(this.selected);
        }

        return savedApp;
    }
    compileApp() {
        return {
            app: this.save(false, false),
            workspaceInfo: JSON.stringify(this.save()),
            code: this.code,
            parts: this.addedParts,
        };
    }
    generateCover() {
        return this.$.workspace.generateCover();
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
    onPartSettings(e) {
        // No part selected, show the background editor
        if (!this.selected) {
            this._toggleFullscreenModal(false);
        } else {
            this._toggleFullscreenModal(this.selected.fullscreenEdit);
            this.$['edit-part-dialog'].open();
            this.notifyChange('open-part-settings', { part: this.selected });
        }
    }
    _closePartSettings() {
        this.$['edit-part-dialog'].close();
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
    _deletePart(part) {
        this.dispatchEvent(new CustomEvent('remove-part-request', { detail: part }));
        this.$.workspace.clearSelection();
    }
    _onPartsSet(parts) {
        if (!this.queuedHardware) {
            return;
        }

        this.async(() => {
            let product,
                partTypes;

            // Unqueue any parts that have been set already
            this.addedParts.forEach((p) => {
                for (let i = 0; i < this.queuedHardware.length; i++) {
                    if (this.queuedHardware[i].product === p.type) {
                        this.splice('queuedHardware', i, 1);
                    }
                }
            });

            for (let i = 0; i < this.queuedHardware.length; i++) {
                product = this.queuedHardware[i].product;
                partTypes = this.parts.map(p => p.type);
                if (partTypes.indexOf(product) > -1) {
                    this._addHardwarePart(product);
                    this.splice('queuedHardware', i, 1);
                }
            }
        }, 5);
    }
    onPartReady(e) {
        let clone;
        interact(e.detail).draggable({
            onmove: (event) => {
                let target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
              target.style.transform =
                  `translate(${  x  }px, ${  y  }px)`;

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            restrict: {
                restriction: this.$.section,
            },
            onend: () => {
                this.$.section.removeChild(clone);
            },
        }).on('move', (event) => {
            const interaction = event.interaction;

            // if the pointer was moved while being held down
            // and an interaction hasn't started yet
            if (interaction.pointerIsDown && !interaction.interacting()) {
                let original = event.currentTarget,
                    rect = original.getBoundingClientRect(),
                    style;

                // create a clone of the currentTarget element
                clone = dom(original).cloneNode(true);
                style = clone.style;
                clone.model = original.model;
                clone.colour = original.colour;
                style.position = 'absolute';
                style.top = `${rect.top}px`;
                style.left = `${rect.left}px`;
                style.zIndex = 11;

                // insert the clone to the page
                this.$.section.appendChild(clone);

                // start a drag interaction targeting the clone
                interaction.start(
                    { name: 'drag' },
                    event.interactable,
                    clone,
                );
            }
        });
    }
    bindEvents() {
        this.addEventListener('opened-changed', this._manageModals);
        this.updateWorkspaceRect = this.updateWorkspaceRect.bind(this);
        this.onIronSignal = this.onIronSignal.bind(this);

        this.$.workspace.addEventListener('viewport-resize', this.updateWorkspaceRect);
        document.addEventListener('iron-signal', this.onIronSignal);
    }
    detachEvents() {
        this.removeEventListener('opened-changed', this._manageModals);
        this.$.workspace.removeEventListener('viewport-resize', this.updateWorkspaceRect);
        document.removeEventListener('iron-signal', this.onIronSignal);
    }
    constructor() {
        super();
        this._openOfflineDialog = this._openOfflineDialog.bind(this);
        this._manageModals = this._manageModals.bind(this);

        this.reset = this.reset.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.target = document.body;
        this.partEditorOpened = false;
        this.codeEditor = this.$['root-view'];

        this.bindEvents();
        this._registerElement('workspace-panel', this.$['workspace-panel']);
        this._registerElement('source-panel', this.$['source-panel']);
        // TODO: solve this
        // this._registerElement('parts-panel', this.$['parts-modal']);
        // Legacy
        this._registerElement('blocks-panel', this.$['source-panel']);

        const tpl = document.createElement('template');

        const elMap = {
            blockly: 'kc-blockly-editor',
            code: 'kc-code-editor',
        };

        const { sourceType } = this.getState();

        tpl.innerHTML = `
              <${elMap[sourceType]}
              store-id="[[storeId]]"
              id="root-view"
              on-change="_proxyChange"
              on-exit-tapped="_exitTapped"
              default-categories="[[defaultCategories]]"
              loading$="[[!mode]]"></${elMap[sourceType]}>`;

        const template = html`${tpl}`;

        const instance = this._stampTemplate(template);

        this.$['source-container'].appendChild(instance);

        this.$['root-view'] = this.shadowRoot.querySelector('#root-view');
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.detachEvents();
    }
    onIronSignal(e) {
        if (!e.detail) {
            return;
        }
        switch (e.detail.name) {
        case 'new-part-request':
            this._newPartRequest(e);
            break;
        default:
            break;
        }
    }
    _setCodeDisplay(code, workspaceTab) {
        if (workspaceTab === 'workspace') {
            return;
        }
        return js_beautify(code || '', { indent_size: 2 });
    }
    updateWorkspaceRect(e) {
        this.set('workspaceRect', e.detail);
    }
    /**
   * Add draggable properties to the added element in the workspace
   * @param  {Event} e
   */
    workspaceUiReady(e) {
        const element = e.detail;
        if (element.instance) {
            return;
        }
        if (!this.draggables) {
            this.draggables = [];
        }
        this.draggables.push(element);
        this._enableDrag(element);
    }
    getDragMoveListener(scale = false) {
        return (event) => {
            let target = event.target,
                pos = target.model.position,
                delta = {
                    x: event.dx,
                    y: event.dy,
                };

            if (scale) {
                delta = this.scaleToWorkspace(delta);
            }

            pos.x += delta.x;
            pos.y += delta.y;

            target.set('model.position.x', pos.x);
            target.set('model.position.y', pos.y);
            target.notifyPath('model.position');
        };
    }
    scaleToWorkspace(point) {
        let rect = this.workspaceRect,
            fullSize = this.mode.workspace.viewport;

        return {
            x: point.x / rect.width * fullSize.width,
            y: point.y / rect.height * fullSize.height,
        };
    }
    _cleanDraggables() {
        if (!this.draggables) {
            this.draggables = [];
        }
        // If a part is removed, the element will disappear from the array
        this.draggables = this.draggables.filter(d => !!d);
    }
    _disableDrag() {
        this._cleanDraggables();
        this.draggables.forEach((draggable) => {
            interact(draggable).draggable(false);
        });
    }
    _enableDrag(el) {
        let draggables;
        let restrictEl;
        this._cleanDraggables();
        if (el) {
            draggables = [el];
        } else {
            draggables = this.draggables;
        }
        draggables.forEach((draggable) => {
            if (!draggable.model) {
                return;
            }
            restrictEl = draggable.model.restrict === 'workspace' ?
                this.editor.outputView.getRestrictElement() : this.$['workspace-panel'];
            interact(draggable).draggable({
                onmove: this.getDragMoveListener(true),
                onend: (e) => {
                    const model = e.target.model;
                    this.notifyChange('move-part', {
                        part: model,
                    });
                },
                restrict: {
                    restriction: restrictEl,
                },
            });
        });
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

    _runningChanged() {
        this.notifyChange('running', {
            value: this.running,
        });
        if (!this.running) {
            this._enableDrag();
        } else {
            // Disable drag when starts
            this._disableDrag();
            this.set('editableLayout', false);
        }
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
    _workspaceTabChanged(current, previous) {
        if (current && previous) {
            this.fire('tracking-event', {
                name: 'workspace_view_changed',
                data: {
                    view: current,
                },
            });
        }
    }
}

customElements.define(KanoAppEditor.is, KanoAppEditor);
