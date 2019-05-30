import { SinonStub } from 'sinon';
import { assert } from '@kano/web-tester/helpers.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { SliderComponent } from './slider-component.js';

suite('SliderComponent', () => {
    let component: SliderComponent;
    let el: HTMLElement;
    let ctx: CanvasRenderingContext2D | null;
    let ctxFillStub: SinonStub;
    let ctxStrokeStub: SinonStub;
    let ctxArcStub: SinonStub;

    suite('render', () => {
        setup(() => {
            component = new SliderComponent();
            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            el = document.createElement('div');
            el.textContent = 'some fun text, ya know, for kids';
            if (!ctx) {
                return;
            }
            ctxFillStub = sinon.stub(ctx, 'fill');
            ctxStrokeStub = sinon.stub(ctx, 'stroke');
            ctxArcStub = sinon.stub(ctx, 'arc');
        });
        teardown(() => {
            sinon.restore();
        });
        test('render draws the correct shapes onto the canvas', () => {
            if (!ctx) {
                return;
            }
            component.render(ctx, el);
            assert(ctxFillStub.calledTwice);
            assert(ctxStrokeStub.calledTwice);
            assert(ctxArcStub.called);
        })
    });
});
