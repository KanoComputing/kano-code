import { Plugin } from '../plugin.js';
import { Subscriptions, subscribe } from '../../util/subscription.js';

export class WorkspaceToolbar extends Plugin {
    constructor() {
        super();
        this.subscriptions = new Subscriptions();
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        const { workspaceView } = this.editor;
        this.toolbar = workspaceView.toolbar;
        if (!this.toolbar) {
            return;
        }

        this.subscriptions.push(
            subscribe(this.editor.output, 'running-state-changed', this.updateRunningState.bind(this)),
            subscribe(this.editor.output, 'fullscreen-changed', this.updateFullscreen.bind(this)),
            subscribe(this.toolbar, 'restart-clicked', this.restart.bind(this)),
            subscribe(this.toolbar, 'run-clicked', this.toggleRun.bind(this)),
            subscribe(this.toolbar, 'fullscreen-clicked', this.toggleFullscreen.bind(this)),
            subscribe(this.toolbar, 'reset-clicked', this.reset.bind(this)),
            subscribe(this.toolbar, 'export-clicked', this.export.bind(this)),
            subscribe(this.toolbar, 'import-clicked', this.import.bind(this)),
            subscribe(this.toolbar, 'save-clicked', this.save.bind(this)),
        );
    }
    updateRunningState() {
        this.toolbar.running = this.editor.output.getRunningState();
    }
    updateFullscreen() {
        this.toolbar.fullscreen = this.editor.output.getFullscreen();
    }
    restart() {
        this.editor.output.restart();
    }
    toggleRun() {
        this.editor.output.toggleRunningState();
    }
    toggleFullscreen() {
        this.editor.output.toggleFullscreen();
    }
    reset() {
        this.editor.reset();
    }
    export() {
        this.editor.exportToDisk();
    }
    import() {
        this.editor.importFromDisk();
    }
    save() {
        this.editor.creation.init();
    }
    addEntry(...args) {
        if (!this.toolbar) {
            return WorkspaceToolbar.createDisposableNoop();
        }
        return this.toolbar.addEntry(...args);
    }
    addSettingsEntry(...args) {
        if (!this.toolbar) {
            return WorkspaceToolbar.createDisposableNoop();
        }
        return this.toolbar.addSettingsEntry(...args);
    }
    static createDisposableNoop() {
        return {
            on() {},
            updateTitle() {},
            updateIcon() {},
            updateIronIcon() {},
            dispose() {},
        };
    }
    onDispose() {
        this.subscriptions.dispose();
    }
}


export default WorkspaceToolbar;
