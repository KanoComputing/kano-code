import { Editor } from './editor.js';
import { SourceEditor, registerSourceEditor } from '../source-editor/source-editor.js';
import { QueryEngine } from './selector/selector.js';
import { IMetaRenderer } from '../meta-api/module.js';
import { EventEmitter } from '@kano/common/index.js';

class TestSourceEditor implements SourceEditor {
    onDidCodeChange = (new EventEmitter<string>()).event;
    onDidLayout = (new EventEmitter()).event;
    setToolbox(toolbox : any) {}
    setSource(source : string) {}
    setFlyoutMode(flyoutMode: boolean) {}
    getSource() : string {
        return '';
    }
    domNode : HTMLElement = document.createElement('div');
    registerQueryHandlers(engine : QueryEngine) {}
    getApiRenderer() : IMetaRenderer {
        return {
            renderToolboxEntry() {
                return null;
            },
            disposeToolboxEntry() {},
        };
    }
    editor : Editor
    constructor(editor : Editor) {
        this.editor = editor;
    }
}

registerSourceEditor('test', TestSourceEditor);

suite('Editor', () => {
    suite('#inject', () => {
        let editor : Editor;
        setup(() => {
            editor = new Editor({ sourceType: 'test' });
        });
        teardown(() => {
            editor.dispose();
        });
        test('should add itself to the document body by default', () => {
            editor.inject();

            const bodyChildren = [...document.body.children];

            assert(bodyChildren.indexOf(editor.domNode) !== -1);
        });
        test('should add itself to the DOM node provided', () => {
            const node = document.createElement('div');

            document.body.appendChild(node);

            editor.inject(node);

            const children = [...node.children];

            assert(children.indexOf(editor.domNode) !== -1);
        });
        test('should add itself before any reference node provided', () => {
            const node = document.createElement('div');
            const reference = document.createElement('div');

            document.body.appendChild(node);
            node.appendChild(reference);

            editor.inject(node, reference);

            const children = [...node.children];

            const editorIndex = children.indexOf(editor.domNode);
            const referenceIndex = children.indexOf(reference);


            assert(editorIndex < referenceIndex);
        });
    });
});
