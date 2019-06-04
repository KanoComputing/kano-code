import { SinonStub } from 'sinon';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { assert } from '@kano/web-tester/helpers.js';
import { ButtonComponent } from './button-component.js';

suite('ButtonComponent', () => {
    let component: ButtonComponent;
    let el : HTMLElement;
    let ctx: CanvasRenderingContext2D | null;
    let ctxArc: SinonStub;
    let ctxFill: SinonStub;
    let ctxFillRect: SinonStub;
    let ctxFillText: SinonStub;
    
    suite('render', () => {
        setup(() => {
            component = new ButtonComponent();
            el = document.createElement('button');
            el.textContent = 'some fun button text YEAH!';
            const canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d') || null;
            if (!ctx) {
                return;
            }
            ctxArc = sinon.stub(ctx, 'arc');
            ctxFill = sinon.stub(ctx, 'fill');
            ctxFillRect = sinon.stub(ctx, 'fillRect');
            ctxFillText = sinon.stub(ctx, 'fillText');
        });
        test('render draws the correct shapes ', () => {
            if (!ctx) {
                return;
            }
            component.render(ctx, el);
            assert(ctxArc.calledTwice);
            assert(ctxFill.calledTwice);
            assert(ctxFillRect.called);
            assert(ctxFillText.called);
        })
    });
});
