import { EventEmitter, IDisposable } from '@kano/common/index.js';
import { SourceEditor } from './source-editor.js';
import Editor from '../editor/editor.js';
import { QueryEngine, ISelector } from '../editor/selector/selector.js';
import * as monaco from './monaco/editor.js';
import { Creator } from '../creator/creator.js';
import { TypeScriptMetaRenderer } from './monaco/api-renderer.js';
import { Stepper } from '../creator/stepper/stepper.js';

class MonacoStepper extends Stepper {}

class MonacoCreator extends Creator<MonacoStepper> {
    createStepper() : MonacoStepper {
        return new MonacoStepper(this.editor);
    }
}

export class MonacoSourceEditor implements SourceEditor {
    public editor : Editor;
    private _onDidCodeChange : EventEmitter<string> = new EventEmitter<string>();
    private _onDidLayout : EventEmitter = new EventEmitter();
    private _onDidSourceChange : EventEmitter<any> = new EventEmitter<any>();
    public domNode : HTMLElement = document.createElement('div');
    public monacoEditor : monaco.editor.IStandaloneCodeEditor;
    private subscriptions : IDisposable[] = [];
    private creator? : MonacoCreator;
    private apiRenderer? : TypeScriptMetaRenderer;
    private models : { model: monaco.editor.ITextModel, lib : monaco.IDisposable }[] = [];
    constructor(editor : Editor) {
        this.editor = editor;
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
        const model = monaco.editor.createModel('', 'javascript', monaco.Uri.parse('kano://code/index.js'));
        this.monacoEditor = monaco.editor.create(this.domNode, {
            model,
            language: 'javascript',
            theme: 'vs-dark',
            glyphMargin: true,
            scrollBeyondLastLine: false,
        });
        this.editor.onDidLayoutChange(() => this.monacoEditor.layout(), this, this.subscriptions);
        this.editor.onDidInject(() => this.monacoEditor.layout(), this, this.subscriptions);
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
    get onDidLayout() {
        return this._onDidLayout.event;
    }
    setToolbox(toolbox : any) : void {
        this.models.forEach(m => {
            m.model.dispose();
            m.lib.dispose();
        });
        this.models = toolbox.map((t : any) => {
            const lib =  monaco.languages.typescript.javascriptDefaults.addExtraLib(t.definitionFile, `kano://code/${t.id}.js`);
            const model = monaco.editor.createModel(t.definitionFile, 'typescript', monaco.Uri.parse(`kano://code/${t.id}.js`));
            return { lib, model };
        });
    }
    setSource(source : string) : void {
        return this.monacoEditor.setValue(source);
    }
    getSource() {
        return this.monacoEditor.getValue();
    }
    registerQueryHandlers(engine: QueryEngine) {
        engine.registerTagHandler('position', (selector : ISelector, parent) => {
            const posString = selector.id || selector.class;
            if (!posString) {
                throw new Error('Could not find position, missing class or id');
            }
            const parts = posString.split(',');
            if (parts.length !== 2) {
                throw new Error('Could not find position, class or id invalid. Syntax is <lineNumber>,<column>');
            }
            const [lineNumberString, columnString] = parts;
            const lineNumber = parseInt(lineNumberString, 10);
            const column = parseInt(columnString, 10);
            const top = this.monacoEditor.getTopForLineNumber(lineNumber);
            const left = this.monacoEditor.getOffsetForColumn(lineNumber, column);
            const self = this;
            return {
                getId() { return `${lineNumber},${column}`; },
                getPosition() {
                    const rect = self.domNode.getBoundingClientRect();
                    return {
                        x: rect.left + left,
                        y: rect.top + top,
                    }
                },
                getHTMLElement() {
                    return self.domNode;
                },
            }
        });
    }
    setInputDisabled(isInputDisabled: boolean) {}
    setFlyoutMode(flyoutMode: boolean) {}
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
    getApiRenderer() {
        if (!this.apiRenderer) {
            this.apiRenderer = new TypeScriptMetaRenderer();
        }
        return this.apiRenderer;
    }
}
