import { IMetaDefinition } from '../meta-api/module.js';
import { PartInlineDisplay } from './inline-display.js';
import { Part } from './part.js';
import { IEditor } from './editor.js';

export interface IPartAPI {
    type : string;
    color : string;
    // Will be displayed in the list of parts
    label : string;
    symbols : IMetaDefinition[];
    icon : HTMLTemplateElement;
    inlineDisplay? : Type<PartInlineDisplay>;
    onInstall?(editor : IEditor, part : Part) : void;
};
