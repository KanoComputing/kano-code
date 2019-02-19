import { TelemetryClient } from '@kano/telemetry/index.js';
import { Plugin } from '../editor/plugin.js';
import { CreationDialogProvider } from './creation-dialog.js';
import { Player } from '../player/index.js';
import { ToolbarEntryPosition } from '../../elements/kc-workspace-toolbar/entry.js';

export class CreationPlugin extends Plugin {
    constructor() {
        super();
        this.subscriptions = [];
        this._telemetry = new TelemetryClient({ scope: 'creations' });
        this.enabled = true;
    }
    onInstall(editor) {
        this.editor = editor;
        this.editor.telemetry.mount(this._telemetry);
    }
    onInject() {
        this.creationDialogProvider = new CreationDialogProvider();
        this.creationDialog = this.editor.dialogs.registerDialog(this.creationDialogProvider);
        this.creationDialog.root.style.borderRadius = '5px';
        this.creationDialog.root.style.overflow = 'hidden';
        // Add to subscriptions
        this.subscriptions.push(
            // Listen to the submit event from the form
            this.creationDialogProvider.onDidSubmit(this._onSubmit.bind(this)),
            this.creationDialogProvider.onDidDismiss(this._onDismiss.bind(this)),
            this.creationDialog.onDidClose(() => this._onClose()),
        );
        this._updateSaveButton();
    }
    _setupSaveButton() {
        if (this._saveEntry) {
            return;
        }
        this._saveEntry = this.editor.workspaceToolbar.addEntry({
            id: 'save',
            position: ToolbarEntryPosition.LEFT,
            title: 'Save',
            ironIcon: 'kc-ui:save',
        });
        this._saveEntry.onDidActivate(() => this.init());
    }
    _removeSaveButton() {
        if (!this._saveEntry) {
            return;
        }
        this._saveEntry.dispose();
        this._saveEntry = null;
    }
    _onClose() {
        if (this.player) {
            this.player.dispose();
        }
        this.creationDialogProvider.resetPreviewSlot();
    }
    _onSubmit(data) {
        const creationBundle = {
            title: data.title,
            description: data.description,
            preview: this.creationPreviewBlob,
            creation: this.creation,
        };
        this.creationDialogProvider.setPage('saving');
        this.editor.storeCreation(creationBundle).then(() => {
            this.creationDialogProvider.setPage('success');
        }).catch((e) => {
            this.creationDialogProvider.setPage('failure');
        });
    }
    _onDismiss() {
        this.creationDialog.close();
        this.reset();
    }
    reset() {
        this.creationDialogProvider.setPage('sharing-form');
        this.creationDialogProvider.resetPreviewSlot();
        this.creation = null;
        this.creationPreviewBlob = null;
    }
    init() {
        if (!this.enabled) {
            if (this.alertDialog) {
                this.alertDialog.open();
            }
            return;
        }
        this._telemetry.trackEvent({ name: 'save_clicked' });

        this.creation = this.editor.exportCreation();
        this.creationDialog.open();
        this.player = new Player();
        this.player.inject(this.creationDialogProvider.getPreviewSlot());
        this.player.load(this.creation)
            .then(() => {
                this.player.output.setRunningState(true);
                return this.editor.createCreationPreview(this.player.output);
            })
            .then((blob) => {
                this.creationPreviewBlob = blob;
                return this.editor.createCreationDisplay(blob);
            })
            .then((node) => {
                this.creationDialogProvider.resetPreviewSlot();
                const parent = this.creationDialogProvider.getPreviewSlot();
                node.style.maxWidth = '100%';
                node.style.maxHeight = '100%';
                parent.appendChild(node);
                this.creationDialogProvider.setRecording(false);
            })
            .catch((e) => {
                this.creationDialogProvider.setPage('failure');
                throw e;
            });
    }
    dispose() {
        // Dispose of the subscriptions
        this.subscriptions.forEach(d => d.dispose())
        this.subscriptions.length = 0;
        this.creationDialog.dispose();
    }
    enable() {
        this.enabled = true;

        this._setupSaveButton();

        if (this.alertDialog) {
            this.alertDialog.dispose();
        }
    }
    disable() {
        this.enabled = false;
        this._updateSaveButton();
    }
    disableWithReason(heading, text) {
        this.enabled = false;
        if (this.alertDialog) {
            this.alertDialog.dispose();
        }
        this.alertDialog = this.editor.dialogs.registerAlert({ heading, text, buttonLabel: 'Dismiss' });
        this._updateSaveButton();
    }
    _updateSaveButton() {
        if (!this.editor.injected) {
            return;
        }
        if (this.enabled || this.alertDialog) {
            this._setupSaveButton();
        } else {
            this._removeSaveButton();
        }
    }
}

export default CreationPlugin;
