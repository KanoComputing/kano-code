import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { SoundPlayerBehavior } from '@kano/web-components/kano-sound-player-behavior/kano-sound-player-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import { CoverGeneratorBehavior } from '../behaviors/kano-cover-generator-behavior.js';
import { Store } from '../../scripts/legacy/store.js';

const behaviors = [
    CoverGeneratorBehavior,
    SoundPlayerBehavior,
    AppElementRegistryBehavior,
];
class KanoWorkspace extends Store.StateReceiver(mixinBehaviors(behaviors, PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
                @apply --layout-vertical;
                position: relative;
                border: 0px;
                overflow: hidden;
            }
            :host ::slotted(#dropzone) {
                margin: auto;
                position: relative;
            }
            #workspace-placeholder {
                @apply --layout-flex-auto;
                @apply --layout-vertical;
            }
            #workspace-placeholder>* {
                @apply --layout-flex-auto;
                animation: fade-in 200ms linear;
            }
            *[hidden] {
                display: none !important;
            }
            @keyframes fade-in {
                from { opacity: 0 },
                to { opacity: 1 }
            }
        </style>
        <!-- The variable workspace component will be inserted here -->
        <div id="workspace-placeholder" on-tap="onTap"></div>
        <iron-a11y-keys keys="tab" on-keys-pressed="_selectNextPart" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="shift+tab" on-keys-pressed="_selectPrevPart" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="shift+left left" on-keys-pressed="_moveLeft" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="shift+right right" on-keys-pressed="_moveRight" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="shift+up up" on-keys-pressed="_moveUp" target="[[target]]"></iron-a11y-keys>
        <iron-a11y-keys keys="shift+down down" on-keys-pressed="_moveDown" target="[[target]]"></iron-a11y-keys>
