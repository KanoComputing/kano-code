import { assert } from '@kano/web-tester/helpers.js';
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

suite('renderComponents', () => {
    let part : Part;
    let ctx : CanvasRenderingContext2D | null;
    setup(() => {
        part = new Part();
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') || null;
    });
    test('renderComponents returns a promise ', () => {
        if (!ctx) {
            return;
        }
        const res = part.renderComponents(ctx);
        assert.instanceOf(res, Promise);
    })
});

suite('resetTransform', () => {
    let part: Part;
    let ctx: CanvasRenderingContext2D | null;
    setup(() => {
        part = new Part();
        const canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d') || null;
    });
    test('resetTransform to reset the transform properties of ctx', () => {
            if (!ctx) {
                return;
            }
            // Set some custom transforms
            ctx.globalAlpha = 0.5;
            ctx.translate(150, 200);
            ctx.rotate(35);
            ctx.scale(2, 5);
            // Reset those transforms
            part.resetTransform(ctx);
            const transformMatrix = ctx.getTransform();
            assert.equal(transformMatrix.a, 1);
            assert.equal(transformMatrix.b, 0);
            assert.equal(transformMatrix.c, 0);
            assert.equal(transformMatrix.d, 1);
            assert.equal(transformMatrix.e, 0);
            assert.equal(transformMatrix.f, 0);
    })
});
