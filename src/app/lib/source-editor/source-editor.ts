/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { IEvent } from '@kano/common/index.js';
import { QueryEngine } from '../editor/selector/selector.js';
import { ContributionManager } from '../contribution.js';
import { Editor } from '../editor/editor.js';
import { IMetaRenderer } from '../meta-api/module.js';

export interface SourceEditor {
    onDidCodeChange : IEvent<string>;
    onDidLayout : IEvent<void>;
    setFlyoutMode(flyoutMode: boolean) : void;
    setToolbox(toolbox : any) : void;
    setSource(source : string) : void;
    getSource() : string;
    domNode : HTMLElement;
    registerQueryHandlers(engine : QueryEngine) : void;
    getApiRenderer() : IMetaRenderer;
    editor : Editor;
}

interface SourceEditorConstructor {
    new(...args : any[]) : SourceEditor;
}

const registeredEditors : ContributionManager<SourceEditorConstructor> = new ContributionManager();

export function registerSourceEditor(id : string, sourceEditorClass : SourceEditorConstructor) {
    return registeredEditors.register(id, sourceEditorClass);
}

export function getSourceEditor(id : string) {
    return registeredEditors.get(id);
}
