import { LitElement, html, css, property, customElement, query } from 'lit-element/lit-element.js';
import { IGeneratedStep } from '../creator.js';
import { IDisposable, EventEmitter, dispose } from '@kano/common/index.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { prismTheme } from '../../../elements/kano-code-display/kano-prism-theme.js';
import { highlight } from '../../directives/prism.js';
import { templateContent } from '../../directives/template-content.js';
import { play, stop, clear, tick, previous, next } from './icons.js';
import { KanoTooltip } from '../../../elements/kano-tooltip/kano-tooltip.js';
import '@kano/styles/color.js';

@customElement('kc-creator')
export class CreatorUI extends LitElement {
    @property({ type: String })
    public selectedFile : string|null = null;

    @property({ type: Boolean })
    public offline = false;

    @property({ type: String })
    public title : string = '';

    @property({ type: String })
    public mode : 'edit'|'play' = 'edit';

    @property({ type: Boolean })
    public collapsed = false;

    @property({ type: Array })
    public generatedSteps : IGeneratedStep[] = [];

    @property({ type: Number })
    public selectedStepIndex : number = -1;

    @property({ type: Array })
    public files : string[] = [];

    get selectedStep() {
        return this.generatedSteps[this.selectedStepIndex];
    }

    private subscriptions : IDisposable[] = [];

    @query('#files-tooltip')
    private filesTooltip? : KanoTooltip;

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

    _onDidClickNext : EventEmitter = new EventEmitter();
    get onDidClickNext() { return this._onDidClickNext.event; }

    _onDidClickPrevious : EventEmitter = new EventEmitter();
    get onDidClickPrevious() { return this._onDidClickPrevious.event; }

    static get styles() {
        return [
            prismTheme,
            this.barStyles,
            this.fileStyles,
            this.connectionStatusStyles,
            this.stepsListStyles,
            css`
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
        `];
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

    static get stepsListStyles() {
        return css`
            .steps-list {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                height: 200px;
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
        `;
    }
    renderStepsList() {
        return html`
            <div class="steps-list">
                ${this.generatedSteps.map((step, index) => html`
                    <div @mouseenter=${() => this._onMouseEnter(step)}
                        @mouseleave=${() => this._onMouseLeave(step)}
                        class=${classMap({ selected: this.selectedStepIndex === index, step: true })}>
                        <span class="label" @click=${() => this._onClick(step)}>${step.source}</span>
                    </div>
                `)}
            </div>
        `;
    }
    static get barStyles() {
        return css`
            .bar {
                display: flex;
                flex-direction: row;
                height: 24px;
                padding-left: 8px;
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
            .icon-btn {
                width: 24px;
            }
            .icon-btn svg {
                fill: white;
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
            kano-tooltip {
                --kano-tooltip-border-width: 0px;
            }
            .tooltip-content {
                min-width: 120px; 
                padding: 16px 0px;
                display: flex;
                flex-direction: column;
            }
            .tooltip-content button {
                text-align: left;
                padding: 8px 16px;
                background: transparent;
                border: none;
                cursor: pointer;
            }
            .tooltip-content button:hover {
                background: var(--color-stone);
            }
        `;
    }
    renderBar() {
        return html`
            <div class="bar ${this.mode}">
                <button class="icon-btn" title="Previous step" @click=${() => this._onPreviousStepClick()}>
                    ${templateContent(previous)}
                </button>
                <button class="icon-btn" title="Play/Stop challenge" @click=${() => this._onChallengeToggleClick()}>
                    ${this.mode === 'edit' ? templateContent(play) : templateContent(stop)}
                </button>
                <button class="icon-btn" title="Next step" @click=${() => this._onNextStepClick()}>
                    ${templateContent(next)}
                </button>
                <button id="title" @click=${() => this.openTooltip()}>${this.title}</button>
                ${this.offline ? this.renderConnectionStatus() : ''}
            </div>
            <kano-tooltip position="top" id="files-tooltip" offset="0" .autoClose=${true} caret="start">
                <div class="tooltip-content">
                    ${this.files.map((path) => this.renderFile(path))}
                </div>
            </kano-tooltip>
        `;
    }
    _onPreviousStepClick() {
        this._onDidClickPrevious.fire();
    }
    _onNextStepClick() {
        this._onDidClickNext.fire();
    }
    static get fileStyles() {
        return css`
            .file {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            .file .icon {
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }
        `;
    }
    renderFile(path : string) {
        return html`
            <button class="file" @click=${() => this.selectFile(path)}>
                <div class="icon">${path === this.selectedFile ? templateContent(tick) : ''}</div>
                <div>${path}</div>
            </button>
        `;
    }
    static get connectionStatusStyles() {
        return css`
            .connection-status {
                width: 24px;
                height: 24px;
                background: red;
                fill: white;
            }
        `;
    }
    renderConnectionStatus() {
        return html`
            <div title="Could not connect to the challenge server" class="connection-status">
                ${templateContent(clear)}
            </div>
        `;
    }
    renderPreview() {
        const stepData = this.selectedStep ? this.selectedStep.data : {};
        const stepDataString = this.selectedStep ? JSON.stringify(stepData, null, '    ') : '';
        return html`
            <pre><code>${highlight(stepDataString, 'javascript')}</code></pre>
        `;
    }
    selectFile(path : string) {
        this.filesTooltip!.close();
        this.selectedFile = path;
        this._onDidSelectFile.fire(path);
    }
    openTooltip() {
        if (!this.files.length) {
            return;
        }
        this.filesTooltip!.target = this.renderRoot!.querySelector('#title') as HTMLElement;
        this.filesTooltip!.open();
    }
    toggle() {
        this.collapsed = !this.collapsed;
    }
    close() {
        this.collapsed = true;
    }
    setStepData(steps : IGeneratedStep[]) {
        this.generatedSteps = steps.slice(0);
    }
    selectStep(index : number) {
        this.selectedStepIndex = index;
    }
    playStep(step : IGeneratedStep) {
        const index = this.generatedSteps.indexOf(step);
        this.selectStep(index);
        this._onDidPlayStep.fire(step);
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
    dispose() {
        dispose(this.subscriptions);
        this.subscriptions.length = 0;
    }
}
