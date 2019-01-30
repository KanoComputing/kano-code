import { Plugin } from '../../lib/editor/plugin.js';

export class BackgroundOutputPlugin extends Plugin {
    onInstall(output) {
        this.output = output;
    }
    onImport(data) {
        if (!data.background) {
            return;
        }
        this.setBackground(data.background);
    }
    onExport(data) {
        data.background = this._background;
        return data;
    }
    setBackground(background) {
        this._background = background;
        if (!('setBackground' in this.output.outputView)) {
            return;
        }
        this.output.outputView.setBackground(background);
    }
    get background() {
        return this._background;
    }
}

export default BackgroundOutputPlugin;
