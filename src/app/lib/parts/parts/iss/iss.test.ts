import * as sinon from 'sinon/pkg/sinon-esm.js';
import { ISSPart } from './iss.js';
import { generate } from '../../../../../test/generate.js';

suite('ISSPart', () => {
    test('#query()', (done) => {
        const result = {
            latitude: generate.number(),
            longitude: generate.number(),
        };
        const iss = new ISSPart();

        const fectchStub = sinon.stub(window, 'fetch').resolves(new Response(JSON.stringify({ value: result })));

        iss.onUpdate(() => {
            assert.equal(iss.latitude, result.latitude);
            assert.equal(iss.longitude, result.longitude);
            done();
            fectchStub.restore();
        });
        iss.refresh();
    });
});
