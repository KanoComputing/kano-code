import * as code from '../index.js';

export class PartsOutputPlugin extends code.Plugin {
    constructor(partTypes, parts) {
        super();
        this.partTypes = partTypes;
        this.partList = parts;
        this._parts = [];
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
    }
    insertPart(part) {
        const { partsRoot } = this.output.outputView;
        if (!partsRoot) {
            return;
        }
        const partEl = document.createElement(part.tagName);
        partEl.className = part.partType;
        partEl.model = part;
        partEl.setAttribute('id', part.id);
        partEl.setAttribute('slot', 'part');
        partsRoot.appendChild(partEl);
    }
    setParts(parts) {
        this._parts = parts;
    }
    get parts() {
        return this._parts;
    }
}

export default PartsOutputPlugin;
