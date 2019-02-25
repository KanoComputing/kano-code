import { IMetaDefinition } from '../meta-api/module.js';
import { PartInlineDisplay } from './inline-display.js';
import { Part } from './part.js';
import { Editor } from '../editor/editor.js';

/**
 * Describes the editor experience for a part.
 * Toolbox, color, icon, inline display,...
 */
export interface IPartAPI {
    // Unique string used as identifier for the part's API. Must match the type given to a part.
    type : string;
    // Theme color for this part
    color : string;
    // Will be displayed in the list of parts
    label : string;
    // List of symbols passed to the Meta API to generate the blocks or typescript definition
    symbols : IMetaDefinition[];
    // Template containing an SVG icon
    icon : HTMLTemplateElement;
    // Widget that will be displayed in the part list when a part is added
    inlineDisplay? : Type<PartInlineDisplay>;
    // Called when a part of that type is added to the editor. This is not called in a player
    onInstall?(editor : Editor, part : Part) : void;
};
