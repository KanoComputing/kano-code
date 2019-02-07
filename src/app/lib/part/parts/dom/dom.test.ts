import { DOMPart } from './dom.js';
import { PartContextStub } from '../../../../../test/part-context-stub.js';

class DOMTest extends DOMPart {
    getElement() {
        return document.createElement('div');
    }
}

suite('DOMPart', () => {
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

        part.render();

        assert.equal((part as any)._el.style.transform, `translate(${x}px, ${y}px) scale(${scale}, ${scale}) rotate(${rotation}deg)`);
    });
    test('#turn()', () => {
        return new Promise((resolve) => {
            const rotation = 12;
            const part = new DOMTest();

            part.transform.onDidInvalidate(() => {
                assert.equal(part.transform.rotation, rotation);
                resolve();
            });

            part.turn('to', rotation);
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
