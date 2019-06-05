import 'js-beautify/js/lib/beautify.js';
import '../kano-code-display/kano-code-display.js';
import { property, customElement, css, LitElement, html, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import '../kc-workspace-toolbar/kc-workspace-toolbar.js';
import { localize as _ } from '../../lib/i18n/index.js';

@customElement('kano-app-editor')
export class KanoAppEditor extends LitElement {
    @property({ type: String })
    public code? : string;
    @property({ type: String })
    public workspaceTab : string = 'workspace';
    @property({ type: Boolean })
    public isResizing : boolean = false;

    @query('#section')
    private section? : HTMLElement;

    @query('#workspace-panel')
    private workspacePanel? : HTMLElement;

    @query('#source-container')
    public sourceContainer? : HTMLElement;

    @query('#widget-layer')
    public widgetLayer? : HTMLElement;

    @query('#workspace-host')
    public workspaceEl? : HTMLElement;

    @query('#activity-bar')
    public activityBarEl? : HTMLElement;
    
    static get styles() {
        return [css`
            :host {
                display: flex;
                flex-direction: row;
                position: relative;
                max-width: 100vw;
                width: 100%;
                height: 100%;
            }
            :host section {
                display: flex;
                flex-direction: row-reverse;
                flex: 1;
                flex-basis: 0.000000001px;
                position: relative;
                overflow: hidden;
            }
            :host section #source-panel {
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                position: relative;
                min-width: 50%;
                max-width: 70%;
            }
            :host section #workspace-panel {
                display: flex;
                flex-direction: column;
                position: relative;
                min-width: 33%;
                max-width: 50%;
                width: 33%;
                background-color: var(--kano-app-editor-workspace-background, #f2f2f2);
            }
            .tabs {
                height: 100%;
                background-color: var(--kano-app-editor-workspace-background, #f2f2f2);
                display: flex;
                flex-direction: row;
                align-self: flex-end;
                margin-top: 10px;
            }
            .tab {
                align-self: center;
                border: none;
                background: transparent;
                width: 50%;
                font-family: var(--font-body);
                font-weight: bold;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                outline: none;
                opacity: 0.8;
                color: rgba(255, 255, 255, 0.5);
                border-radius: 50px;
                margin: 10px;
                padding: 10px;
            }
            .tab.selected {
                color: #fff;
                opacity: 1;
                background: #394148;
            }
            :host iron-pages.workspace-pages {
                display: flex;
                flex-direction: column;
                flex: 1;
                flex-basis: 0.000000001px;
                overflow: visible;
            }
            :host #workspace-panel kano-workspace {
                flex: 1;
                flex-basis: 0.000000001px;
            }
            :host kano-code-display {
                margin: 16px;
            }
            :host [main] {
                display: flex;
                flex-direction: column;
                flex: 1;
                flex-basis: 0.000000001px;
                position: relative;
            }
            #source-container {
                display: flex;
                flex: 1;
            }
            #source-container>* {
                flex: 1;
            }
            :host #resize {
                position: absolute;
                width: 8px;
                top: 0px;
                bottom: 0px;
                right: -4px;
                cursor: ew-resize;
                background-color: transparent;
                z-index: 1;
            }
            :host .hidden {
                visibility: hidden;
                opacity: 0;
            }
            .editor {
                position: relative;
            }
            kc-workspace-toolbar {
                padding: 20px 0;
            }
            .top-container {
                display: flex;
                margin: 0 12px -16px 20px;
            }
            #workspace-host {
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            .controls {
                display: flex;
                flex: 1;
                flex-direction: column;
                box-sizing: border-box;
            }
            .activity-bar {
                background: #1A1A1A;
                display: flex;
                flex-direction: column;
            }
            .activity-bar > button {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                width: 48px;
                height: 48px;
                background: transparent;
                border: none;
                padding: 8px;
                box-sizing: border-box;
                margin-bottom: 8px;
            }
            .activity-bar > button:not([disabled]) {
                cursor: pointer;
            }
            .activity-bar button:focus img {
                opacity: 1;
            }
            .activity-bar button:focus {
                outline: none;
            }
            .activity-bar button img.default {
                width: 24px;
                height: 24px;
            }
            .activity-bar button img.big {
                width: 32px;
                height: 32px;
            }
            .activity-bar button img:not(.important) {
                transition: opacity 0.15s ease;
                opacity: 0.5;
            }
            .activity-bar button:not([disabled]):hover img {
                opacity: 1;
            }
            #widget-layer {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                overflow: hidden;
            }
            .ui-edition {
                border-left: 2px solid var(--kc-border-color);
            }
            #widget-layer * {
                pointer-events: all;
            }
            [hidden] {
                display: none !important;
            }
        `];
    }
    render() {
        return html`
            <div class="activity-bar" id="activity-bar"></div>
            <section id="section"
                     @mousemove=${(e : MouseEvent) => this.mouseMoved(e)}
                     @mouseup=${() => this.completedResizing()}>
                <div class="ui-edition" id="workspace-panel">
                    <div class="top-container">
                        <div class="tabs"
                                    attr-for-selected="id"
                                    .selected=${this.workspaceTab}
                                    autoselect>
                            ${this.getTab(_('ARTBOARD', 'Artboard'), 'workspace')}
                            ${this.getTab(_('CODE_DISPLAY', 'Code'), 'code-display')}
                        </div>
                        <div class="controls">
                            <kc-workspace-toolbar id="toolbar"></kc-workspace-toolbar>
                        </div>
                    </div>
                    <div id="workspace-host" ?hidden=${this.workspaceTab !== 'workspace'}></div>
                    <kano-code-display id="code-display" .code=${this._setCodeDisplay(this.code, this.workspaceTab)} lang="javascript" ?hidden=${this.workspaceTab !== 'code-display'}></kano-code-display>
                </div>
                <div name="code" class="editor" id="source-panel">
                    <div id="resize" @mousedown=${(e : MouseEvent) => this.resizeWorkspace(e)}></div>
                    <div main class="main">
                        <slot name="source-editor"></slot>
                    </div>
                </div>
            </section>
            <div id="widget-layer"></div>
        `;
    }
    getTab(label : string, id : string) {
        return html`
            <button class="tab ${classMap({ selected: this.workspaceTab === id })}" @click=${() => this.workspaceTab = id}>${label}</button>
        `;
    }
    _onSelectedChanged(e : CustomEvent) {
        this.workspaceTab = e.detail.value;
    }
    _setCodeDisplay(code : string|undefined, workspaceTab : string) {
        if (workspaceTab === 'workspace') {
            return;
        }
        return window.js_beautify(code || '', { indent_size: 2 });
    }

    /**
   * Resize the workspace
   */
    resizeWorkspace(e : MouseEvent) {
        this.pauseEvent(e);
        this.isResizing = true;
    }
    /**
   * Completed the resize action
   */
    completedResizing() {
        this.isResizing = false;
    }
    /**
   * Used to prevent text selection when dragging
   */
    pauseEvent(e : Event) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
    /**
   * Mouse moved handler
   */
    mouseMoved(e : MouseEvent) {
        if (!this.section || !this.workspacePanel) {
            return;
        }
        if (!this.isResizing) {
            return;
        }
        this.pauseEvent(e);
        const offsetPanel = this.section.getBoundingClientRect().right - e.clientX;
        this.workspacePanel.style.width = `${offsetPanel}px`;
        // We need to trigger the resize of the kano-ui-workspace and the blockly workspace
        window.dispatchEvent(new Event('resize'));
    }
}
