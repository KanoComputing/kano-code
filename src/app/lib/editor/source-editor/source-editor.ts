import { IEvent } from '@kano/common/index.js';

export interface SourceEditor {
    onDidCodeChange : IEvent<string>;
    setToolbox(toolbox : any) : void;
    setSource(source : string) : void;
    getSource() : string;
    domNode : HTMLElement;
}
