import { OutputProfile } from '../output/profile.js';

export class EditorProfile {
    constructor(editor) {
        this.editor = editor;
    }
    get plugins() { return []; }
    get toolbox() { return []; }
    get outputProfile() { return new OutputProfile(); }
    get workspaceViewProvider() { return null; }
    get source() { return ''; }
    get creationPreviewProvider() { return null; }
}

export default EditorProfile;
