import { SinonStub } from 'sinon';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { assert } from '@kano/web-tester/helpers.js';
import { TextComponent } from './text-component.js';

suite('TextComponent', () => {
    let component: TextComponent;
    let el: HTMLElement;
    let ctx: CanvasRenderingContext2D | null;
    let fillTextStub: SinonStub;

    suite('render', () => {
        setup(() => {
            component = new TextComponent();
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
        });
        teardown(() => {
            sinon.restore();
        });
        test('render draws text onto the canvas', () => {
            if (!ctx) {
                return;
            }
            component.render(ctx, el);
            assert(fillTextStub.called);
        })
    });
});
