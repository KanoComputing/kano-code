import { AppModule } from '../../app-modules/app-module.js';
import { Output } from '../../output/output.js';

export class PartsModule extends AppModule {
    constructor(output : Output) {
        super(output);

        this.addLifecycleStep('start', '_start');
        this.addLifecycleStep('stop', '_stop');
    }
    static get id() { return 'parts'; }
    getSymbols() {
        const parts = this.output.parts.getParts();
        const ids : string[] = [];
        parts.forEach((part) => {
            if (!part.id) {
                return;
            }
            ids.push(part.id);
        });
        return ids;
    }
    _start() {
        // Build an object with the parts ids as key and the parts as value.
        // Use that object as list of methods. This allows us to access the parts by their id in the VM
        const parts = this.output.parts.getParts();
        this.methods = {};
        parts.forEach((part) => {
            if (!part.id) {
                return;
            }
            this.methods[part.id] = part;
        });
        parts.forEach(part => part.onStart());
    }
    _stop() {
        const parts = this.output.parts.getParts();
        parts.forEach(part => part.onStop());
    }
}

export default PartsModule;