`;
    }

    static get is() { return 'kano-workspace'; }
    static get properties() {
        return {
            parts: {
                type: Array,
                linkState: 'addedParts',
            },
            running: {
                type: Boolean,
                value: false,
                observer: 'runningChanged',
                linkState: 'running',
            },
            selectedIndex: {
                type: Number,
                linkState: 'selectedPartIndex',
            },
            selected: {
                type: Object,
                linkArray: 'parts',
                linkIndex: 'selectedIndex',
                observer: '_selectedChanged',
            },
            internalSelection: {
                type: Object,
                value: null,
            },
            mode: {
                type: Object,
                observer: '_modeChanged',
                linkState: 'mode',
            },
            background: {
                type: String,
                linkState: 'background',
                observer: 'backgroundChanged',
            },
        };
    }
    static get observers() {
        return [
            'partsChanged(parts.*)',
        ];
    }
    _computeSelectedPart(parts, index) {
        if (!parts) {
            return;
        }
        return parts[index];
    }
    constructor() {
        super();
        this.elements = {};
        this.tappedElement = null;
        this.dropzone = null;
        this.devices = {};
        this.devices.get = this._getPartById.bind(this);
        this._partSelected = this._partSelected.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('part-selected', this._partSelected);
        this.target = document.body;
        // Enable pop on drop part only after initialisation
        this.async(() => {
            this.soundReady = true;
        }, 500);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('part-selected', this._partSelected);
    }
    _moveLeft(e) {
        this._movePart('left', e.detail.keyboardEvent.shiftKey);
    }
    _moveRight(e) {
        this._movePart('right', e.detail.keyboardEvent.shiftKey);
    }
    _moveUp(e) {
        this._movePart('up', e.detail.keyboardEvent.shiftKey);
    }
    _moveDown(e) {
        this._movePart('down', e.detail.keyboardEvent.shiftKey);
    }
    _movePart(dir, shift) {
        let movement,
            axis,
            partElem,
            x,
            y;
        if (!this.selected || !this.dropzone) {
            return;
        }
        movement = (dir === 'right' || dir === 'down') ? 1 : -1;
        if (shift) {
            movement *= 10;
        }
        x = (dir === 'right' || dir === 'left') ? movement : 0;
        y = (dir === 'up' || dir === 'down') ? movement : 0;
        partElem = this.dropzone.querySelector(`#${this.selected.id}`);
        partElem.move(x, y);
    }
    _selectNextPart(e) {
        let selectedIndex = this.parts.indexOf(this.selected),
            nextPartIndex;
        if (this.parts.length) {
            nextPartIndex = selectedIndex + 1;
            if (nextPartIndex >= this.parts.length) {
                nextPartIndex = 0;
            }
            this.dispatch({ type: 'SELECT_PART', index: nextPartIndex });
        }
        e.detail.keyboardEvent.preventDefault();
        e.detail.keyboardEvent.stopPropagation();
    }
    _selectPrevPart(e) {
        let selectedIndex = this.parts.indexOf(this.selected),
            prevPartIndex;
        if (this.parts.length) {
            if (selectedIndex <= -1) {
                selectedIndex = this.parts.length;
            }
            prevPartIndex = selectedIndex - 1;
            this.dispatch({ type: 'SELECT_PART', index: prevPartIndex });
        }
        e.detail.keyboardEvent.preventDefault();
        e.detail.keyboardEvent.stopPropagation();
    }
    _getPartById(id) {
        const dropzone = this.$$('.dropzone');
        if (id === dropzone.getAttribute('id') || id === 'dropzone') {
            return dropzone.getWorkspace();
        }
        return dropzone.querySelector(`#${id}`);
    }
    backgroundChanged(bg) {
        const dropzone = this.$$('.dropzone');
        if (dropzone && dropzone.setBackground) {
            dropzone.setBackground(bg);
        }
    }
    _modeChanged(mode) {
        const placeholder = this.$$('#workspace-placeholder');
        const modeId = mode.id;
        const tagName = mode.editorTagName || `kano-editor-${modeId}`;
        const tpl = document.createElement('template');

        tpl.innerHTML = `<${tagName} id$="[[mode.id]]"
                                          parts="[[parts]]"
                                          class="dropzone"
                                          width="[[mode.workspace.viewport.width]]"
                                          height="[[mode.workspace.viewport.height]]"
                                          running="[[running]]">
                                          </${tagName}>`;

        const template = html`${tpl}`;
        this.instance = this._stampTemplate(template);

        /* Remove old dropzone and add new one */
        if (this.dropzone) {
            placeholder.removeChild(this.dropzone);
        }
        placeholder.appendChild(this.instance);

        /* Update dropzone reference */
        this.dropzone = this.shadowRoot.querySelector(`#${this.mode.id}`);

        if (this.dropzone.setBackground) {
            this.dropzone.setBackground(this.background);
        }

        this.parts.forEach((model, index) => {
            this.insertPart(`#${index}`);
        });
        this.fire('mode-ready');
    }
    onTap(e) {
        let target;
        if (this.running) {
            return;
        }
        target = e.path ? e.path[0] : e.target;
        if (target === this.dropzone) {
            this.clearSelection();
        } else if (target === this.$.content) {
            this.clearSelection();
            this.fire('close-settings');
        }
    }
    clearSelection() {
        if (this.dropzone) {
            const selectedPartElement = this.dropzone.querySelector('.selected');
            this.toggleClass('selected', false, selectedPartElement);
        }
        this.dispatch({ type: 'SELECT_PART', index: null });
    }
    partFromElement() {
        const model = this.tappedElement.model;
        for (let i = 0; i <= this.parts.length; i++) {
            const part = this.parts[i];
            if (model.id === part.id) {
                return part;
            }
        }
    }
    _partSelected(e) {
        const part = e.detail;
        this.fire('change', {
            type: 'select-part',
            part,
        });
        if (this.selected && part.id === this.selected.id) {
            this.fire('close-settings');
            this.clearSelection();
        } else {
            const selectedPartElement = this.dropzone.querySelector('.selected');
            this.toggleClass('selected', false, selectedPartElement);
            const partIndex = this.parts.indexOf(part);
            this.dispatch({ type: 'SELECT_PART', index: partIndex });
        }
    }
    _selectedChanged() {
        const part = this.selected;
        let partElement;
        if (!this.dropzone || !part) {
            return;
        }
        partElement = this.dropzone.querySelector(`#${part.id}`);
        this.toggleClass('selected', true, partElement);
        this.fire('open-settings');
    }
    partsChanged(e) {
        if (!e) {
            return;
        }
        const { path } = e;
        if (path === 'parts.splices') {
            e.value.indexSplices.forEach((s) => {
                s.removed.forEach((removedPart, i) => {
                    const oldIndex = s.index + i;
                    this.removePart(oldIndex);
                });
                for (let i = 0; i < s.addedCount; i += 1) {
                    const index = s.index + i;
                    this.insertPart(index);
                }
            });
        } else if (path === 'parts') {
            if (this.elements) {
                // Clean the dropzone
                Object.keys(this.elements).forEach(this.removePart.bind(this));
            }
            if (!this.parts) {
                return;
            }
            // Insert the elements from the models
            this.parts.forEach((model, index) => {
                this.insertPart(`${index}`);
            });
        }
    }
    propagateChange(key, path, value) {
        const element = this.elements[key];
        if (!element) {
            return;
        }
        element.set(path, value);
    }
    insertPart(key) {
        const model = this.get(`parts.${key}`);
        if (!this.dropzone) {
            return;
        }
        const { tagName } = model;
        const tpl = document.createElement('template');
        tpl.innerHTML = `<${tagName} id="${model.id}" slot="part" class="${model.partType}" model="{{parts.${key}}}"></${tagName}>`;
        const template = html`${tpl}`;
        const stamp = this._stampTemplate(template);
        const element = stamp.firstChild;
        this.elements[key] = element;
        this._attachPartElementToDOM(element);
        if (this.soundReady) {
            this.debounce('playStartupSound', () => {
                this.playSound('/assets/audio/sounds/pop.wav');
            }, 100);
        }
        this._registerElement(`workspace-part-${model.id}`, element);
    }
    /*
  * Insert the element to the dropzone by reverse-sorting it
  * into the DOM so z-indexes match the order in the parts
  * array (e.g., the part with index 0 will be rendered on
  * top, which means it needs to be last the DOM).
  */
    _attachPartElementToDOM(element) {
        let model = element.model,
            reverseParts = this.parts.slice().reverse(),
            index = reverseParts.indexOf(model);

        if (index < reverseParts.indexOf(this.dropzone.lastChild.model)) {
            /* If the element doesn't belong at the end,
          find the right element to insert it before */
            for (let i = 0; i < this.dropzone.children.length; i++) {
                let child = this.dropzone.children[i],
                    childIndex = reverseParts.indexOf(child.model);
                if (childIndex > index) {
                    this.dropzone.insertBefore(element, child);
                    break;
                }
            }
        } else {
            /* If ll existing elements come before this one, append it. */
            this.dropzone.appendChild(element);
        }
    }
    removePart(key) {
        const element = this.elements[key];
        if (!element) {
            return;
        }
        this.dropzone.removeChild(element);
        delete this.elements[key];
    }
    getPartsDict() {
        const dict = Object.keys(this.elements).reduce((acc, key) => {
            // Get the model linked to the element
            const model = this.get(`parts.${key}`);
            if (!model) {
                return acc;
            }
            acc[model.id] = this.elements[key];
            return acc;
        }, {});
        if (this.dropzone) {
            dict[this.mode.id] = this.dropzone.getViewport();
            // Support legacy apps
            dict.dropzone = this.dropzone.getViewport();
        }
        return dict;
    }
    runningChanged() {
        if (this.running) {
            this.classList.add('running');
            this.clearSelection();
        } else {
            this.classList.remove('running');
        }
    }
    getPartIndexById(id) {
        const elements = this.parts;
        for (let i = 0, len = elements.length; i < len; i++) {
            if (elements[i].id === id) {
                return i;
            }
        }
    }
    getViewport() {
        return this.$$('.dropzone').getViewport();
    }
    getViewportScale() {
        return this.dropzone.getViewportScale();
    }
    generateCover() {
        return CoverGeneratorBehavior.generateCover(
            this.dropzone,
            this.parts,
            this.mode.workspace.viewport.width,
            this.mode.workspace.viewport.height,
        );
    }
    reset() {
        if (this.dropzone) {
            this.dropzone.clear();
        }
        this.fire('tracking-event', {
            name: 'workspace_reset',
        });
    }
}

customElements.define(KanoWorkspace.is, KanoWorkspace);
