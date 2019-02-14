import { Editor } from './editor.js';

suite('Editor', () => {
    suite('#inject', () => {
        let editor : Editor;
        setup(() => {
            editor = new Editor();
        });
        test('should add itself to the document body by default', () => {
            editor.inject();

            const bodyChildren = [...document.body.children];

            assert(bodyChildren.indexOf(editor.rootEl) !== -1);
        });
        test('should add itself to the DOM node provided', () => {
            const node = document.createElement('div');

            document.body.appendChild(node);

            editor.inject(node);

            const children = [...node.children];

            assert(children.indexOf(editor.rootEl) !== -1);
        });
        test('should add itself before any reference node provided', () => {
            const node = document.createElement('div');
            const reference = document.createElement('div');

            document.body.appendChild(node);
            node.appendChild(reference);

            editor.inject(node, reference);

            const children = [...node.children];

            const editorIndex = children.indexOf(editor.rootEl);
            const referenceIndex = children.indexOf(reference);


            assert(editorIndex < referenceIndex);
        });
        teardown(() => {
            editor.dispose();
        });
    });
});
