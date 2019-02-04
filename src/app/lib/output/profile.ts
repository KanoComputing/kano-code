import { Output } from './output.js';
import { Plugin } from '../editor/plugin.js';
import { AppModule } from '../app-modules/app-module.js';
import { IOutputProvider } from './index.js';
import { Part } from '../part/part.js';

export interface IOutputProfile {
    id : string;
    onInstall?(output : Output) : void;
    plugins? : Plugin[];
    modules? : Type<AppModule>[];
    parts? : Type<Part>[];
    outputProvider? : IOutputProvider;
}

export class OutputProfile implements IOutputProfile {
    get id() { return 'default'; }
    onInstall() {}
    get plugins() { return []; }
    get modules() { return []; }
}

export default OutputProfile;
