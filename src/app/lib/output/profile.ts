import { Output } from './output.js';
import { IOutputProvider } from './index.js';
import * as Modules from '../modules/index.js';
import * as Parts from '../parts/parts/index.js';
import DefaultOutputViewProvider from './default.js';

export abstract class OutputProfile {
    abstract id : string;
    abstract outputViewProvider? : IOutputProvider;
    abstract plugins? : any[];
    abstract modules? : any[];
    abstract parts? : any[];
    abstract onInstall(output : Output) : void;
    abstract onInject() : void;
}

export class DefaultOutputProfile extends OutputProfile {
    id: string = 'default';
    outputViewProvider? : IOutputProvider;
    plugins? : any[];
    parts? : any[];
    modules? : any[];
    onInstall(output : Output) {
        this.parts = Object.values(Parts);
        this.modules = Object.values(Modules);
        this.outputViewProvider = new DefaultOutputViewProvider();
    }
    onInject() {
        if (!this.outputViewProvider) {
            return;
        }
        this.outputViewProvider.onInject();
    }
}

export default OutputProfile;
