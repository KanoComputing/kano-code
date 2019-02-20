import { PluginReceiver } from './plugin/receiver.js';
import { Output } from '../output/output.js';

export abstract class EditorOrPlayer extends PluginReceiver {
    abstract getCode() : string;
    abstract output : Output;
    abstract inject(host : HTMLElement, before? : HTMLElement) : void;
}

export default EditorOrPlayer;
