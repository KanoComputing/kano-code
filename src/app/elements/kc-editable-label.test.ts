import { KCEditableLabel } from './kc-editable-label.js';
import './kc-editable-label.js';
import { click } from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';

const basic = fixture<KCEditableLabel>`
    <kc-editable-label></kc-editable-label>
`;
const editing = fixture<KCEditableLabel>`
    <kc-editable-label editing></kc-editable-label>
`;

suite('kc-editable-label', () => {
    test('instanciate', () => {
        const el = basic();
        assert(el instanceof customElements.get('kc-editable-label'));
    });
    test('edit', () => {
        const el = basic();
        return el.updateComplete.then(() => {
            const label = (el as any).renderRoot.querySelector('label')!;
            click(label);
            return el.updateComplete;
        })
        .then(() => {
            const input = (el as any).renderRoot.querySelector('input');
            assert(input);
        });
    });
    test('enter', () => {
        const el = editing();
        const stub = sinon.stub(el, 'apply');
        return el.updateComplete.then(() => {
            const input = (el as any).renderRoot.querySelector('input')!;
            const event = new KeyboardEvent('keydown', { keyCode: 13 } as any);
            input.dispatchEvent(event);
            assert(stub.called);
        });
    });
    test('esc', () => {
        const el = editing();
        const stub = sinon.stub(el, 'cancel');
        return el.updateComplete.then(() => {
            const input = (el as any).renderRoot.querySelector('input')!;
            const event = new KeyboardEvent('keydown', { keyCode: 27 } as any);
            input.dispatchEvent(event);
            assert(stub.called);
        });
    });
    test('blur', () => {
        const el = editing();
        const stub = sinon.stub(el, 'apply');
        return el.updateComplete.then(() => {
            const input = (el as any).renderRoot.querySelector('input')!;
            const event = new MouseEvent('blur');
            input.dispatchEvent(event);
            assert(stub.called);
        });
    });
    test('change', () => {
        const el = editing();
        return el.updateComplete.then(() => {
            const input = (el as any).renderRoot.querySelector('input')!;
            input.value = 'test';
            const p = new Promise((resolve) => {
                el.addEventListener('change', (e) => {
                    assert.equal((e as CustomEvent).detail, 'test');
                    resolve();
                });
            });
            el.apply();
            return p;
        });
    });
    test('cancel', () => {
        const el = editing();
        el.cancel();
        assert.equal(el.editing, false);
    });
});
