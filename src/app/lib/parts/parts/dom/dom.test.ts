import { SinonStub } from 'sinon';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { assert } from '@kano/web-tester/helpers.js';
import { DOMPart } from './dom.js';
import { PartContextStub } from '../../../../../test/part-context-stub.js';


class DOMTest extends DOMPart {
    public _el : HTMLElement;
    constructor() {
        super();
        this._el = this.getElement();
    }
    getElement() {
        return document.createElement('div');
    }
}

suite('DOMPart', () => {
    suite('methods', () => {

        test('#onInstall()', () => {
            const stub = new PartContextStub();
            const part = new DOMTest();

            part.onInstall(stub);

            // Check it adds the dom element
            const addedNodes = [...stub.dom.root.children];

            assert(addedNodes.indexOf((part as any)._el) !== -1);
        });
        test('#render()', () => {
            const x = 34;
            const y = 44;
            const scale = 54;
            const rotation = 54;
            const part = new DOMTest();
            
            part.transform.x = x;
            part.transform.y = y;
            part.transform.scale = scale;
            part.transform.rotation = rotation;

            (part as any)._rect = { x: 0, y: 0, width: 800, height: 600 };
            (part as any)._visuals = { x: 0, y: 0, width: 800, height: 600 };

            part.render();

            assert.equal((part as any)._el.style.transform, `translate(${x}px, ${y}px) scale(${scale}, ${scale}) rotate(${rotation}deg)`);
        });
        test('#rotation', () => {
            return new Promise((resolve) => {
                const rotation = 12;
                const part = new DOMTest();

                part.transform.onDidInvalidate(() => {
                    assert.equal(part.transform.rotation, rotation);
                    resolve();
                });

                part.rotation = rotation;
            });
        });
        test('#moveAlong()', () => {
            return new Promise((resolve) => {
                const distance = 13;
                const part = new DOMTest();

                part.transform.onDidInvalidate(() => {
                    assert.equal(part.transform.x, distance);
                    assert.equal(part.transform.y, 0);
                    resolve();
                });

                part.moveAlong(distance);
            });
        });
        test('#move()', () => {
            return new Promise((resolve) => {
                const x = 14;
                const y = 24;
                const part = new DOMTest();

                part.transform.onDidInvalidate(() => {
                    assert.equal(part.transform.x, 34 + x);
                    assert.equal(part.transform.y, 44 + y);
                    resolve();
                });

                part.transform.x = 34;
                part.transform.y = 44;

                part.move(x, y);
            });
        });
        test('#moveTo()', () => {
            return new Promise((resolve) => {
                const x = 15;
                const y = 25;
                const part = new DOMTest();

                part.transform.onDidInvalidate(() => {
                    assert.equal(part.transform.x, x);
                    assert.equal(part.transform.y, y);
                    resolve();
                });

                part.transform.x = 34;
                part.transform.y = 44;

                part.moveTo(x, y);
            });
        });
        test('#setScale()', () => {
            return new Promise((resolve) => {
                const scale = 16;
                const part = new DOMTest();

                part.transform.onDidInvalidate(() => {
                    assert.equal(part.transform.scale, scale / 100);
                    resolve();
                });

                part.transform.scale = 99;

                part.setScale(scale);

            });
        });
        test('#dispose()', () => {
            const stub = new PartContextStub();

            const part = new DOMTest();

            part.onInstall(stub);

            part.dispose();

            assert.equal(stub.dom.root.children.length, 0);
        });
    });
    suite('renderComponents', () => {
        let dom: DOMTest;
        let ctx: CanvasRenderingContext2D | null;
        setup(() => {
            dom = new DOMTest();
            dom._el = dom.getElement();
            const canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d') || null;
        });
        test('renderComponents returns a promise ', () => {
            if (!ctx) {
                return;
            }
            const res = dom.renderComponents(ctx);
            assert.instanceOf(res, Promise);
        })
    });
    suite('applyTransform', () => {
        let dom: DOMTest;
        let ctx: CanvasRenderingContext2D | null;
        let ctxTranslate : SinonStub;
        let ctxRotate : SinonStub;
        let ctxScale : SinonStub;

        setup(() => {
            dom = new DOMTest();
            dom._el = dom.getElement();
            const canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d') || null;
            if (!ctx) {
                return;
            }
            ctxTranslate = sinon.stub(ctx, 'translate');
            ctxRotate = sinon.stub(ctx, 'rotate');
            ctxScale = sinon.stub(ctx, 'scale');
        });
        test('applyTransform returns a promise ', () => {
            if (!ctx) {
                return;
            }
            dom.applyTransform(ctx);
            assert(ctxTranslate.calledTwice);
            assert(ctxRotate.called);
            assert(ctxScale.called);
        })
    });
});
