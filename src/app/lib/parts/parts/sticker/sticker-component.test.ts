import { SinonStub } from 'sinon';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { assert } from '@kano/web-tester/helpers.js';
import { StickerComponent } from './sticker-component.js';

suite('StickerComponent', () => {
    let component: StickerComponent;
    let el: HTMLElement;
    let ctx: CanvasRenderingContext2D | null;
    let ctxDrawImage: SinonStub;

    suite('render', () => {
        setup(() => {
            component = new StickerComponent();
            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            el = document.createElement('div');
            if (!ctx) {
                return;
            }
            ctxDrawImage = sinon.stub(ctx, 'drawImage');
        });
        teardown(() => {
            sinon.restore();
        });
        test('render draws an image onto the canvas', () => {
            if (!ctx) {
                return;
            }
            component.render(ctx, el);
            assert(ctxDrawImage.called);
        })
    });
});
