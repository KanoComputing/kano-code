import * as code from '../../../app/lib/index.js';
import { setup, test, assert, suite, teardown } from '../tools.js';

suite('Editor', () => {
    suite('#events', () => {
        let editor;
        setup(() => {
            editor = new code.Editor();
        });
        test('should allow for events registration', () => {
            editor.registerEvent('test-event');

            const events = editor.getEvents();

            assert(events.indexOf('test-event') !== -1, 'Event does not appear in the list of editor events');
        });
        teardown(() => {
            editor.dispose();
        });
    });
});
