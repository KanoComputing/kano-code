import { Output } from '../output/output.js';
import { subscribeDOM } from '@kano/common/index.js';
import { AddPartDialogProvider } from './dialogs/add.js';
import { PartContructor } from './manager.js';
import { memoize } from '../util/decorators.js';

export interface IEditor {
    output : Output;
    workspaceView : any;
    dialogs: {
        registerDialog(provider : any) : any;
    };
}

export interface IPartDefinition {
    name : string;
    type: string;
}

function getPartInfo(part : PartContructor) : IPartDefinition {
    return {
        name: part.partName,
        type: part.type,
    };
}

export class EditorPartsManager {
    private editor : IEditor;
    private addDialog : any;
    private addDialogProvider : AddPartDialogProvider;
    constructor(editor : IEditor) {
        this.editor = editor;
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
        subscribeDOM(partsControls as HTMLElement, 'open-parts-dialog', () => {
            const parts = this.getRegisteredParts();
            const partInfos : IPartDefinition[] = [];
            parts.forEach(p => partInfos.push(getPartInfo(p)));
            this.addDialogProvider.setParts(partInfos);
            this.addDialog.open();
        });
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
    addPart(part : PartContructor) {
        this.editor.output.parts.addPart(part);
    }
}