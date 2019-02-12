import { OutputProfile } from '../output/profile.js';
import { Editor } from './editor.js';
import { CreationCustomPreviewProvider } from '../creation/creation-preview-provider.js';
import CreationStorageProvider from '../creation/creation-storage-provider.js';
import WorkspaceViewProvider from './workspace/index.js';

export abstract class EditorProfile {
    private editor : Editor;
    constructor(editor : Editor) {
        this.editor = editor;
    }
    onInstall(editor : Editor) {}
    get parts() { return []; }
    get plugins() { return []; }
    get toolbox() { return []; }
    get outputProfile() { return new OutputProfile(); }
    abstract get workspaceViewProvider() : WorkspaceViewProvider;
    get source() { return ''; }
    abstract get creationPreviewProvider() : CreationCustomPreviewProvider|undefined;
    abstract get creationStorageProvider() : CreationStorageProvider|undefined;
}

export default EditorProfile;
