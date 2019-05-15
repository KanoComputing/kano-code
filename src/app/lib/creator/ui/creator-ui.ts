import { LitElement, html, css, property, customElement, query } from 'lit-element/lit-element.js';
import { IGeneratedStep } from '../creator.js';
import { IDisposable, EventEmitter } from '@kano/common/index.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { prismTheme } from '../../../elements/kano-code-display/kano-prism-theme.js';
import { highlight } from '../../directives/prism.js';
import { runMiddleware } from '../util.js';
import { templateContent } from '../../directives/template-content.js';
import { play, stop } from './icons.js';
import { KanoTooltip } from '../../../elements/kano-tooltip/kano-tooltip.js';

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

    @property({ type: Array })
    public files : string[] = [];

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

    _onDidClickChallengeToggle : EventEmitter<IGeneratedStep> = new EventEmitter();
    get onDidClickChallengeToggle() { return this._onDidClickChallengeToggle.event; }

    _onDidSelectFile : EventEmitter<string> = new EventEmitter();
    get onDidSelectFile() { return this._onDidSelectFile.event; }

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
                height: 200px;
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
                display: flex;
                flex-direction: row;
                height: 24px;
                padding-left: 8px;
            }
            .challenge-toggle svg {
                fill: white;
            }
            .bar button {
                height: 24px;
                padding: 4px;
                margin-right: 8px;
                background: transparent;
                border: none;
                cursor: pointer;
                color: inherit;
                font-family: inherit;
            }
            .bar button:hover,
            .bar button:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.1);
            }
            .challenge-toggle {
                width: 24px;
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
            kano-tooltip button {
                padding: 8px 16px;
                background: transparent;
                border: none;
                cursor: pointer;
            }
            kano-tooltip button:hover {
                background: grey;
            }
        `];
    }
    @query('#files-tooltip')
    filesTooltip? : KanoTooltip

    renderStepsList() {
        return html`
            <div class="steps-list">
                ${this.generatedSteps.map((step, index) => html`
                    <div @mouseenter=${() => this._onMouseEnter(step)}
                        @mouseleave=${() => this._onMouseLeave(step)}
                        class=${classMap({ selected: this.selectedStepIndex === index, step: true })}>
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
            ${this.collapsed ? '' : this.renderBar()}
        `;
    }
    renderBar() {
        return html`
            <div class="bar ${this.mode}">
                <button class="challenge-toggle" @click=${() => this._onChallengeToggleClick()}>
                    ${this.mode === 'edit' ? templateContent(play) : templateContent(stop)}
                </button>
                <button id="title" @click=${() => this.openTooltip()}>${this.title}</button>
            </div>
            <kano-tooltip position="top" id="files-tooltip" offset="0" auto-close>
                ${this.files.map((path) => html`<button @click=${() => this.selectFile(path)} >${path}</button>`)}
            </kano-tooltip>
        `;
    }
    selectFile(path : string) {
        this.filesTooltip!.close();
        this._onDidSelectFile.fire(path);
    }
    openTooltip() {
        this.filesTooltip!.target = this.renderRoot!.querySelector('#title') as HTMLElement;
        this.filesTooltip!.open();
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
        if (this.mode === 'play') {
            return;
        }
        this._onDidFocusStep.fire(step);
    }
    _onMouseLeave(step : IGeneratedStep) {
        if (this.mode === 'play') {
            return;
        }
        this._onDidBlurStep.fire(step);
    }
    _onClick(step : IGeneratedStep) {
        const index = this.generatedSteps.indexOf(step);
        this.selectStep(index);
        this._onDidSelectStep.fire(step);
    }
    _onChallengeToggleClick() {
        this._onDidClickChallengeToggle.fire(this.selectedStep);
    }
}