import { LitElement, html, css, property, customElement } from 'lit-element/lit-element.js';
import { IGeneratedStep } from '../creator.js';
import { IDisposable, EventEmitter } from '@kano/common/index.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { prismTheme } from '../../../elements/kano-code-display/kano-prism-theme.js';
import { highlight } from '../../directives/prism.js';
import { runMiddleware } from '../util.js';

@customElement('kc-creator')
export class CreatorUI extends LitElement {

    subscriptions : IDisposable[] = [];

    @property({ type: String })
    title : string = '';

    @property({ type: String })
    mode : 'edit'|'play' = 'edit';

    @property({ type: Boolean })
    collapsed = false;

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

    _onDidPlayStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidPlayStep() { return this._onDidPlayStep.event; }

    _onDidSelectStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidSelectStep() { return this._onDidSelectStep.event; }

    _onDidBlurStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidBlurStep() { return this._onDidBlurStep.event; }

    _onDidUpdateMiddleware : EventEmitter<{ source : string, middleware : string }> = new EventEmitter();
    get onDidUpdateMiddleware() { return this._onDidUpdateMiddleware.event; }

    static get styles() {
        return [prismTheme, css`
            :host {
                display: flex;
                flex-direction: column;
                position: relative;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                color: #d5d5d5;
            }
            .panes {
                display: flex;
                flex-direction: row;
            }
            .col {
                flex: 1;
                background: #242424;
                display: flex;
                flex-direction: column;
            }
            pre {
                overflow: auto;
                flex: 1;
                margin: 0;
            }
            .code {
                flex: 4;
            }
            .step {
                cursor: pointer;
                font-size: 12px;
                display: flex;
                flex-direction: row;
            }
            .step>* {
                padding: 4px;
            }
            .step:nth-child(odd) {
                background: #292929;
            }
            .step:hover,
            .step.selected {
                background: #12243d;
            }
            .preview {
                flex: 5;
                background: #1e1e1e;
            }
            .header {
                cursor: pointer;
                font-size: 14px;
                background: #333;
                border-bottom: 1px solid #3d3d3d;
                padding: 4px;
            }
            .col:not(:last-child) {
                border-left: 1px solid #3d3d3d;
            }
            [hidden] {
                display: none !important;
            }
            .steps-list {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                height: 400px;
            }
            .close {
                position: absolute;
                top: 0px;
                right: 0px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: white;
                width: 28px;
                height: 28px;
            }
            .tick {
                background: transparent;
                border: 0;
                padding: 0; 
                width: 24px;
                height: 24px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }
            .tick.passed span {
                opacity: 1;
            }
            .tick span {
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                opacity: 0.5;
                background: white;
            }
            .bar {
                height: 24px;
                padding-left: 8px;
            }
            .bar.edit {
                background: #007acc;
            }
            .bar.play {
                background: #c63;
            }
            .step .label {
                flex: 1;
            }
        `];
    }
    renderStepsList() {
        return html`
            <div class="steps-list">
                ${this.generatedSteps.map((step, index) => html`
                    <div @mouseenter=${() => this._onMouseEnter(step)}
                        @mouseleave=${() => this._onMouseLeave(step)}
                        class=${classMap({ selected: this.selectedStepIndex === index, step: true })}
                        >
                            <button class=${classMap({ tick: true, passed: index < this.selectedStepIndex })} @click=${() => this.playStep(step)}>
                                <span></span>
                            </button>
                            <span class="label" @click=${() => this._onClick(step)}>${step.source}</span>
                        </div>
                `)}
            </div>
        `;
    }
    render() {
        return html`
            <div class="panes">
                <div class="col steps">
                    <div class="header" @click=${() => this.toggle()}>Steps</div>
                    ${this.collapsed ? '' : this.renderStepsList()}
                </div>
                <div class="col preview" ?hidden=${!this.selectedStep}>
                    <div class="header" @click=${() => this.toggle()}>Preview</div>
                    ${this.collapsed ? '' : this.renderPreview()}
                </div>
                <button ?hidden=${this.collapsed} class="close" @click=${() => this.close()}>&times;</button>
            </div>
            ${this.collapsed ? '' : html`<div class="bar ${this.mode}">${this.title}</div>`}
        `;
    }
    toggle() {
        this.collapsed = !this.collapsed;
    }
    close() {
        this.collapsed = true;
    }
    renderPreview() {
        const stepData = this.selectedStep ? this.selectedStep.data : {};
        const transformedData = runMiddleware(stepData, this.middleware);
        const stepDataString = this.selectedStep ? JSON.stringify(transformedData, null, '    ') : '';
        return html`
            <pre><code>${highlight(stepDataString, 'javascript')}</code></pre>
        `;
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
    playStep(step : IGeneratedStep) {
        const index = this.generatedSteps.indexOf(step);
        this.selectStep(index);
        this._onDidPlayStep.fire(step);
    }
    dispose() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
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
        this._onDidSelectStep.fire(step);
    }
}