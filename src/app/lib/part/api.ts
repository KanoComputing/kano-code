import { IMetaDefinition } from '../meta-api/module.js';
import { PartInlineDisplay } from './inline-display.js';

export interface IPartAPI {
    type : string;
    color : string;
    // Will be displayed in the list of parts
    label : string;
    symbols : IMetaDefinition[];
    icon : HTMLTemplateElement;
    inlineDisplay? : Type<PartInlineDisplay>;
};
