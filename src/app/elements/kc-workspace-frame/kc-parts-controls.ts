import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { customElement, property } from '@polymer/decorators/lib/decorators.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/styles/color.js';
import { close } from '@kano/icons/ui.js';
import '../kano-icons/kc-ui.js';
import '../kano-part-list-item/kano-part-list-item.js';
import { EventEmitter, IDisposable } from '@kano/common/index.js';

export interface IStackEntry {
    id : string;
    name : string;
}

@customElement('kc-parts-controls')
export class KCPartsControls extends  PolymerElement {
    private _onDidClickAddParts : EventEmitter = new EventEmitter();
    private _onDidClickRemovePart : EventEmitter<string> = new EventEmitter();
    @property({ type: Array })
    public parts : any[] = [];
    public get onDidClickAddParts() {
        return this._onDidClickAddParts.event;
    }
    public get onDidClickRemovePart() {
        return this._onDidClickRemovePart.event;
    }
    static get template() {
        return html`
        <style>
            :host {
                display: block;
            }
            .add-parts {
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid #202428;
            }
            .add-parts label {
                margin: 0;
                cursor: pointer;
            }
            button#add-part-button {
                align-self: flex-end;
                background: rgba(255, 255, 255, 0.25);
                color: rgba(255, 255, 255, 0.75);
                border-radius: 3px;
            }
            button#add-part-button {
                display: flex;
                flex-direction: row;
                padding: 8px 10px;
                font-size: 12px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            }
            button#add-part-button:hover {
                background: #fd6a21;
            }
            button#add-part-button:hover > label {
                color: white;
            }
            button>* {
                margin: 0 auto;
            }
            paper-dialog {
                background: transparent;
            }
            .part-list {
                flex: 1;
                flex-basis: 0.000000001px;
                display: flex;
                flex-direction: column;
                overflow: auto;
                padding-bottom: 40px;
            }
            .part {
                flex: none;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid #202428;
                height: 40px;
                color: #fff;
            }
            .part.sortable-ghost {
                opacity: 0.3;
            }
            .part.sortable-drag {
                background-color: var(--kano-app-editor-workspace-background);
                box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.75);
            }
            kano-part-list-item {
                flex: 1;
                flex-basis: 0.000000001px;
                cursor: pointer;
                max-width: 100%;
            }
            iron-icon {
                --iron-icon-width: 27px;
                --iron-icon-height: 27px;
                --iron-icon-fill-color: #8F9195;
            }
            button#add-part-button iron-icon {
                fill: rgba(255, 255, 255, 0.75);
            }
            button#add-part-button:hover iron-icon {
                fill: rgba(255, 255, 255, 1);
            }
            button#add-part-button iron-icon {
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                margin-right: 0px;
            }
            .handle {
                cursor: move;
            }
            button.remove {
                background: inherit;
                cursor: pointer;
                line-height: 0;
                border: 0;
                width: 24px;
                height: 24px;
                padding: 6px;
                fill: #8F9195;
                outline: none;
            }
            .remove:hover {
                fill: var(--color-flamingo);
            }
            iron-icon.handle:hover {
                fill: #fff;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div class="add-parts">
            <button id="add-part-button" type="button" on-click="_addPartClicked">
                <label for="add-part-button">Add Parts</label>
                <iron-icon icon="kc-ui:add"></iron-icon>
            </button>
        </div>
        <div class="part-list">
            <slot name="extra-parts"></slot>
            <!-- TODO: add sortable back in when needed and deal with crashing bug -->
            <!-- <sortable-js handle=".handle" animation="150"> -->
                <template is="dom-repeat" items="[[parts]]" as="part">
                    <div class="part" id$="part-[[part.id]]">
                        <kano-part-list-item model="[[part]]" on-click="_partItemTapped"></kano-part-list-item>
                        <button type="button" class="remove" on-click="_removePartClicked">
                            ${close}
                        </button>
                        <!-- <iron-icon class="handle" icon="kc-ui:handle"></iron-icon> -->
                    </div>
                </template>
            <!-- </sortable-js> -->
        </div>
`;
    }
    _addPartClicked() {
        this._onDidClickAddParts.fire();
    }
    _removePartClicked(e : any) {
        const part = e.model.get('part');
        this._onDidClickRemovePart.fire(part.id);
    }
    _removePart(e : any) {
        const part = e.model.get('part');
        this.dispatchEvent(new CustomEvent('remove-part', { detail: part }));
    }
    _partItemTapped(e : any) {
        e.preventDefault();
        const part = e.model.get('part');
        this.dispatchEvent(new CustomEvent('part-clicked', { detail: part }));
    }
    addEntry(model : IStackEntry) : IDisposable {
        const item = { name: model.name, id: model.id };
        this.push('parts', item);
        return {
            dispose: () => {
                const index = this.parts.indexOf(item);
                this.splice('parts', index, 1);
            },
        };
    }
}