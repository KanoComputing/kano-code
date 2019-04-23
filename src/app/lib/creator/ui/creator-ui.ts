import { LitElement, html, css, property, customElement } from 'lit-element/lit-element.js';
import { IGeneratedStep, IStepData } from '../creator.js';
import { IDisposable, EventEmitter } from '@kano/common/index.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { prismTheme } from '../../../elements/kano-code-display/kano-prism-theme.js';
import { highlight } from '../../directives/prism.js';

@customElement('kc-creator')
export class CreatorUI extends LitElement {

    subscriptions : IDisposable[] = [];

    @property({ type: Array })
    public generatedSteps : IGeneratedStep[] = [];

    @property({ type: Number })
    public selectedStepIndex : number = -1;

    get selectedStep() {
        return this.generatedSteps[this.selectedStepIndex];
    }

    _onDidFocusStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidFocusStep() { return this._onDidFocusStep.event; }

    _onDidBlurStep : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidBlurStep() { return this._onDidBlurStep.event; }

    _onDidUpdateStepData : EventEmitter<{ index : number, step : IGeneratedStep }> = new EventEmitter();
    get onDidUpdateStepData() { return this._onDidUpdateStepData.event; }

    static get styles() {
        return [prismTheme, css`
            :host {
                display: flex;
                flex-direction: row;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                color: #d5d5d5;
            }
            .col {
                flex: 1;
                background: #242424;
                display: flex;
                flex-direction: column;
            }
            .step {
                cursor: pointer;
                padding: 4px;
                font-size: 12px;
            }
            .step:nth-child(odd) {
                background: #292929;
            }
            .step:hover,
            .step.selected {
                background: #12243d;
            }
            .preview {
                background: #1e1e1e;
            }
            .header {
                background: #333;
                border-bottom: 1px solid #3d3d3d;
                padding: 4px;
            }
            .col:not(:last-child) {
                border-left: 1px solid #3d3d3d;
            }
            .code textarea {
                flex: 1;
            }
            [hidden] {
                display: none !important;
            }
        `];
    }
    render() {
        return html`
            <div class="col steps">
                <div class="header">Steps</div>
                ${this.generatedSteps.map((step, index) => html`
                    <div @mouseenter=${() => this._onMouseEnter(step)}
                         @mouseleave=${() => this._onMouseLeave(step)}
                         @click=${() => this._onClick(step)}
                         class=${classMap({ selected: this.selectedStepIndex === index, step: true })}
                         >${step.source}</div>
                `)}
            </div>
            <div class="col preview" ?hidden=${!this.selectedStep}>
                <div class="header">Preview</div>
                ${this.renderPreview()}
            </div>
            <div class="col code" ?hidden=${!this.selectedStep}>
                <div class="header">Middleware</div>
                <textarea @input=${(e : Event) => this._onCodeChanged(e.target as HTMLTextAreaElement)}>${this.selectedStep ? (this.selectedStep.middleware || 'return step;') : 'return step;'}</textarea>
            </div>
        `;
    }
    renderPreview() {
        const middleware = this.selectedStep ? (this.selectedStep.middleware || 'return step;') : 'return step;';
        const stepData = this.selectedStep ? this.selectedStep.data : {};
        const transformedData = this.runMiddleware(stepData, middleware);
        const stepDataString = this.selectedStep ? JSON.stringify(transformedData, null, '    ') : '';
        return html`
            <pre><code>${highlight(stepDataString, 'javascript')}</code></pre>
        `;
    }
    inject(target : HTMLElement) {
        target.appendChild(this);
        this.style.height = `400px`;
    }
    setStepData(steps : IGeneratedStep[]) {
        this.generatedSteps = steps.slice(0);
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
    }
    runMiddleware(stepData : IStepData, middleware : string) {
        let result = stepData;
        try {
            const fn = new Function('step', middleware);
            result = fn.call(null, Object.assign({}, stepData));
        } catch (e) {
            console.error(e);
        }
        return result;
    }
    _onCodeChanged(target : HTMLTextAreaElement) {
        this._onDidUpdateStepData.fire({
            index: this.selectedStepIndex,
            step: {
                source: this.selectedStep.source,
                data: this.selectedStep.data,
                middleware: target.value,
            },
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