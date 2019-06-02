import * as sinon from 'sinon/pkg/sinon-esm.js';
import { SinonStub } from 'sinon';
import { assert } from '@kano/web-tester/helpers.js';
import { DefaultOutputViewProvider } from './default.js';

suite('DefaultOutputViewProvider', () => {
    let canvas : HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let output : any;
    let drawImageStub : SinonStub;
    let fillRectStub : SinonStub;

    suite('render', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');

            if (!ctx) {
                return;
            }
            drawImageStub = sinon.stub(ctx, 'drawImage');
            fillRectStub = sinon.stub(ctx, 'fillRect');
        });
        teardown(() => {
            sinon.restore();
        });
        test('render draws a background', () => {
            output.render(ctx);
            assert(fillRectStub.called);
        });
        test('render draws an image', () => {
            output.render(ctx);
            assert(drawImageStub.called);
        });
    });
});