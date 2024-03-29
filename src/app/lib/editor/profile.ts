/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { OutputProfile, DefaultOutputProfile } from '../output/profile.js';
import { Editor } from './editor.js';
import { CreationCustomPreviewProvider } from '../preview/creation-preview-provider.js';
import WorkspaceViewProvider from './workspace/index.js';
import * as PartAPIs from '../parts/parts/api.js'; 
import * as APIs from '../modules/api.js';
import DefaultWorkspaceViewProvider from './workspace/default.js';

export abstract class EditorProfile {
    abstract workspaceViewProvider? : WorkspaceViewProvider;
    abstract onInstall(editor : Editor) : void;
    abstract parts? : any[];
    abstract plugins? : any[];
    /**
     * Configures the toolbox for the editor.
     * To set the toolbox to default entries:
     * `this.toolbox = Object.values(APIs);`
     * To set your own order:
     * `this.toolbox = [APIs.app, APIs.ctx etc];`
     */
    abstract toolbox? : any[];
    abstract outputProfile? : OutputProfile;
    abstract creationPreviewProvider? : CreationCustomPreviewProvider;
}

export class DefaultEditorProfile extends EditorProfile {
    parts? : any[];
    plugins? : any[];
    toolbox? : any[];
    workspaceViewProvider? : DefaultWorkspaceViewProvider;
    creationPreviewProvider? : CreationCustomPreviewProvider;
    outputProfile? : OutputProfile;
    onInstall(editor: Editor) {
        this.workspaceViewProvider = new DefaultWorkspaceViewProvider();
        this.plugins = [];
        this.parts = Object.values(PartAPIs);
        this.toolbox = Object.values(APIs);
        this.outputProfile = new DefaultOutputProfile();
    }
}

export default EditorProfile;
