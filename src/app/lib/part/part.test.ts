import { Part } from './part.js';
import { PartComponent } from './component.js';
import { component } from './decorators.js';

class ResetComponent extends PartComponent {
    public resetRan : boolean = false;
    reset() {
        this.resetRan = true;
    }
}

class Reset extends Part {
    public resetRan : boolean = false;
    @component(ResetComponent)
    public test : ResetComponent;
    constructor() {
        super();

        this.test = this._components.get('test') as ResetComponent;
    }
    reset() {
        super.reset();
        this.resetRan = true;
    }
}

suite('Part', () => {
    test('#onStop()', () => {
        const part = new Reset();

        part.onStop();

        assert(part.resetRan, 'reset() was not called on Part components after onStop');
    });
    test('#reset()', () => {
        const part = new Reset();

        part.reset();

        assert(part.test.resetRan, 'reset() was not called on Part components');
    });
});
