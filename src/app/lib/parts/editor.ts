import { EventEmitter } from '@kano/common/index.js';
import { AddPartDialogProvider } from './dialogs/add.js';
import { memoize } from '../util/decorators.js';
import { IPartAPI } from './api.js';
import { IAPIDefinition } from '../meta-api/module.js';
import { Part } from './part.js';
import { TelemetryClient } from '@kano/telemetry/index.js';
import { DefaultInlineDisplay } from './inline-display.js';
import Editor from '../editor/editor.js';
import { ToolboxEntry, IToolboxWhitelist } from '../editor/toolbox.js';
import { QueryEngine } from '../editor/selector/selector.js';
import { IPartsControlsEntry, KCPartsControls } from '../../elements/kc-workspace-frame/kc-parts-controls.js';
import { _ } from '../i18n/index.js';

type PartAPIOrFactory = IPartAPI | IPartFactory // update this
type IPartFactory = (editor : Editor) => IPartAPI

interface IPartRecord {
    type : string;
    toolboxEntry : ToolboxEntry;
    partsControlsEntry : IPartsControlsEntry;
    part : Part;
}

export class EditorPartsManager {
    private editor : Editor;
    private addDialog : any;
    private addDialogProvider : AddPartDialogProvider;
    private apiRegistry : Map<string, IPartAPI> = new Map();
    private parts : Map<string, IPartRecord> = new Map();
    private names : Set<string> = new Set();
    private whitelist : IToolboxWhitelist|null = null;
    private _telemetry : TelemetryClient = new TelemetryClient({ scope: 'parts' });
    private _onDidOpenAddParts : EventEmitter = new EventEmitter();
    private _onDidAddPart : EventEmitter<Part> = new EventEmitter();
    get onDidOpenAddParts() { return this._onDidOpenAddParts.event; };
    get onDidAddPart() { return this._onDidAddPart.event; };
    constructor(editor : Editor) {
        this.editor = editor;
        this.editor.output.parts.managed = true;
        this.addDialogProvider = new AddPartDialogProvider();
    }
    // Assume this will not change during a session.
    // All parts must be defined initially.
    @memoize
    getRegisteredParts() {
        return this.editor.output.parts.getRegisteredParts();
    }
    getAddedParts() {
        return this.parts;
    }
    setWhitelist(whitelist : IToolboxWhitelist) {
        this.whitelist = whitelist;
        if (!this.editor.workspaceView) {
            return;
        }
        const { partsControls } = this.editor.workspaceView;
        if (!partsControls) {
            return;
        }
        const partsWhitelist = Object.keys(this.whitelist);
        partsControls.addPartsHidden = !partsWhitelist.length;
    }
    // Reset workspace to include all parts
    clearWhiteList() {
        if (!this.editor.workspaceView || !this.editor.workspaceView.partsControls) {
            return;
        }
        const { partsControls } = this.editor.workspaceView;
        this.whitelist = null;
        const partsWhitelist = Array.from(this.apiRegistry.keys());
        // set whitelist to list all available parts
        this.addDialogProvider.setWhitelist(partsWhitelist);
        partsControls.addPartsHidden = !partsWhitelist.length;
    }
    onInject() {
        if (!this.editor.workspaceView) {
            return;
        }
        const { partsControls } = this.editor.workspaceView;
        if (!partsControls) {
            return;
        }
        if (this.whitelist) {
            const partsWhitelist = Object.keys(this.whitelist);
            partsControls.addPartsHidden = !partsWhitelist.length;
        }
        this.addDialog = this.editor.dialogs.registerDialog(this.addDialogProvider);
        // Listen to clicks on the add parts button
        partsControls.onDidClickAddParts(() => {
            // Get all registered parts
            const parts = this.getRegisteredParts();
            // Gather displayable information about these parts
            const partInfos : IPartAPI[] = [];
            parts.forEach((p) => {
                const api = this.apiRegistry.get(p.type);
                if (!api) {
                    throw new Error(`Could not inject: Part '${p.type}' is missing its API`);
                }
                partInfos.push(api);
            });
            // Update the dialog and open it
            this.addDialogProvider.setParts(partInfos);
            if (this.whitelist) {
                const partsWhitelist = Object.keys(this.whitelist);
                this.addDialogProvider.setWhitelist(partsWhitelist);
            }
            this.addDialog.open();
            this._onDidOpenAddParts.fire();
        });
        partsControls.onDidClickRemovePart((id : string) => {
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
            this.editor.restart();

            this.addDialog.close();
        });
    }
    createToolboxModule(api : IPartAPI, id : string, name : string) : IAPIDefinition {
        return {
            type: 'module',
            name: id,
            verbose: name,
            symbols: api.symbols,
            color: api.color,
            blockly: {
                prefix: `${name}:`,
            },
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
            const record = this.addPart(partClass, partData);
            // If creating the part failed, bail out
            if (!record) {
                return;
            }
            // Hydrate the part with saved data
            record.part.load(partData);
        });
    }
    addPart(partClass : typeof Part, data? : any) {
        if (!this.editor || !this.editor.workspaceView) {
            return;
        }
        const api = this.apiRegistry.get(partClass.type);
        if (!api) {
            console.warn(`Could not add part: Part with type '${partClass.type}' is not registered`);
            return;
        }
        let name : string;
        if (!data || !data.name) {
            name = this.getAvailableName(api.label);
        } else {
            name = data.name;
            this.reserveName(data.name);
        }
        let id : string;
        if (!data || !data.id) {
            id = this.editor.output.runner.variables.getAvailable(name) as string;
        } else {
            id = data.id
            this.editor.output.runner.variables.reserve(name);
        }
        const part = this.editor.output.parts.addPart(partClass, { id, name });
        if (data) {
            part.load(data);
        }
        const toolboxModule = this.createToolboxModule(api, id, name);
        const entry = this.editor.toolbox.addEntry(toolboxModule);
        const inlineDisplay = EditorPartsManager.getInlineDisplay(api, part);
        const partsControlsEntry = this.editor.workspaceView.partsControls.addEntry({
            name,
            id,
            icon: api.icon,
            inlineDisplay,
            color: api.color,
            editor : this.editor,
        });
        const partRecord : IPartRecord = {
            type: api.type,
            part,
            toolboxEntry: entry,
            partsControlsEntry,
        };
        partsControlsEntry.onDidChangeName((newName : string) => {
            this.renamePart(partRecord, newName);
        });
        this.parts.set(id, partRecord);
        if (api.onInstall) {
            api.onInstall(this.editor, part);
        }
        if (this.whitelist) {
            const list = this.whitelist[api.type];
            if (list) {
                this.editor.toolbox.whitelistEntry(id, list);
            }
        }
        this._onDidAddPart.fire(part);
        return partRecord;
    }
    removePartAttempt(id : string) {
        const partRecord = this.parts.get(id);
        if (!partRecord) {
            return;
        }
        if (this.checkBlockDependency(id)) {
            const alertDelete = this.editor.dialogs.registerAlert({
                heading: _('DELETE_PART_OH_OH_HEADING', 'Oh oh'),
                text: `${_('YOU_CANT_DELETE_PART', 'You can\'t delete')} '${partRecord.part.name}' ${_('CANT_DELETE_PART_USED_IN_CODE', 'because it is used in the code')}`,
                buttonLabel: _('OK', 'Ok'),
            });
            alertDelete.onDidClose(() => {
                alertDelete.dispose();
                this._telemetry.trackEvent({ name: 'part_remove_dialog_closed' });
            });
            alertDelete.open();
        } else {
            const confirmDelete = this.editor.dialogs.registerConfirm({
                heading: _('DELETE_PART_ARE_YOU_SURE', 'Are you sure'),
                text: `${_('DELETE_PART_ABOUT_TO_DELETE', 'You are about to delete')} '${partRecord.part.name}'`,
            });
            confirmDelete.onDidConfirm(() => {
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
        this.parts.delete(id);
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
    static getInlineDisplay(api : IPartAPI, part : Part) {
        if (api.inlineDisplay) {
            return new api.inlineDisplay(part);
        } else {
            return new DefaultInlineDisplay(part);
        }
    }
    renamePart(partRecord : IPartRecord, newName : string) {
        const api = this.apiRegistry.get(partRecord.type);
        if (!api) {
            return;
        }
        // Free all reserved names and ids
        if (partRecord.part.name) {
            this.freeName(partRecord.part.name);
        }
        if (partRecord.part.id) {
            this.editor.output.runner.variables.free(partRecord.part.id);
            // Remove from the parts map as its id will change
            this.parts.delete(partRecord.part.id);
        }
        // Generate a safe name that will not clash with others
        const safeName = this.getAvailableName(newName);
        const oldId = partRecord.part.id;
        partRecord.part.name = safeName;
        partRecord.part.id = this.editor.output.runner.variables.getAvailable(safeName) as string;

        const toolboxModule = this.createToolboxModule(api, partRecord.part.id, safeName);
        partRecord.toolboxEntry.update(toolboxModule);

        const inlineDisplay = EditorPartsManager.getInlineDisplay(api, partRecord.part);

        partRecord.partsControlsEntry.update({
            name: partRecord.part.name,
            id: partRecord.part.id,
            icon: api.icon,
            inlineDisplay,
            color: api.color,
            editor: this.editor,
        });

        this.parts.set(partRecord.part.id, partRecord);

        if (this.editor.sourceType === 'blockly') {
            const source = this.editor.sourceEditor.getSource();
            const parser = new DOMParser();
            const dom = parser.parseFromString(source, 'text/xml');
            if (dom.documentElement.nodeName === 'parsererror') {
                return;
            }
            const root = dom.documentElement;
            const els = [...root.querySelectorAll(`block[type^="${oldId}_"],shadow[type^="${oldId}_"]`)];
            els.forEach((el) => {
                const type = el.getAttribute('type')!;
                const newType = type.replace(new RegExp(`^${oldId}_`), `${partRecord.part.id}_`);
                el.setAttribute('type', newType);
            });
            const serializer = new XMLSerializer();
            const newSource = serializer.serializeToString(root);
            this.editor.sourceEditor.setSource(newSource);
        }
        if (oldId) {
            this.editor.toolbox.removeWhitelistEntry(oldId);
        }
        if (this.whitelist && this.whitelist[partRecord.type]) {
            const list = this.whitelist[partRecord.type];
            this.editor.toolbox.whitelistEntry(partRecord.part.id, list);
        }
    }
    registerAPI(partAPI : PartAPIOrFactory) {
        if (typeof partAPI === 'function') {
            const partAPIwithEditor = partAPI(this.editor);
            this.apiRegistry.set(partAPIwithEditor.type, partAPIwithEditor);
        } else {
            this.apiRegistry.set(partAPI.type, partAPI);
        }
    }
    reset() {
        this.parts.forEach((_, id) => {
            this.removePart(id);
        });
    }
    registerQueryHandlers(engine : QueryEngine) {
        engine.registerTagHandler('part', (selector) => {
            if (selector.id) {
                const partRecord = this.parts.get(selector.id);
                const { partsControls } = this.editor.workspaceView!;
                if (!partRecord || !partsControls) {
                    engine.warn(`Could not find part with id ${selector.id}`);
                    return null;
                }
                return {
                    part: partRecord.part,
                    getToolboxId() { return partRecord.part.id; },
                    getId() { return partRecord.part.id; },
                    getHTMLElement() {
                        const node = partsControls.getPartNode(partRecord.part.id!);
                        if (!node) {
                            throw new Error(`Could not find part with id '${partRecord.part.id}'`);
                        }
                        return node;
                    },
                };
            } else if (selector.class) {
                const api = this.apiRegistry.get(selector.class);
                if (!api) {
                    engine.warn(`Could not find part with type ${selector.class}`);
                    return null;
                }
                return {
                    api,
                    getId() { return api.type; },
                    getHTMLElement: () => {
                        return this.addDialogProvider.getPartButton(api.type);
                    },
                };
            }
            engine.warn('Could not query part: Neither id nor class defined');
            return null;
        });
        engine.registerTagHandler('add-part-button', () => {
            return {
                getHTMLElement: () => {
                    if (!this.editor || !this.editor.workspaceView || !this.editor.workspaceView.partsControls) {
                        throw new Error('Could not query add part button: Editor is not setup');
                    }
                    return this.editor.workspaceView.partsControls.addPartsButton as HTMLElement;
                },
                getId() {
                    return 'add-part-button';
                },
            };
        });
        engine.registerTagHandler('add-part-menu', () => {
            return {
                getHTMLElement: () => {
                    if (!this.editor || !this.addDialogProvider) {
                        throw new Error('Could not query add part menu: Editor is not setup');
                    }
                    return this.addDialogProvider.domNode as HTMLElement;
                },
                getId() {
                    return 'add-part-menu';
                },
            };
        });
    }
    /**
     * Disable all parts. This prevents users from being able to create parts.
     * Parts can still be created and visible if their are loaded through the editor
     */
    disable() {
        // Just set an empty whitelist. This will make the add parts button disappear
        this.setWhitelist({});
    }
    dispose() {
        this.apiRegistry.clear();
    }
}