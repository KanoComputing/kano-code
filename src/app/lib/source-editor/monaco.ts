import { EventEmitter, IDisposable } from '@kano/common/index.js';
import { SourceEditor } from './source-editor.js';
import Editor from '../editor/editor.js';
import { QueryEngine } from '../editor/selector/selector.js';
import * as monaco from './monaco/editor.js';
import { Creator } from '../creator/creator.js';
import { TypeScriptMetaRenderer } from './monaco/api-renderer.js';

class MonacoCreator extends Creator {}

export class MonacoSourceEditor implements SourceEditor {
    public editor : Editor;
    private _onDidCodeChange : EventEmitter<string> = new EventEmitter<string>();
    private _onDidSourceChange : EventEmitter<any> = new EventEmitter<any>();
    public domNode : HTMLElement = document.createElement('div');
    public monacoEditor : monaco.editor.IStandaloneCodeEditor;
    private subscriptions : IDisposable[] = [];
    private creator? : Creator;
    private apiRenderer? : TypeScriptMetaRenderer;
    constructor(editor : Editor) {
        this.editor = editor;
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
        this.monacoEditor = monaco.editor.create(this.domNode, { language: 'javascript', theme: 'vs-dark' });
        this.editor.onDidLayoutChange(() => this.monacoEditor.layout(), this, this.subscriptions);
        this.editor.onDidInject(() => this.monacoEditor.layout(), this, this.subscriptions);

        const model = this.monacoEditor.getModel();
        if (model) {
            const sub = model.onDidChangeContent(() => {
                this._onDidCodeChange.fire(this.monacoEditor.getValue());
            });
            this.subscriptions.push(sub);
        }
    }
    get onDidCodeChange() {
        return this._onDidCodeChange.event;
    }
    get onDidSourceChange() {
        return this._onDidSourceChange.event;
    }
    setToolbox(toolbox : any) : void {
        toolbox.forEach((t : any) => {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(t.definitionFile, `${t.name}.js`);
        });
        console.log(toolbox);
    }
    setSource(source : string) : void {
        return this.monacoEditor.setValue(source);
    }
    getSource() {
        return this.monacoEditor.getValue();
    }
    registerQueryHandlers(engine: QueryEngine) {
        
    }
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
    getCreator() {
        if (!this.creator) {
            this.creator = new MonacoCreator(this.editor);
        }
        return this.creator;
    }
    getApiRenderer() {
        if (!this.apiRenderer) {
            this.apiRenderer = new TypeScriptMetaRenderer();
        }
        return this.apiRenderer;
    }
}
