import * as code from '../../../dist/app/lib/index.js';

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
