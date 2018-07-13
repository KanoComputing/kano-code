import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import Parts from './parts.js';
import PartsActions from '../actions/parts.js';
import { Plugin } from '../editor/plugin.js';
import { LegacyFactory } from './legacy-factory.js';
import { getPartColor } from './util/color.js';
import { AddPartDialogProvider } from './dialogs/add-part.js';
import { EditPartDialogProvider } from './dialogs/edit-part.js';
import { PartsOutputPlugin } from './output.js';

export { PartsOutputPlugin };

export class PartsPlugin extends Plugin {
    constructor(outputPlugin) {
        super();
        this.outputPlugin = outputPlugin;
        this.parts = new Parts();
        this.partList = [];
        this.toolbox = new Map();
        this.elements = {};
        this.setPartTypes(this.outputPlugin.partTypes);
        this.setParts(this.outputPlugin.partList);
        this._onPartSelected = this._onPartSelected.bind(this);
        this._onEditPartDialogClosed = this._onEditPartDialogClosed.bind(this);
    }
    onInstall(editor) {
        this.editor = editor;
        this.partsActions = PartsActions(this.editor.store);
        if (this.partsActions) {
            this.partsActions.updatePartsList(this.partList);
        }
        // app-editor is still requesting to create parts on hardware detection
        this.editor.on('add-part-request', this._onAddPartRequest.bind(this));
        this.editor.on('remove-part-request', this._onRemovePartRequest.bind(this));
    }
    onInject() {
        this.setupDialogs();
        this.setupPartsControls();
        this.setupKeybindings();

        this.editor.output.on('running-state-changed', () => {
            const running = this.editor.output.getRunningState();
            if (!running) {
                return;
            }
            this.clearSelection();
        });
    }
    setupDialogs() {
        this.editPartDialogProvider = new EditPartDialogProvider(this.editor);
        this.editPartDialogProvider.on('update', this._onPartUpdate.bind(this));
        this.editPartDialog = this.editor.dialogs.registerDialog(this.editPartDialogProvider);
        this.editPartDialog.on('close', this._onEditPartDialogClosed);

        this.addPartDialogProvider = new AddPartDialogProvider(this.editor);
        this.addPartDialogProvider.on('confirm', this._onAddPartsFormConfirmed.bind(this));

        this.addPartDialog = this.editor.dialogs.registerDialog(this.addPartDialogProvider);
    }
    setupPartsControls() {
        const { workspaceView } = this.editor;
        if (!workspaceView.partsControls) {
            return;
        }
        workspaceView.partsControls.addEventListener('part-selected', this._onPartSelected);
        workspaceView.partsControls.addEventListener('open-parts-dialog', this._openPartsDialog.bind(this));
        workspaceView.partsControls.addEventListener('remove-part', this._removePartRequest.bind(this));
    }
    setupKeybindings() {
        this._selectNextPart = this._selectNextPart.bind(this);
        this.tabBinding = this.editor.keybindings.register('tab', this._selectNextPart, window);
        this.tabBinding = this.editor.keybindings.register('shift+tab', this._selectPrevPart, window);
    }
    _selectNextPart(e) {
        const { selectedPartIndex, addedParts } = this.editor.store.getState();
        let nextPartIndex;
        if (addedParts.length) {
            nextPartIndex = selectedPartIndex + 1;
            if (nextPartIndex >= this.parts.length) {
                nextPartIndex = 0;
            }
            this.partsActions.select(nextPartIndex);
            this.editPartDialogProvider.setSelected(addedParts[nextPartIndex]);
            setTimeout(() => {
                this.editPartDialog.refit();
            });
        }
        e.detail.keyboardEvent.preventDefault();
        e.detail.keyboardEvent.stopPropagation();
    }
    _selectPrevPart(e) {
        const { selectedPartIndex, addedParts } = this.editor.store.getState();
        let prevPartIndex;
        if (addedParts.length) {
            if (selectedPartIndex <= -1) {
                prevPartIndex = this.parts.length;
            }
            prevPartIndex -= 1;
            this.partsActions.select(prevPartIndex);
            this.editPartDialogProvider.setSelected(addedParts[prevPartIndex]);
            setTimeout(() => {
                this.editPartDialog.refit();
            });
        }
        e.detail.keyboardEvent.preventDefault();
        e.detail.keyboardEvent.stopPropagation();
    }
    _onEditPartDialogClosed() {
        const { selectedPartIndex, addedParts } = this.editor.store.getState();
        const part = addedParts[selectedPartIndex];
        if (!part) {
            return;
        }
        const oldId = part.id;
        // Ensure the id will update
        part.id = null;
        this.partsActions.updatePart('name', this.editPartDialogProvider.getName());
        this.updatePartName(oldId, part);
        const newId = part.id;
        const element = this.elements[selectedPartIndex];
        element.setAttribute('id', newId);
        const { sourceEditor } = this.editor;
        let blocks = sourceEditor.getSource();
        const replaceRegexp = new RegExp(`type="${oldId}#`, 'g');
        blocks = blocks.replace(replaceRegexp, `type="${newId}#`);
        sourceEditor.load(blocks);
        this.editor.emit('close-part-settings', { part });
        this.partsActions.select(null);
        this.editPartDialogProvider.stop();
        this.editPartDialogProvider.setSelected(null);
    }
    _onPartUpdate(e) {
        this.partsActions.updatePart(e.property, e.value);
    }
    _onPartSelected(e) {
        const part = e.detail;
        const { addedParts, selectedPartIndex } = this.editor.store.getState();
        this.editor.emit('select-part', { part });
        if (part.id === selectedPartIndex) {
            this.clearSelection();
        } else {
            const partIndex = addedParts.indexOf(part);
            this.removeSelectedClass();
            const element = this.elements[partIndex];
            element.classList.add('selected');
            this.partsActions.select(partIndex);
            this.editPartDialogProvider.setSelected(part);
            this.editPartDialog.open();
        }
    }
    removeSelectedClass() {
        if (this.editor.workspaceView) {
            const selectedPartElement = this.editor.workspaceView.root.querySelector('.selected');
            if (selectedPartElement) {
                selectedPartElement.classList.remove('selected');
            }
        }
    }
    clearSelection() {
        this.removeSelectedClass();
        this.partsActions.select(null);
    }
    checkBlockDependency(part) {
        let block;
        let blockId;
        let pieces;
        // Get the blockly xml and parse it
        const xmlString = this.editor.sourceEditor.getSource();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'text/xml');
        // Get all the 'block' elements
        const blocks = xml.getElementsByTagName('block');
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
    _removePartRequest(e) {
        const part = e.detail;
        this._removePartInitiated(part);
    }
    _removePartInitiated(part) {
        if (this.checkBlockDependency(part)) {
            const alertDelete = this.editor.dialogs.registerAlert({
                heading: 'Oh oh',
                text: `You can't delete '${part.name}' because it is used in the code`,
                buttonLabel: 'Ok',
            });
            alertDelete.on('close', () => {
                alertDelete.dispose();
            });
            alertDelete.open();
        } else {
            const confirmDelete = this.editor.dialogs.registerConfirm({
                heading: 'Are you sure',
                text: `You are about to delete '${part.name}'`,
            });
            confirmDelete.on('confirm', () => {
                this.removePart(part);
                this.editor.emit('remove-part', { part });
                confirmDelete.dispose();
            });
            confirmDelete.open();
        }
    }
    setPartTypes(types) {
        this.types = types;
        this.types.forEach((PartClass) => {
            this.parts.defineType(PartClass.id, PartClass);
        });
    }
    setParts(parts) {
        this.partList = parts;
        this.partList.forEach((partDefinition) => {
            this.parts.define(partDefinition);
        });
        if (this.partsActions) {
            this.partsActions.updatePartsList(parts);
        }
    }
    _onAddPartsFormConfirmed(type) {
        this.addPartDialog.close();
        this.addPart(type);
    }
    _openPartsDialog() {
        const { addedParts } = this.editor.store.getState();
        this.addPartDialogProvider.setUsedParts(addedParts);
        this.addPartDialogProvider.setParts(this.partList);
        this.addPartDialog.open();
        this.editor.emit('open-parts');
    }
    onImport(app) {
        this.parts.clear();
        if (!app) {
            return;
        }
        const { partsMap, addedParts } = this.editor.store.getState();
        this.toolbox.forEach((entry) => {
            entry.dispose();
        });
        Object.keys(this.elements).forEach((key) => {
            this.elements[key].parentNode.removeChild(this.elements[key]);
        });
        addedParts.forEach(part => this.partsActions.removePart(part));
        this.elements = {};
        this.toolbox = new Map();
        if (app.parts) {
            app.parts.forEach((savedPart) => {
                const model = partsMap[savedPart.type];
                const instanceModel = Object.assign({}, model, savedPart);
                const part = this.parts.create(instanceModel);
                this.addToolboxEntry(part);
                this.partsActions.addPart(part);
                this.insertPart(part);
            });
            const { addedParts } = this.editor.store.getState();
            this.outputPlugin.setParts(addedParts);
        }
        this.editor.rootEl.load(app);
    }
    _onAddPartRequest(e) {
        this.addPart(e);
    }
    _onRemovePartRequest(e) {
        this.removePart(e);
    }
    removePart(part) {
        this.removePartElement(part);
        this.partsActions.removePart(part);
        this.parts.freeId(part.name);
        if (this.toolbox.has(part.id)) {
            const entry = this.toolbox.get(part.id);
            entry.dispose();
        }
    }
    addPart(type) {
        const { outputView } = this.editor.output;
        // TODO: This is to allow legacy workspaces to function normally
        const root = 'getBoundingClientRect' in outputView.root ? outputView.root : outputView;
        const outputRect = root.getBoundingClientRect();
        const { partsMap } = this.editor.store.getState();
        const model = partsMap[type];
        const instanceModel = Object.assign({}, model);
        const { addedParts } = this.editor.store.getState();
        instanceModel.position = PartsPlugin.getNewPartPosition(outputRect, addedParts.length);
        const part = this.parts.create(instanceModel);
        this.partsActions.addPart(part);
        this.insertPart(part);
        this.addToolboxEntry(part);
        this.outputPlugin.setParts(addedParts);
        this.editor.emit('add-part', { part });
    }
    addToolboxEntry(part) {
        const { blocks } = part;
        const { addedParts } = this.editor.store.getState();
        part.color = getPartColor(part, addedParts);
        let entry;
        if (blocks) {
            const Module = LegacyFactory(part);
            entry = this.editor.toolbox.addEntry(Module);
        } else {
            entry = this.editor.toolbox.addEntry(part.api);
        }
        this.toolbox.set(part.id, entry);
    }
    updatePartName(oldId, part) {
        if (!this.toolbox.has(oldId)) {
            return;
        }
        const entry = this.toolbox.get(oldId);
        entry.dispose();
        this.addToolboxEntry(part);
    }
    static getNewPartPosition(viewportRect, count) {
        const layoutIndex = count % 9;
        const layoutIterationIndex = Math.floor(count / 9);
        let x;
        let y;

        // Position the part on a 3x3 grid in the workspace
        x = (((layoutIndex % 3) * viewportRect.width / 3) + viewportRect.width / 6);
        y = ((Math.floor(layoutIndex / 3) * viewportRect.height / 3) + viewportRect.height / 6);

        // Make sure the 10th part and so on have an offset
        x += layoutIterationIndex * 20;
        y += layoutIterationIndex * 20;

        // Finally, restrict the position of the part to the workspace
        x = Math.min(x, viewportRect.width - 20);
        y = Math.min(y, viewportRect.height - 20);

        return { x, y };
    }
    onExport(app) {
        const { addedParts } = this.editor.store.getState();
        app.parts = addedParts.map(part => part.toJSON());
        return app;
    }
    insertPart(part, skipSound = false) {
        const { addedParts } = this.editor.store.getState();
        const index = addedParts.indexOf(part);
        const workspace = this.editor.getElement('workspace');
        if (!workspace.workspaceView) {
            return;
        }
        const { tagName } = part;
        const tpl = document.createElement('template');
        tpl.innerHTML = `<${tagName} id="${part.id}" slot="part" class="${part.partType}" model="[[parts.${index}]]"></${tagName}>`;
        const template = html`${tpl}`;
        const stamp = workspace._stampTemplate(template);
        const element = stamp.firstChild;
        this.elements[index] = element;
        this._attachPartElementToDOM(element);
        if (skipSound) {
            return;
        }
        // TODO: Replace this when KC sound API is finalised
        workspace.playSound('/assets/audio/sounds/pop.wav');
        this.editor.elementsRegistry.set(`workspace-part-${part.id}`, element);
    }
    /*
     * Insert the element to the dropzone by reverse-sorting it
     * into the DOM so z-indexes match the order in the parts
     * array (e.g., the part with index 0 will be rendered on
     * top, which means it needs to be last the DOM).
     */
    _attachPartElementToDOM(element) {
        const { model } = element;
        const { addedParts } = this.editor.store.getState();
        const reverseParts = addedParts.slice().reverse();
        const index = reverseParts.indexOf(model);
        const { partsRoot } = this.editor.output.outputView;

        if (partsRoot.lastChild && index < reverseParts.indexOf(partsRoot.lastChild.model)) {
            /* If the element doesn't belong at the end,
          find the right element to insert it before */
            for (let i = 0; i < partsRoot.children.length; i += 1) {
                const child = partsRoot.children[i];
                const childIndex = reverseParts.indexOf(child.model);
                if (childIndex > index) {
                    partsRoot.insertBefore(element, child);
                    break;
                }
            }
        } else {
            /* If ll existing elements come before this one, append it. */
            partsRoot.appendChild(element);
        }
    }
    removePartElement(part) {
        const { addedParts } = this.editor.store.getState();
        const index = addedParts.indexOf(part);
        const element = this.elements[index];
        if (!element) {
            return;
        }
        const { partsRoot } = this.editor.output.outputView;
        partsRoot.removeChild(element);
        delete this.elements[index];
    }
    get challengeGeneratorMiddleware() {
        return (challenge, generator) => {
            if (this.editor.sourceType !== 'blockly') {
                return challenge;
            }
            // Get all the parts
            const { addedParts } = this.editor.store.getState();
            const steps = addedParts.map((part) => {
                if (challenge.parts.indexOf(part.type) === -1) {
                    challenge.parts.push(part.type);
                }

                return {
                    type: 'create-part',
                    part: part.type,
                    alias: generator.partsIds[part.id],
                    openPartsCopy: `Add a **${part.label}** part, use the Add Parts button`,
                    addPartCopy: `Select the **${part.label}** part to add it to your app`,
                };
            });
            challenge.steps = steps.concat(challenge.steps);
            return challenge;
        };
    }
}

export default PartsPlugin;
