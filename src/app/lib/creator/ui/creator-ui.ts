import { LitElement, html, css, property, customElement, query } from 'lit-element/lit-element.js';
import { IGeneratedStep } from '../creator.js';
import { IDisposable, EventEmitter } from '@kano/common/index.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { prismTheme } from '../../../elements/kano-code-display/kano-prism-theme.js';
import { highlight } from '../../directives/prism.js';
import * as monaco from '../../source-editor/monaco/editor.js';
import { runMiddleware } from '../util.js';

@customElement('kc-creator')
export class CreatorUI extends LitElement {

    subscriptions : IDisposable[] = [];

    @property({ type: Array })
    public generatedSteps : IGeneratedStep[] = [];

    @property({ type: Number })
    public selectedStepIndex : number = -1;

    @property({ type: Map })
    public middlewares : Map<string, string> = new Map();

    get selectedStep() {
        return this.generatedSteps[this.selectedStepIndex];
    }

    get middleware() {
        if (!this.selectedStep) {
            return;
        }
        return this.middlewares.get(this.selectedStep.source);
    }

    _onDidFocusStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidFocusStep() { return this._onDidFocusStep.event; }

    _onDidBlurStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidBlurStep() { return this._onDidBlurStep.event; }

    _onDidUpdateMiddleware : EventEmitter<{ source : string, middleware : string }> = new EventEmitter();
    get onDidUpdateMiddleware() { return this._onDidUpdateMiddleware.event; }

    @query('#monaco-container')
    monacoContainer? : HTMLElement;

    editor? : monaco.editor.IStandaloneCodeEditor;

    static get styles() {
        return [prismTheme, css`
            kc-creator {
                display: flex;
                flex-direction: row;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                color: #d5d5d5;
            }
            kc-creator .col {
                flex: 1;
                background: #242424;
                display: flex;
                flex-direction: column;
            }
            kc-creator .preview {
                flex: 2;
            }
            kc-creator pre {
                overflow: auto;
                flex: 1;
                margin: 0;
            }
            kc-creator .code {
                flex: 4;
            }
            kc-creator .step {
                cursor: pointer;
                padding: 4px;
                font-size: 12px;
            }
            kc-creator .step:nth-child(odd) {
                background: #292929;
            }
            kc-creator .step:hover,
            kc-creator .step.selected {
                background: #12243d;
            }
            kc-creator .preview {
                background: #1e1e1e;
                max-width: 33.33%;
            }
            kc-creator .header {
                font-size: 14px;
                background: #333;
                border-bottom: 1px solid #3d3d3d;
                padding: 4px;
            }
            kc-creator .col:not(:last-child) {
                border-left: 1px solid #3d3d3d;
            }
            kc-creator .code #monaco-container {
                flex: 1;
            }
            kc-creator [hidden] {
                display: none !important;
            }
            kc-creator .steps-list {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
            }
        `];
    }
    render() {
        return html`
            <div class="col steps">
                <div class="header">Steps</div>
                <div class="steps-list">
                    ${this.generatedSteps.map((step, index) => html`
                        <div @mouseenter=${() => this._onMouseEnter(step)}
                            @mouseleave=${() => this._onMouseLeave(step)}
                            @click=${() => this._onClick(step)}
                            class=${classMap({ selected: this.selectedStepIndex === index, step: true })}
                            >${step.source}</div>
                    `)}
                </div>
            </div>
            <div class="col preview" ?hidden=${!this.selectedStep}>
                <div class="header">Preview</div>
                ${this.renderPreview()}
            </div>
            <div class="col code" ?hidden=${!this.selectedStep}>
                <div class="header">Middleware</div>
                <div id="monaco-container"></div>
            </div>
        `;
    }
    createRenderRoot() {
        /**
         * Render template in light DOM. Note that shadow DOM features like 
         * encapsulated CSS are unavailable.
         */
            return this;
    }
    renderPreview() {
        const stepData = this.selectedStep ? this.selectedStep.data : {};
        const transformedData = runMiddleware(stepData, this.middleware);
        const stepDataString = this.selectedStep ? JSON.stringify(transformedData, null, '    ') : '';
        return html`
            <pre><code>${highlight(stepDataString, 'javascript')}</code></pre>
        `;
    }
    firstUpdated() {
        if (!this.monacoContainer) {
            return;
        }
        this.editor = monaco.editor.create(this.monacoContainer, {
            language: 'javascript',
            theme: 'vs-dark',
        });
        const model = this.editor.getModel();
        if (model) {
            model.onDidChangeContent(() => {
                this._onCodeChanged();
            });
        }
    }
    updated(changedProps : Map<string, unknown>) {
        if (!changedProps.has('selectedStepIndex') || !this.editor) {
            return;
        }
        this.editor.layout();
        if (!this.selectedStep) {
            return;
        }
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
        monaco.languages.typescript.javascriptDefaults.addExtraLib(`const step = ${JSON.stringify(this.selectedStep.data)}`, 'selected-step.js');
        this.editor.setValue(this.middleware || '\n\nreturn step;');
    }
    inject(target : HTMLElement) {
        // This force lit to add the styles even if it is not a shadow root enabled element
        (this as any)._needsShimAdoptedStyleSheets = true;
        target.appendChild(this);
        this.style.height = `400px`;
    }
    setStepData(steps : IGeneratedStep[]) {
        this.generatedSteps = steps.slice(0);
    }
    setMiddlewares(middlewares : Map<string, string>) {
        this.middlewares = new Map(middlewares);
    }
    selectStep(index : number) {
        this.selectedStepIndex = index;
    }
    dispose() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
        if (this.editor) {
            this.editor.dispose();
        }
    }
    _onCodeChanged() {
        if (!this.editor) {
            return;
        }
        this._onDidUpdateMiddleware.fire({
            source: this.selectedStep.source,
            middleware: this.editor.getValue(),
        });
    }
    _onMouseEnter(step : IGeneratedStep) {
        this._onDidFocusStep.fire(step);
    }
    _onMouseLeave(step : IGeneratedStep) {
        this._onDidBlurStep.fire(step);
    }
    _onClick(step : IGeneratedStep) {
        const index = this.generatedSteps.indexOf(step);
        this.selectStep(index);
    }
}