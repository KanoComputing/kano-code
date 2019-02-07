import { Output } from '../output/output.js';
import { IDisposable } from '@kano/common/index.js';
import { AddPartDialogProvider } from './dialogs/add.js';
import { PartContructor } from './manager.js';
import { memoize } from '../util/decorators.js';
import { IPartAPI } from './api.js';
import { IMetaDefinition } from '../meta-api/module.js';
import { Part } from './part.js';
import { KCPartsControls } from '../../elements/kc-workspace-frame/kc-parts-controls.js';
import { TelemetryClient } from '@kano/telemetry/index.js';
import EventEmitter from '../util/event-emitter.js';

export interface IEditor extends EventEmitter {
    injected : boolean;
    output : Output;
    config : any;
    workspaceView : {
        partsControls : KCPartsControls;
    };
    dialogs: {
        registerDialog(provider : any) : any;
        registerAlert(provider : any) : any;
        registerConfirm(provider : any) : any;
    };
    toolbox: {
        addEntry(d : any) : IDisposable;
    };
    sourceEditor: {
        getSource() : string;
    };
    rootEl : HTMLElement;
    load(app : any) : void;
    export() : any;
}

export interface IPartDefinition {
    name : string;
    type : string;
}

function getPartInfo(part : IPartAPI) : IPartDefinition {
    return {
        name: part.label,
        type: part.type,
    };
}

interface IPartRecord {
    type : string;
    toolboxEntry : IDisposable;
    partsControlsEntry : IDisposable;
    part : Part;
}

