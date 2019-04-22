import { subscribeDOM, IDisposable } from '@kano/common/index.js';
import { TelemetryClient } from '@kano/telemetry/index.js';
import { Plugin } from '../plugin.js';
import Editor from '../editor.js';
import { ToolbarEntryPosition } from '../../../elements/kc-workspace-toolbar/entry.js';

/**
 * Manages the actions in the toolbar avilable in the workspace
 */
export class WorkspaceToolbar extends Plugin {
    private subscriptions : IDisposable[] = [];
    private _telemetry : TelemetryClient;
    private editor? : Editor;
    private toolbar? : any;
    private resetDialog? : any;
    private defaultEntries : Map<string, any> = new Map();
    constructor() {
        super();
        this._telemetry = new TelemetryClient({ scope: 'workspace_toolbar' });
    }
    /**
     * @param {Editor} editor The editor this plugin is attached to
     */
    onInstall(editor : any) {
        /** @type {Editor} */
        this.editor = editor;
        this.editor!.telemetry.mount(this._telemetry);
    }
    onInject() {
        if (!this.editor || !this.editor.workspaceView) {
            return;
        }
   
        this.toolbar = this.editor.root.querySelector('kc-workspace-toolbar');
        if (!this.toolbar) {
            return;
        }

        this.editor.output.onDidRunningStateChange(() => this.updateRunningState(), this, this.subscriptions);
        this.editor.output.onDidFullscreenChange(() => this.updateFullscreen(), this, this.subscriptions);

        let entry = this.addSettingsEntry({
            title: 'Reset Workspace',
            ironIcon: 'kc-ui:reset',
        });
        entry.onDidActivate(() => this.reset());
        this.defaultEntries.set('reset', entry);
        
        entry = this.addSettingsEntry({
            title: 'Export',
            ironIcon: 'kc-ui:export',
        })
        entry.onDidActivate(() => this.export());
        this.defaultEntries.set('export', entry);

        entry = this.addSettingsEntry({
            title: 'Import',
            ironIcon: 'kc-ui:import',
        });
        entry.onDidActivate(() => this.import());
        this.defaultEntries.set('import', entry);

        entry = this.addEntry({
            id: 'restart',
            position: ToolbarEntryPosition.RIGHT,
            title: 'Restart',
            ironIcon: 'kc-ui:reset',
        });
        entry.onDidActivate(() => this.restart());
        this.defaultEntries.set('restart', entry);

        entry = this.addEntry({
            id: 'fullscreen',
            position: ToolbarEntryPosition.RIGHT,
            title: 'Fullscreen',
            ironIcon: 'kc-ui:maximize',
        });
        entry.onDidActivate(() => this.toggleFullscreen());

        this.defaultEntries.set('fullscreen', entry);

        this.subscriptions.push(
            subscribeDOM(this.toolbar, 'run-clicked', this.toggleRun.bind(this)),
        );
    }
    disable(id : string) {
        const entry = this.defaultEntries.get(id);
        if (!entry) {
            return;
        }
        entry.dispose();
    }
    updateRunningState() {
        if (!this.toolbar || !this.editor) {
            return;
        }
        this.toolbar.running = this.editor.output.getRunningState();
    }
    updateFullscreen() {
        if (!this.toolbar || !this.editor) {
            return;
        }
        this.toolbar.fullscreen = this.editor.output.getFullscreen();
        const fullscreenEntry = this.defaultEntries.get('fullscreen');
        if (!fullscreenEntry) {
            return;
        }
        fullscreenEntry.updateIronIcon(`kc-ui:${this.toolbar.fullscreen ? 'minimize' : 'maximize'}`);
    }
    restart() {
        if (!this.editor) {
            return;
        }
        this.editor.output.restart();
        this._telemetry.trackEvent({ name: 'restart_clicked' });
    }
    toggleRun() {
        if (!this.editor) {
            return;
        }
        this.editor.output.toggleRunningState();
        this._telemetry.trackEvent({ name: 'run_clicked' });
    }
    toggleFullscreen() {
        if (!this.editor) {
            return;
        }
        this.editor.output.toggleFullscreen();
        this._telemetry.trackEvent({ name: 'fullscreen_clicked', properties: { value: this.editor.output.getFullscreen() } });
    }
    reset() {
        if (!this.editor) {
            return;
        }
        if (!this.resetDialog) {
            this.resetDialog = this.editor.dialogs.registerConfirm({
                heading: 'Reset',
                text: 'You\'ll lose any unsaved changes',
            });
            this.resetDialog.onDidConfirm(() => {
                if (!this.editor) {
                    return;
                }
                this.editor.reset();
            });
        }
        this.resetDialog.open();
        this._telemetry.trackEvent({ name: 'reset_clicked' });
    }
    export() {
        if (!this.editor) {
            return;
        }
        this.editor.exportToDisk();
        this._telemetry.trackEvent({ name: 'export_clicked' });
    }
    import() {
        if (!this.editor) {
            return;
        }
        this.editor.importFromDisk();
        this._telemetry.trackEvent({ name: 'import_clicked' });
    }
    addEntry(...args : any[]) {
        if (!this.toolbar) {
            return WorkspaceToolbar.createDisposableNoop();
        }
        return this.toolbar.addEntry(...args);
    }
    addSettingsEntry(...args : any[]) {
        if (!this.toolbar) {
            return WorkspaceToolbar.createDisposableNoop();
        }
        return this.toolbar.addSettingsEntry(...args);
    }
    static createDisposableNoop() {
        return {
            onDidActivate() {},
            updateTitle() {},
            updateIcon() {},
            updateIronIcon() {},
            dispose() {},
        };
    }
    onDispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
}


export default WorkspaceToolbar;
