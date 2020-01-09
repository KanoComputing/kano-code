/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { AppModule } from '../app-modules/app-module.js';
import { Output } from './output.js';

export class OutputModule extends AppModule {
    constructor(output : Output) {
        super(output);
        this.addLifecycleStep('start', '_start');
        this.addLifecycleStep('stop', '_stop');
    }

    static get id() {
        return 'output';
    }

    _start() {
        if (!this.output.outputView) {
            return;
        }
        this.output.outputView.start();
    }
    _stop() {
        if (!this.output.outputView) {
            return;
        }
        this.output.outputView.stop();
    }
}

export default OutputModule;