export class EditorPartsManager {
    private editor : IEditor;
    private addDialog : any;
    private addDialogProvider : AddPartDialogProvider;
    private apiRegistry : Map<string, IPartAPI> = new Map();
    private parts : Map<string, IPartRecord> = new Map();
    private names : Set<string> = new Set();
    private _telemetry : TelemetryClient = new TelemetryClient({ scope: 'parts' });
    constructor(editor : IEditor) {
        this.editor = editor;
        this.editor.output.parts.managed = true;
        this.addDialogProvider = new AddPartDialogProvider(editor);
    }
    // Assume this will not change during a session.
    // All parts must be defined initially.
    @memoize
    getRegisteredParts() {
        return this.editor.output.parts.getRegisteredParts();
    }
    onInject() {
        const { partsControls } = this.editor.workspaceView;
        if (!partsControls) {
            return;
        }
        this.addDialog = this.editor.dialogs.registerDialog(this.addDialogProvider);
        // Listen to clicks on the add parts button
        partsControls.onDidClickAddParts(() => {
            // Get all registered parts
            const parts = this.getRegisteredParts();
            // Gather displayable information about these parts
            const partInfos : IPartDefinition[] = [];
            parts.forEach((p) => {
                const api = this.apiRegistry.get(p.type);
                if (!api) {
                    throw new Error(`Could not inject: Part '${p.type}' is missing its API`);
                }
                partInfos.push(getPartInfo(api));
            });
            // Update the dialog and open it
            this.addDialogProvider.setParts(partInfos);
            this.addDialog.open();
        });
        partsControls.onDidClickRemovePart((id) => {
            this.removePartAttempt(id);
        });
        // Listen to the user clicking on an available part
        this.addDialogProvider.onDidClickPart((type) => {
            const parts = this.getRegisteredParts();
            const part = parts.get(type);

            if (!part) {
                throw new Error(`Could not add part: Part '${type}' was not registered`);
            }
            this.addPart(part);

            this.addDialog.close();
        });
    }
    createToolboxModule(api : IPartAPI, id : string, name : string) : IMetaDefinition {
        return {
            type: 'module',
            name: id,
            verbose: name,
            symbols: api.symbols,
            color: api.color,
        };
    }
    reserveName(name : string) {
        this.names.add(name);
    }
    /**
     * Find a unique name available
     * @param source Original name
     */
    getAvailableName(source : string, inc = 1) : string {
        const newName = (inc >= 2) ? `${source} ${inc}` : source;
        if(this.names.has(newName)) {
            return this.getAvailableName(source, inc + 1);
        }
        this.reserveName(newName);
        return newName;
    }
    /**
     * Mark a name as free to use
     * @param source Name to free
     */
    freeName(source : string) {
        this.names.delete(source);
    }
    /**
     * Called by the editor when the user imports a saved app
     * @param app Exported app data
     */
    onImport(app : any) {
        // No part in this app, bail out
        if (!app.parts) {
            return;
        }
        const parts : any[] = app.parts;
        // Fetch all registered parts
        const registeredParts = this.getRegisteredParts();
        parts.forEach((partData : any) => {
            // Try to match the saved part with a known one
            const partClass = registeredParts.get(partData.type);
            // The part is not registered, warn developers and move on
            if (!partClass) {
                console.warn(`Could not import part: Part with type '${partData.type}' is not registered`, partData);
                return;
            }
            // Add the part. Provide the saved id and name, preventing them to be generated
            const record = this.addPart(partClass, partData.id, partData.name);
            // If creating the part failed, bail out
            if (!record) {
                return;
            }
            // Hydrate the part with saved data
            record.part.load(partData);
        });
    }
    addPart(partClass : PartContructor, id? : string, name? : string) {
        const api = this.apiRegistry.get(partClass.type);
        if (!api) {
            console.warn(`Could not add part: Part with type '${partClass.type}' is not registered`);
            return;
        }
        if (!name) {
            name = this.getAvailableName(api.label);
        } else {
            this.reserveName(name);
        }
        if (!id) {
            id = this.editor.output.runner.variables.getAvailable(name);
        } else {
            this.editor.output.runner.variables.reserve(name);
        }
        const part = this.editor.output.parts.addPart(partClass, { id, name });
        const toolboxModule = this.createToolboxModule(api, id, name);
        const entry = this.editor.toolbox.addEntry(toolboxModule);
        const partsControlsEntry = this.editor.workspaceView.partsControls.addEntry({ name, id });
        const partRecord : IPartRecord = {
            type: api.type,
            part,
            toolboxEntry: entry,
            partsControlsEntry,
        };
        this.parts.set(id, partRecord);
        return partRecord;
    }
    removePartAttempt(id : string) {
        const partRecord = this.parts.get(id);
        if (!partRecord) {
            return;
        }
        if (this.checkBlockDependency(id)) {
            const alertDelete = this.editor.dialogs.registerAlert({
                heading: 'Oh oh',
                text: `You can't delete '${partRecord.part.name}' because it is used in the code`,
                buttonLabel: 'Ok',
            });
            alertDelete.on('close', () => {
                alertDelete.dispose();
                this._telemetry.trackEvent({ name: 'part_remove_dialog_closed' });
            });
            alertDelete.open();
        } else {
            const confirmDelete = this.editor.dialogs.registerConfirm({
                heading: 'Are you sure',
                text: `You are about to delete '${partRecord.part.name}'`,
            });
            confirmDelete.on('confirm', () => {
                this.removePart(id);
                confirmDelete.dispose();
                this._telemetry.trackEvent({ name: 'part_remove_dialog_closed' });
            });
            confirmDelete.open();
        }
        this._telemetry.trackEvent({ name: 'part_remove_dialog_opened' });
    }
    removePart(id : string) {
        const partRecord = this.parts.get(id);
        if (!partRecord) {
            return;
        }
        // Free the variable
        if (partRecord.part.id) {
            this.editor.output.runner.variables.free(partRecord.part.id);
        }
        if (partRecord.part.name) {
            this.freeName(partRecord.part.name);
        }
        // Remove the part from the output
        this.editor.output.parts.removePart(partRecord.part);
        // Remove the toolbox entry
        partRecord.toolboxEntry.dispose();
        partRecord.partsControlsEntry.dispose();
        this.parts.clear();
    }
    checkBlockDependency(id : string) {
        // Get the blockly xml and parse it
        const xmlString = this.editor.sourceEditor.getSource();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'text/xml');
        // Get all the 'block' elements
        const blocks = xml.getElementsByTagName('block');
        let block;
        let blockId;
        // Check for every one of them...
        for (let k = 0, len = blocks.length; k < len; k += 1) {
            block = blocks[k];
            blockId = block.getAttribute('type');
            if (blockId && blockId.startsWith(`${id}_`)) {
                return true;
            }
        }
        return false;
    }
    registerAPI(partAPI : IPartAPI) {
        this.apiRegistry.set(partAPI.type, partAPI);
    }
    reset() {
        this.parts.forEach((_, id) => {
            this.removePart(id);
        });
    }
    dispose() {
        this.apiRegistry.clear();
    }
}