import { TelemetryClient } from '@kano/telemetry/index.js';
import { Plugin } from '../plugin.js';
import { Subscriptions, subscribe } from '../../util/subscription.js';

/**
 * Manages the actions in the toolbar avilable in the workspace
 */
export class WorkspaceToolbar extends Plugin {
    constructor() {
        super();
        this.subscriptions = new Subscriptions();
        this._telemetry = new TelemetryClient({ scope: 'workspace_toolbar' });
    }
    /**
     * @param {Editor} editor The editor this plugin is attached to
     */
    onInstall(editor) {
        /** @type {Editor} */
        this.editor = editor;
        this.editor.telemetry.mount(this._telemetry);
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
        this._telemetry.trackEvent({ name: 'restart_clicked' });
    }
    toggleRun() {
        this.editor.output.toggleRunningState();
        this._telemetry.trackEvent({ name: 'run_clicked' });
    }
    toggleFullscreen() {
        this.editor.output.toggleFullscreen();
        this._telemetry.trackEvent({ name: 'fullscreen_clicked', properties: { value: this.editor.output.getFullscreen() } });
    }
    reset() {
        this.editor.reset();
        this._telemetry.trackEvent({ name: 'reset_clicked' });
    }
    export() {
        this.editor.exportToDisk();
        this._telemetry.trackEvent({ name: 'export_clicked' });
    }
    import() {
        this.editor.importFromDisk();
        this._telemetry.trackEvent({ name: 'import_clicked' });
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
