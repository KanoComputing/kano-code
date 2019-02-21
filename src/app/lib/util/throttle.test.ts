import { throttle } from './throttle.js';

suite('throttle', () => {
    test('throttle', () => {
        let called = 0;
        function target() {
            called++;
        }
        const throttled = throttle(target, 10, true);

        throttled();
        throttled();
        throttled();

        assert.equal(called, 1);
    });
});
