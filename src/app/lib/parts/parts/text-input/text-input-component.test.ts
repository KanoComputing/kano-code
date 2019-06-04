import { SinonStub } from 'sinon';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { assert } from '@kano/web-tester/helpers.js';
import { TextInputComponent } from './text-input-component.js';

suite('TextInputComponent', () => {
    let component: TextInputComponent;
    let el: HTMLElement;
    let ctx: CanvasRenderingContext2D | null;
    let fillTextStub: SinonStub;
    let fillRectStub: SinonStub;
    let strokeRectStub: SinonStub;

    suite('render', () => {
        setup(() => {
            component = new TextInputComponent();
            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            el = document.createElement('div');
            el.textContent = 'some fun text, ya know, for kids';
            if (!ctx) {
                return;
            }
            fillTextStub = sinon.stub(ctx, 'fillText');
            fillRectStub = sinon.stub(ctx, 'fillRect');
            strokeRectStub = sinon.stub(ctx, 'strokeRect');
        });
        teardown(() => {
            sinon.restore();
        });
        test('drawTextInputPart draws text and a bordered box onto the canvas', () => {
            if (!ctx) {
                return;
            }
            component.render(ctx, el);
            assert(fillTextStub.called);
            assert(fillRectStub.called);
            assert(strokeRectStub.called);
        })
    });
});
