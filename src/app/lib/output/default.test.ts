import * as sinon from 'sinon/pkg/sinon-esm.js';
import { SinonStub } from 'sinon';
import { assert } from '@kano/web-tester/helpers.js';
import { DefaultOutputViewProvider, ITransform } from './default.js';

suite('DefaultOutputViewProvider', () => {
    let canvas : HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let transform: ITransform;
    let output : any;
    let drawImageStub : SinonStub;
    let fillRectStub : SinonStub;
    let strokeRectStub : SinonStub;
    let ctxArcStub : SinonStub;
    let ctxFillStub : SinonStub;
    let ctxStrokeStub : SinonStub;
    let fillTextStub : SinonStub;
    let drawOtherPartStub : SinonStub;
    let drawButtonPartStub : SinonStub;
    let drawTextPartStub : SinonStub;
    let drawTextInputPartStub : SinonStub;
    let drawSliderPartStub : SinonStub;
    let drawStickerPartStub : SinonStub;
    let htmlEl : HTMLElement;
    let stickerImages : Map<string, HTMLImageElement>;
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
        test('render returns a promise', () => {
            const res = output.render(ctx);
            assert.instanceOf(res, Promise);
        });
    })
    suite('drawPart', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            htmlEl = document.createElement('div');
            transform = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                rotation: 0,
            };
            drawOtherPartStub = sinon.stub(output, 'drawOtherPart');
            drawButtonPartStub = sinon.stub(output, 'drawButtonPart');
            drawTextPartStub = sinon.stub(output, 'drawTextPart');
            drawTextInputPartStub = sinon.stub(output, 'drawTextInputPart');
            drawSliderPartStub = sinon.stub(output, 'drawSliderPart');
            drawStickerPartStub = sinon.stub(output, 'drawStickerPart');
        });
        teardown(() => {
            sinon.restore();
        });
        test('drawPart calls default draw if the part\'s title isn\`t recognised', () => {
            htmlEl.title = 'something else';
            output.drawPart(ctx, htmlEl, transform);
            assert(drawOtherPartStub.called);
        });
        test('drawPart calls drawButtonPart if the part is a button', () => {
            htmlEl.title = 'button';
            output.drawPart(ctx, htmlEl, transform);
            assert(drawButtonPartStub.called);
        });
        test('drawPart calls drawTextPart if the part is a text', () => {
            htmlEl.title = 'text';
            output.drawPart(ctx, htmlEl, transform);
            assert(drawTextPartStub.called);
        });
        test('drawPart calls drawSliderPart if the part is a slider', () => {
            htmlEl.title = 'slider';
            output.drawPart(ctx, htmlEl, transform);
            assert(drawSliderPartStub.called);
        });
        test('drawPart calls drawStickerPart if the part is a sticker', () => {
            htmlEl.title = 'sticker';
            output.drawPart(ctx, htmlEl, transform);
            assert(drawStickerPartStub.called);
        });
        test('drawPart calls drawTextInputPart if the part is a text input', () => {
            htmlEl.title = 'text-input';
            output.drawPart(ctx, htmlEl, transform);
            assert(drawTextInputPartStub.called);
        });
    })
    suite('resetTransforms', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
        });
        teardown(() => {
            sinon.restore();
        });
        test('transforms reset after resetTransforms', () => {
            if (!ctx) {
                return;
            }
            // Set some custom transforms
            ctx.globalAlpha = 0.5;
            ctx.translate(150, 200);
            ctx.rotate(35);
            ctx.scale(2, 5);
            // Reset those transforms
            output.resetTransforms(ctx);
            const transformMatrix = ctx.getTransform();
            assert.equal(transformMatrix.a, 1);
            assert.equal(transformMatrix.b, 0);
            assert.equal(transformMatrix.c, 0);
            assert.equal(transformMatrix.d, 1);
            assert.equal(transformMatrix.e, 0);
            assert.equal(transformMatrix.f, 0);
        })
    })
    suite('getTransformData', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
        });
        teardown(() => {
            sinon.restore();
        });
        test('getTransformData returns transform data in correct format', () => {
            const testString = 'translate(100px, 0px) scale(1, 1) rotate(0deg)';
            const res = output.getTransformData(testString);
            assert.equal(res.x, 100);
            assert.equal(res.y, 0);
            assert.equal(res.scaleX, 1);
            assert.equal(res.scaleY, 1);
            assert.equal(res.rotation, 0);
        })
    })
    suite('drawButtonPart', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            htmlEl = document.createElement('div');
            transform = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                rotation: 0,
            };
            if (!ctx) {
                return;
            }
            ctxArcStub = sinon.stub(ctx, 'arc');
            ctxFillStub = sinon.stub(ctx, 'fill');
            fillTextStub = sinon.stub(ctx, 'fillText');
            fillRectStub = sinon.stub(ctx, 'fillRect');
        });
        teardown(() => {
            sinon.restore();
        });
        test('drawButtonPart draws the correct shapes and text', () => {
            const buttonEl = document.createElement('button');
            buttonEl.title = 'button';
            buttonEl.textContent = 'Something Fun';
            output.drawButtonPart(ctx, buttonEl);
            assert(ctxArcStub.calledTwice);
            assert(ctxFillStub.calledTwice);
            assert(fillRectStub.called);
            assert(fillTextStub.called);
        })
    })
    suite('drawTextPart', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            htmlEl = document.createElement('div');
            htmlEl.textContent = 'some fun text, ya know, for kids';
            transform = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                rotation: 0,
            };
            if (!ctx) {
                return;
            }
            fillTextStub = sinon.stub(ctx, 'fillText');
        });
        teardown(() => {
            sinon.restore();
        });
        test('drawTextPart draws text onto the canvas', () => {
            output.drawTextPart(ctx, htmlEl);
            assert(fillTextStub.called);
        })
    });
    suite('drawTextInputPart', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            htmlEl = document.createElement('div');
            htmlEl.textContent = 'some fun text, ya know, for kids';
            transform = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                rotation: 0,
            };
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
        test('drawTextInputPart draws text onto the canvas', () => {
            output.drawTextInputPart(ctx, htmlEl);
            assert(fillTextStub.called);
            assert(fillRectStub.called);
            assert(strokeRectStub.called);
        })
    });
    suite('drawSliderPart', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            htmlEl = document.createElement('div');
            htmlEl.textContent = 'some fun text, ya know, for kids';
            transform = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                rotation: 0,
            };
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
        test('drawSliderPart draws text onto the canvas', () => {
            output.drawSliderPart(ctx, htmlEl);
            assert(ctxFillStub.calledTwice);
            assert(ctxStrokeStub.calledTwice);
            assert(ctxArcStub.called);
        })
    });
    suite('drawStickerPart', () => {
        setup(() => {
            output = new DefaultOutputViewProvider();
            output.root = document.createElement('div');
            canvas = document.createElement('canvas') as HTMLCanvasElement;
            canvas.width = 800;
            canvas.height = 600;
            ctx = canvas.getContext('2d');
            htmlEl = document.createElement('div');
            stickerImages = new Map();
            const stickerUrl = 'url/to/something';
            stickerImages.set('url/to/something', new Image());
            htmlEl.style.backgroundImage = `url('${stickerUrl}')`;
            if (!ctx) {
                return;
            }
            drawImageStub = sinon.stub(ctx, 'drawImage');
        });
        teardown(() => {
            sinon.restore();
        });
        test('drawStickerPart draws text onto the canvas', () => {
            output.drawStickerPart(ctx, htmlEl, stickerImages);
            assert(drawImageStub.called);
        })
    });
});