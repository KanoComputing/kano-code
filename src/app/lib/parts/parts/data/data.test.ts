/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataPart } from './data.js';

interface TestInterface {}
class DataTest extends DataPart<TestInterface> {
    query() : Promise<TestInterface> {
        return Promise.resolve({} as TestInterface);
    }
}

suite('DataPart', () => {
    test('#refresh()', () => {
        const part = new DataTest();
        const stub = sinon.stub(part, 'query').resolves({} as TestInterface);
        part.refresh();
        assert(stub.called);
    });
    test('#onUpdate()', (done) => {
        const result = {} as TestInterface;
        const part = new DataTest();
        const stub = sinon.stub(part, 'query').resolves(result);
        part.onUpdate(() => {
            assert(stub.called);
            assert.equal((part as any).value, result);
            done();
        });
        part.refresh();
    });
});
