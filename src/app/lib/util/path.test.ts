import { join } from './path.js';

const trailing = 'some/path/';
const leading = '/some/path';

suite('path', () => {
    test('#join()', () => {
        let result = join(trailing, leading);
        assert.equal(result, 'some/path/some/path');
        result = join(leading, trailing);
        assert.equal(result, '/some/path/some/path/');
    });
});
