import * as code from '../../../app/lib/index.js';
import { setup, test, assert, suite, teardown } from '../tools.js';
import { click } from '../ui-tools.js';

suite('Editor', () => {
    suite('#activityBar', () => {
        let editor;
        let barDom;
        setup(() => {
            editor = new code.Editor();
            editor.inject();
            barDom = editor.root.querySelector('#activity-bar');
        });
        test('should be empty by default', () => {
            assert(barDom.children.length === 0);
        });
        test('adds a button on register', () => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const entry = editor.activityBar.registerEntry({
                title,
                icon,
            });
            assert(barDom.firstChild === entry.root);
            assert(entry.root.getAttribute('title') === title);
            const img = entry.root.querySelector('img');
            assert(img.getAttribute('src') === icon);
        });
        test('click triggers activate event', (done) => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const entry = editor.activityBar.registerEntry({
                title,
                icon,
            });
            entry.on('activate', () => {
                done();
            });
            click(entry.root);
        });
        test('dispose deletes the DOM node', () => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const entry = editor.activityBar.registerEntry({
                title,
                icon,
            });
            assert(barDom.firstChild === entry.root);
            entry.dispose();
            assert(barDom.firstChild !== entry.root);
        });
        teardown(() => {
            editor.dispose();
        });
    });
});
