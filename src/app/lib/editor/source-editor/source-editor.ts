import { IEvent } from '@kano/common/index.js';
import { QueryEngine } from '../selector/selector';

export interface SourceEditor {
    onDidCodeChange : IEvent<string>;
    setToolbox(toolbox : any) : void;
    setSource(source : string) : void;
    getSource() : string;
    domNode : HTMLElement;
    registerQueryHandlers(engine : QueryEngine) : void;
}
