import { assert } from '@kano/web-tester/helpers.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { FlagsManager } from './flags-manager.js';

suite('FlagsManager', () => {
    test('#register()', () => {
        const manager = new FlagsManager();

        const saveStub = sinon.stub(manager, 'saveFlag');
        const getStub = sinon.stub(manager, 'getFlag').returns(true);
        const logStub = sinon.stub(console, 'log');

        manager.register('TEST_EXPERIMENT');

        assert(manager.flags.TEST_EXPERIMENT);
        assert(getStub.called);
        manager.flags.TEST_EXPERIMENT = true;
        assert(saveStub.called);
        logStub.restore();
    });
    test('#saveFlag()', () => {
        const manager = new FlagsManager();

        const persistStub = sinon.stub(manager, 'persistFlag');

        manager.register('TEST_EXPERIMENT');

        manager.saveFlag('TEST_EXPERIMENT_FAKE', true);
        // Does not persist when called
        assert(!persistStub.called);
        manager.saveFlag('TEST_EXPERIMENT', true);
        assert(persistStub.called);
        assert.equal((manager as any)._flags.TEST_EXPERIMENT, true);
    });
    test('#getFlag()', () => {
        const manager = new FlagsManager();

        const persistStub = sinon.stub(manager, 'readFlag').returns(true);

        manager.register('TEST_EXPERIMENT');

        assert.throws(() => manager.getFlag('TEST_EXPERIMENT_FAKE'));
        let value = manager.getFlag('TEST_EXPERIMENT');
        assert(value);
        assert.equal(persistStub.callCount, 1);
        value = manager.getFlag('TEST_EXPERIMENT');
        assert.equal(persistStub.callCount, 1);
    });
    test('#readFlag()', () => {
        const manager = new FlagsManager();

        const getItemStub = sinon.stub(window.localStorage, 'getItem').returns('1');

        manager.register('TEST_EXPERIMENT');

        assert(manager.readFlag('TEST_EXPERIMENT'));
        assert(getItemStub.called);

        getItemStub.restore();
    });
    test('#persistFlag()', () => {
        const manager = new FlagsManager();

        const setItemStub = sinon.stub(window.localStorage, 'setItem');

        manager.register('TEST_EXPERIMENT');

        manager.persistFlag('TEST_EXPERIMENT', true);
        assert(setItemStub.calledWith('kc://flags/TEST_EXPERIMENT', '1'));

        setItemStub.restore();
    });
});
