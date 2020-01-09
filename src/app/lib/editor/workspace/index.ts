/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import Editor from '../editor.js';
import { KCPartsControls } from '../../../elements/kc-workspace-frame/kc-parts-controls.js';

export abstract class WorkspaceViewProvider {
    protected editor? : Editor;
    abstract source : string;
    abstract outputViewRoot? : HTMLElement;
    abstract partsControls : KCPartsControls;
    public abstract root : HTMLElement;
    clear() {}
    setOutputView(outputView : any) {
        if (this.outputViewRoot) {
            // Trick to get custom els added
            const root = outputView instanceof HTMLElement ? outputView : outputView.root;
            if (!root) {
                throw new Error('Could not create WorkspaceView: OutputView provided does not have a root');
            }
            root.setAttribute('slot', 'workspace');
            this.outputViewRoot.appendChild(root);
        }
    }
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    onInject() {}
    onDispose() {}
    get toolbar() {
        return (this as any).root.querySelector('kc-workspace-toolbar');
    }
};

export default WorkspaceViewProvider;

export * from './default.js';
