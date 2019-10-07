import { PluginReceiver } from './plugin/receiver.js';
import { Output } from '../output/output.js';

export abstract class EditorOrPlayer extends PluginReceiver {
    abstract getCode() : string;
    abstract output : Output;
    abstract inject(host : HTMLElement, before? : HTMLElement) : void;
    replaceSource(app : any) {
        if (app && app.source) {
            app.source = app.source.replace(/(&rsquo;)/g, '’');
        }
        if (app && app.code) {
            app.code = app.code.replace(/(&rsquo;)/g, '’');
        }
        return app;
    }
}

export default EditorOrPlayer;
