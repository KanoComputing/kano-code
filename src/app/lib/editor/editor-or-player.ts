import { PluginReceiver } from './plugin/receiver.js';
import { Output } from '../output/output.js';

export abstract class EditorOrPlayer extends PluginReceiver {
    abstract getCode() : string;
    abstract output : Output;
    abstract inject(host : HTMLElement, before? : HTMLElement) : void;
    replaceSource(app : any) {
        if (app && app.code && app.code.snapshot) {
            if (app.code.snapshot
                && app.code.snapshot.javascript
                && app.code.snapshot.javascript.replace) {
                app.code.snapshot.javascript = app.code.snapshot.javascript.replace(/(&rsquo;)/g, '’');
            }
            if (app.code.snapshot
                && app.code.snapshot.blocks
                && app.code.snapshot.blocks.replace) {
                app.code.snapshot.blocks = app.code.snapshot.blocks.replace(/(&rsquo;)/g, '’');
            }
        }
        if (app && app.source && app.source.replace) {
            app.source = app.source.replace(/(&rsquo;)/g, '’');
        }
        if (app && app.code && app.code.replace) {
            app.code = app.code.replace(/(&rsquo;)/g, '’');
        }
        return app;
    }
}

export default EditorOrPlayer;
