import { click } from '@polymer/iron-test-helpers/mock-interactions.js';
import { ActivityBar } from './activity-bar.js';
import Editor from './editor.js';

class EditorStub {
    public domNode : HTMLElement;
    public barRoot : HTMLElement = document.createElement('div');
    public injected : boolean = false;
    constructor() {
        this.barRoot.setAttribute('id', 'activity-bar');
        this.domNode = document.createElement('div');
        this.domNode.appendChild(this.barRoot);
    }
}

suite('Editor', () => {
    suite('#activityBar', () => {
        let bar : ActivityBar;
        let barDom : HTMLElement;
        setup(() => {
            bar = new ActivityBar();
            const editor = new EditorStub();
            editor.injected = true;
            bar.onInstall(editor as unknown as Editor);
            barDom = editor.barRoot;
            bar.onInject();
        });
        test('should be empty by default', () => {
            assert(barDom.children.length === 0);
        });
        test('adds a button on register', () => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const entry = bar.registerEntry({
                title,
                icon,
            });
            assert(barDom.firstChild === entry.root);
            assert(entry.root.getAttribute('title') === title);
            const img = entry.root.querySelector('img');
            if (!img) {
                throw new Error('Could not query image in activity bar entry');
            }
            assert(img.getAttribute('src') === icon);
        });
        test('click triggers activate event', (done) => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const entry = bar.registerEntry({
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
            const entry = bar.registerEntry({
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
            bar.registerTooltipEntry({
                title,
                icon,
                root,
            });
            const tooltip = barDom.firstChild as HTMLElement;
            if (!tooltip) {
                throw new Error('Tooltip was not added to the bar');
            }
            assert(tooltip.tagName.toLowerCase() === 'kano-tooltip', 'tooltip was not added to the bar');
            assert(tooltip.firstChild === root, 'Root was not added to the tooltip');
        });
        test('errors when wrong size is provided', () => {
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            assert.throws(() => bar.registerEntry({ title, icon, size: 'unknown' }));
        });
        test('Does not add entry if removed before injected', () => {
            (bar as any).editor.injected = false;
            const title = 'test-title';
            const icon = '/icons/test-icon.svg';
            const entry = bar.registerEntry({ title, icon });
            entry.dispose();
            (bar as any).editor.injected = true;
            assert.isNull(barDom.firstChild, 'Entry was injected event after being disposed');
        });
        teardown(() => {
            bar.onDispose();
        });
    });
});
