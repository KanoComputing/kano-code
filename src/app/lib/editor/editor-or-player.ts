/* eslint class-methods-use-this: "off" */
import { PluginReceiver } from './plugin/receiver.js';

export class EditorOrPlayer extends PluginReceiver {
    getCode() {}
    get outputView() { return {}; }
    inject() {}
}

export default EditorOrPlayer;
