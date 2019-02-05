import { OutputProfile } from '../output/profile.js';
import { IEditor } from '../part/editor.js';

export class EditorProfile {
    private editor : IEditor;
    constructor(editor : IEditor) {
        this.editor = editor;
    }
    onInstall() {}
    get parts() { return []; }
    get plugins() { return []; }
    get toolbox() { return []; }
    get outputProfile() { return new OutputProfile(); }
    get workspaceViewProvider() { return null; }
    get source() { return ''; }
    get creationPreviewProvider() { return null; }
}

export default EditorProfile;
