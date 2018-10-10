import * as code from '../../../app/lib/index.js';
import { click } from '../../ui-tools.js';

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
            entry.onDidActivate(() => {
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
        test('adds a tooltip entry when registered', () => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const root = document.createElement('div');
            editor.activityBar.registerTooltipEntry({
                title,
                icon,
                root,
            });
            const tooltip = barDom.firstChild;
            assert(tooltip.tagName.toLowerCase() === 'kano-tooltip', 'tooltip was not added to the bar');
            assert(tooltip.firstChild === root, 'Root was not added to the tooltip');
        });
        test('errors when wrong size is provided', () => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            assert.throws(() => editor.activityBar.registerTooltipEntry({ title, icon, size: 'unknown' }));
        });
        teardown(() => {
            editor.dispose();
        });
    });
});
