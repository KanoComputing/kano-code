import { Plugin } from '../editor/plugin.js';
import { CreationDialogProvider } from './creation-dialog.js';
import { Player } from '../player/index.js';
import { Subscriptions, subscribe } from '../util/subscription.js';

export class CreationPlugin extends Plugin {
    constructor() {
        super();
        this.subscriptions = new Subscriptions();
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this.creationDialogProvider = new CreationDialogProvider();
        this.creationDialog = this.editor.dialogs.registerDialog(this.creationDialogProvider);
        this.creationDialog.root.style.borderRadius = '5px';
        this.creationDialog.root.style.overflow = 'hidden';
        // Add to subscriptions
        this.subscriptions.push(
            // Listen to the submit event from the form
            subscribe(this.creationDialogProvider, 'submit', this._onSubmit.bind(this)),
            subscribe(this.creationDialogProvider, 'dismiss', this._onDismiss.bind(this)),
            subscribe(this.creationDialog, 'close', () => this._onClose()),
        );
    }
    _onClose() {
        if (this.player) {
            this.player.dispose();
            this.creationDialogProvider.resetPreviewSlot();
        }
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
        this.creation = this.editor.exportCreation();
        this.creationDialog.open();
        const player = new Player();
        player.inject(this.creationDialogProvider.getPreviewSlot());
        player.load(this.creation)
            .then(() => {
                player.output.setRunningState(true);
                return this.editor.createCreationPreview(player.output);
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
        this.subscriptions.dispose();
        this.creationDialog.dispose();
    }
}

export default CreationPlugin;
