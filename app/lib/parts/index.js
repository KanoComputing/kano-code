import Parts from './parts.js';
import PartsActions from '../actions/parts.js';
import Plugin from '../editor/plugin.js';

class PartsPlugin extends Plugin {
    constructor(types) {
        super();
        this.types = types;
        this.parts = new Parts();
        this.partList = [];
    }
    onInstall(editor) {
        this.editor = editor;
        this.partsActions = PartsActions(this.editor.store);
        this.editor.on('add-part-request', this._onAddPartRequest.bind(this));
        this.editor.on('remove-part-request', this._onRemovePartRequest.bind(this));
    }
    onInject() {
        const addPartsForm = this.editor.getElement('add-parts-form');
        addPartsForm.addEventListener('confirm', this._onAddPartsFormConfirmed.bind(this));

        const workspace = this.editor.getWorkspace();
        workspace.addEventListener('open-parts-dialog', this._openPartsDialog.bind(this));

        this.types.forEach((PartClass) => {
            this.parts.defineType(PartClass.id, PartClass);
        });
        this.partList.forEach((partDefinition) => {
            this.parts.define(partDefinition);
        });
        this.updateAddPartsForm();
    }
    onModeSet(modeDefinition) {
        const modeParts = this.partList
            .filter(part => modeDefinition.parts.indexOf(part.type) !== -1);
        this.partsActions.updatePartsList(modeParts);
        this.editor.emit('parts-changed', modeParts);
        this.updateAddPartsForm();
    }
    updateAddPartsForm() {
        const addPartsForm = this.editor.getElement('add-parts-form');
        if (!addPartsForm) {
            return;
        }
        const { mode } = this.editor.store.getState();
        if (!mode) {
            return;
        }
        const modeParts = this.partList
            .filter(part => mode.parts.indexOf(part.type) !== -1);
        addPartsForm.availableParts = modeParts;
    }
    _onAddPartsFormConfirmed(e) {
        const addPartsDialog = this.editor.getElement('add-parts-dialog');
        addPartsDialog.close();
        this.editor.emit('add-part-request', e.detail);
    }
    _openPartsDialog() {
        const addPartsDialog = this.editor.getElement('add-parts-dialog');
        addPartsDialog.open();
    }
    onAppLoad(app) {
        this.parts.clear();
        if (!app) {
            return;
        }
        const { partsMap } = this.editor.store.getState();
        const { mode } = this.editor.store.getState();
        if (app.parts) {
            app.parts.forEach((savedPart) => {
                const model = partsMap[savedPart.type];
                const instanceModel = Object.assign({}, model, savedPart);
                const part = this.parts.create(instanceModel, mode.workspace.viewport);
                this.partsActions.addPart(part);
            });
        }
        this.editor.rootEl.load(app);
    }
    setParts(parts) {
        this.partList = parts;
    }
    _onAddPartRequest(e) {
        this.addPart(e);
    }
    _onRemovePartRequest(e) {
        this.removePart(e);
    }
    removePart(part) {
        this.partsActions.removePart(part);
        this.parts.freeId(part.name);
    }
    addPart(type) {
        const viewport = this.editor.getViewport();
        const viewportRect = viewport.getBoundingClientRect();
        const { partsMap } = this.editor.store.getState();
        const model = partsMap[type];
        const instanceModel = Object.assign({}, model);
        const { addedParts } = this.editor.store.getState();
        instanceModel.position = PartsPlugin.getNewPartPosition(viewportRect, addedParts.length);
        const { mode } = this.editor.store.getState();
        const part = this.parts.create(instanceModel, mode.workspace.viewport);
        this.partsActions.addPart(part);
    }
    static getNewPartPosition(viewportRect, count) {
        const layoutIndex = count % 9;
        const layoutIterationIndex = Math.floor(count / 9);
        let x;
        let y;

        // Position the part on a 3x3 grid in the workspace
        x = (((layoutIndex % 3) * viewportRect.width / 3) + viewportRect.width / 6);
        y = ((Math.floor(layoutIndex / 3) * viewportRect.height / 3)  + viewportRect.height / 6);

        // Make sure the 10th part and so on have an offset
        x += layoutIterationIndex * 20;
        y += layoutIterationIndex * 20;

        // Finally, restrict the position of the part to the workspace
        x = Math.min(x, viewportRect.width - 20);
        y = Math.min(y, viewportRect.height - 20);

        return { x, y };
    }
    onSave(app) {
        const { addedParts } = this.editor.store.getState();
        app.parts = addedParts.map(part => part.toJSON());
        return app;
    }
}

export default PartsPlugin;
