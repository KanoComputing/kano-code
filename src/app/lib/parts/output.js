import { EventEmitter } from '@kano/common/index.js';
import { Plugin } from '../editor/plugin.js';
import { Parts } from './parts.js';

export class PartsOutputPlugin extends Plugin {
    constructor(partTypes, parts) {
        super();
        this._onDidChangeParts = new EventEmitter();
        this.partTypes = partTypes;
        this.partList = parts;
        this._parts = [];
        this._partsModelManager = new Parts();
        partTypes.forEach((PartClass) => {
            this._partsModelManager.defineType(PartClass.id, PartClass);
        });
        parts.forEach((partDefinition) => {
            this._partsModelManager.define(partDefinition);
        });
    }
    get onDidChangeParts() {
        return this._onDidChangeParts.event;
    }
    onInstall(output) {
        this.output = output;
        this.output.partsPlugin = this;
    }
    /**
     * Inject all the parts to the output when loading a creation
     * @param {Object} data Creation Data
     */
    onCreationImport(data) {
        const { parts } = data;
        if (!parts) {
            return;
        }
        parts.forEach((part) => {
            this.insertPart(part);
        });
        this.setParts(parts);
    }
    insertPart(part) {
        const { partsRoot } = this.output.outputView;
        if (!partsRoot) {
            return;
        }
        const partEl = document.createElement(part.tagName);
        partEl.className = part.partType;
        partEl.model = this._partsModelManager.create(part, {});
        partEl.setAttribute('id', part.id);
        partEl.setAttribute('slot', 'part');
        partsRoot.appendChild(partEl);
    }
    setParts(parts) {
        this._parts = parts;
        this._onDidChangeParts.fire();
    }
    get parts() {
        return this._parts;
    }
}

export default PartsOutputPlugin;
