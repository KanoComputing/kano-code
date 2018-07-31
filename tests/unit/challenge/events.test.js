import * as code from '../../../app/lib/index.js';
import { Challenge } from '../../../app/lib/challenge/index.js';
import { setup, test, assert, suite, teardown } from '../tools.js';

suite('Editor', () => {
    suite('#events', () => {
        let editor;
        let challenge;
        setup(() => {
            editor = new code.Editor();
            challenge = new Challenge();
            editor.addPlugin(challenge);
        });
        test('should listen to registered events', (done) => {
            editor.registerEvent('test-event');

            challenge.inject();

            challenge.load({
                steps: [{
                    validation: 'test-event',
                }],
            });

            challenge.initializeChallenge();

            challenge.on('started', () => {
                challenge.on('step-changed', () => {
                    assert(challenge.engine.stepIndex === 1, 'Challenge did not go to second step');
                    done();
                });
                editor.emit('test-event');
            });
        });
        teardown(() => {
            challenge.dispose();
        });
    });
});
