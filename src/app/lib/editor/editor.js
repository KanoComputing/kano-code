import { TelemetryClient } from '@kano/telemetry/index.js';
import Config from '../config.js';
import Store from './store.js';
import EditorActions from '../actions/editor.js';
import StoreObserver from './store-observer.js';
import Toolbox from './toolbox.js';
import { Logger } from '../log/index.js';
import { DefaultWorkspaceViewProvider } from './workspace/default.js';
import { Dialogs } from './dialogs/index.js';
import { Keybindings } from './keybindings/index.js';
import { CreationPlugin } from '../creation/index.js';

import '../../elements/kano-app-editor/kano-app-editor.js';
import { EditorOrPlayer } from './editor-or-player.js';
import { Output } from '../output/output.js';
import { ActivityBar } from './activity-bar.js';
import { WorkspaceToolbar } from './workspace/toolbar.js';
import { EditorPartsManager } from '../part/editor.js';

const PROXY_EVENTS = [
    'share',
    'exit',
    'change',
    'reset',
    'add-part-request',
    'remove-part-request',
    'import',
];

// window namespaces used for easy access to editors in development
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};

/**
 * A full Kano Code Editor with customizable Workspace and Output
 * Example:
 * ```js
 * import * as code from '@kano/code/app/lib/index.js'
 *
 * const editor = new code.Editor();
 *
 * editor.inject(document.body);
 * ```
 */
export class Editor extends EditorOrPlayer {
    constructor(opts = {}) {
        super();
        this.config = Config.merge(opts);
        this.logger = new Logger();
        this.logger.setLevel(this.config.LOG_LEVEL);
        this.elementsRegistry = new Map();
        this.rootEl = document.createElement('kano-app-editor');
        this.elementsRegistry.set('editor', this.rootEl);
        this.rootEl.editor = this;
        this.sourceType = opts.sourceType || 'blockly';
        this._setupMediaPath(opts.mediaPath);
        this.store = Store.create({
            config: this.config,
            addedParts: [],
            workspaceTab: 'workspace',
            sourceType: this.sourceType,
            // When using blockly, can apply specific options
            blockly: {
                flyoutMode: typeof opts.flyoutMode === 'undefined' ? false : opts.flyoutMode,
            },
            editingBackground: false,
        });
        this.storeObserver = new StoreObserver(this.store, this);
        this.editorActions = EditorActions(this.store);

        this.rootEl.storeId = this.store.id;
        this.storeObserver.rootEl.storeId = this.store.id;

        this.rootEl.addEventListener('reset', () => {
            this.reset();
        });

        this.eventRemovers = PROXY_EVENTS.map(name => Editor.proxyEvent(this.rootEl, this, name));

        /** @type {Output} */
        this.output = new Output();

        /** @type {TelemetryClient} */
        this.telemetry = new TelemetryClient({ scope: 'kc-editor' });

        /** @type {WorkspaceToolbar} */
        this.workspaceToolbar = new WorkspaceToolbar();
        this.addPlugin(this.workspaceToolbar);

        this.dialogs = new Dialogs();
        this.addPlugin(this.dialogs);

        this.keybindings = new Keybindings();
        this.addPlugin(this.keybindings);

        this.toolbox = new Toolbox();
        this.addPlugin(this.toolbox);

        this.creation = new CreationPlugin();
        this.addPlugin(this.creation);

        this.parts = new EditorPartsManager(this);

        this.on('import', (event) => {
            this.load(event.app);
        });

        this.activityBar = new ActivityBar();
        this.addPlugin(this.activityBar);

        this._registeredEvents = [];

        window.Kano.Code.mainEditor = this;
    }
    _setupMediaPath(path = '/') {
        this._mediaPath = path.endsWith('/') ? path.slice(0, -1) : path;
    }
    asAbsoluteMediaPath(path = '') {
        const normalized = path.replace(/^(\.\/|\.\.\/|\/)/, '');
        return `${this._mediaPath}/${normalized}`;
    }
    registerEvent(name) {
        this._registeredEvents.push(name);
    }
    getEvents() {
        return this._registeredEvents;
    }
    /**
     * Adds a plugin to this editor, plugins have access to lifecycle steps and
     * customization APIs to tailor the coding experience to your needs
     * Example:
     *
     * const MyPlugin extends code.Plugin {
     *     onInstall(editor) {
     *         // Do something with the editor
     *     }
     *     onInject() {}
     * }
     * @param {Plugin} plugin The plugin to add
     */
    addPlugin(plugin) {
        super.addPlugin(plugin);
        plugin.onInstall(this);
        if (this.injected) {
            plugin.onInject();
        }
    }
    setupElements() {
        const workspace = this.rootEl.getWorkspace();
        const addPartForm = this.rootEl.$['add-parts'];
        const sourceView = this.rootEl.shadowRoot.querySelector('#root-view');
        const addPartDialog = this.rootEl.$['parts-modal'];
        this.elementsRegistry.set('workspace', workspace);
        this.elementsRegistry.set('add-parts-form', addPartForm);
        this.elementsRegistry.set('add-parts-dialog', addPartDialog);
        this.elementsRegistry.set('source-view', sourceView);

        this.sourceEditor.addEventListener('code-changed', (e) => {
            this.setCode(e.detail.value);
        });
    }
    /**
     * TODO: Remove once the editor moved to a better element registry API
     * Ads an element to the old app-element-registry-behavior
     */
    registerLegacyElement(id, el) {
        this.rootEl._registerElement(id, el);
    }
    getElement(id) {
        return this.elementsRegistry.get(id);
    }
    static proxyEvent(el, emitter, name) {
        const onEvent = (e) => {
            emitter.emit(name, e.detail);
        };
        el.addEventListener(name, onEvent);
        return () => {
            el.removeEventListener(name, onEvent);
        };
    }
    inject(element = document.body, before = null) {
        if (this.injected) {
            return;
        }
        this.injected = true;
        element.appendChild(this.store.providerElement);
        element.appendChild(this.storeObserver.rootEl);
        if (before) {
            element.insertBefore(this.rootEl, before);
        } else {
            element.appendChild(this.rootEl);
        }
        this.appendWorkspaceView();
        this.setupElements();
        this.output.onInject();
        if (this.workspaceProvider) {
            this.workspaceProvider.onInject();
        }
        this.parts.onInject();
        if (this._queuedVariables) {
            this.loadVariables(this._queuedVariables);
            this._queuedVariables = null;
        }
        this.runPluginTask('onInject');
        this.telemetry.trackEvent({ name: 'ide_opened' });
        if (this._queuedApp) {
            this.load(this._queuedApp);
            this._queuedApp = null;
        }
    }
    dispose() {
        if (this.injected) {
            this.store.providerElement.parentNode.removeChild(this.store.providerElement);
            this.storeObserver.rootEl.parentNode.removeChild(this.storeObserver.rootEl);
            this.rootEl.parentNode.removeChild(this.rootEl);
        }
        this.output.dispose();
        if (this.workspaceView) {
            this.workspaceView.onDispose();
        }
        this.runPluginTask('onDispose');
        if (window.Kano.Code.mainEditor === this) {
            window.Kano.Code.mainEditor = null;
        }
        this.telemetry.trackEvent({ name: 'ide_exited' });
    }
    load(app) {
        if (!this.injected) {
            this._queuedApp = app;
            return;
        }
        this.runPluginTask('onImport', app);
        this.output.runPluginTask('onImport', app);
        this.editorActions.loadSource(app.source);
        this.emit('loaded');
        this.telemetry.trackEvent({ name: 'app_imported' });
    }
    reset() {
        const source = this.profile ? this.profile.source : '';
        this.setCode(null);
        this.load({ source });
    }
    setCode(content) {
        this.output.setCode(content);
        this.rootEl.code = content;
        this.unsavedChanges = true;
        this.output.restart();
    }
    restartApp() {
        this.output.restart();
    }
    exportCreation() {
        let data = this.export();
        this.plugins.forEach((plugin) => {
            data = plugin.onCreationExport(data);
        });
        data = this.output.onCreationExport(data);
        return data;
    }
    export() {
        let app = this.rootEl.save();
        this.plugins.forEach((plugin) => {
            app = plugin.onExport(app);
        });
        app = this.output.onExport(app);
        return app;
    }
    exportToDisk() {
        const savedApp = this.export();
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(savedApp)], { type: 'application/kcode' });
        const url = URL.createObjectURL(file);
        document.body.appendChild(a);
        a.download = 'my-app.kcode';
        a.href = url;
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.telemetry.trackEvent({ name: 'app_exported' });
    }
    importFromDisk() {
        this.fileInput = document.createElement('input');
        this.fileInput.setAttribute('type', 'file');
        this.fileInput.style.display = 'none';
        this.fileInput.addEventListener('change', (evt) => {
            const f = evt.target.files[0];
            if (f) {
                const r = new FileReader();
                r.onload = (e) => {
                    const app = JSON.parse(e.target.result);
                    this.load(app);
                };
                r.readAsText(f);
                document.body.removeChild(this.fileInput);
            }
        });
        document.body.appendChild(this.fileInput);
        this.fileInput.click();
    }
    createCreationPreview(externalOutput) {
        const output = externalOutput || this.output;
        if (!this.creationPreviewProvider) {
            throw new Error('Could not create creation preview: No CreationPreviewProvider was registered');
        }
        return this.creationPreviewProvider.createFile(output);
    }
    createCreationDisplay(blob) {
        if (!this.creationPreviewProvider) {
            throw new Error('Could not create creation display: No CreationPreviewProvider was registered');
        }
        return this.creationPreviewProvider.display(blob);
    }
    storeCreation(creationBundle) {
        if (!this.creationStorageProvider) {
            return Promise.reject(new Error('Could not store creation: No CreationStorageProvider was registered'));
        }
        const p = this.creationStorageProvider.write(creationBundle);
        if (p instanceof Promise) {
            return p;
        }
        return Promise.resolve(p);
    }
    save() {
        return this.export();
    }
    share() {
        this.rootEl.share();
    }
    getSource() {
        const { source } = this.store.getState();
        return source;
    }
    getCode() {
        const { code } = this.store.getState();
        return code;
    }
    getViewport() {
        const ws = this.getWorkspace();
        return ws.getViewport();
    }
    getWorkspace() {
        return this.rootEl.getWorkspace();
    }
    getBlocklyWorkspace() {
        return this.rootEl.getBlocklyWorkspace();
    }
    loadVariables(variables) {
        if (!this.injected) {
            this._queuedVariables = variables;
            return;
        }
        const workspace = this.getBlocklyWorkspace();
        if (variables && workspace) {
            variables.forEach((v) => {
                Blockly.Variables.addVariable(v, workspace);
            });
        }
    }
    registerProfile(profile) {
        if (profile.onInstall) {
            profile.onInstall(this);
        }
        this.output.registerProfile(profile.outputProfile);
        if (profile && !Array.isArray(profile.toolbox)) {
            throw new Error('Could not register EditorProfile: toolbox is not an array');
        }
        if (profile.plugins && !Array.isArray(profile.plugins)) {
            throw new Error('Could not register EditorProfile: plugins is not an array');
        }
        this.profile = profile;
        const workspaceViewProvider = this.profile.workspaceViewProvider
            || new DefaultWorkspaceViewProvider(this);
        this.registerWorkspaceViewProvider(workspaceViewProvider);
        if (this.profile.plugins) {
            this.profile.plugins.forEach(p => this.addPlugin(p));
        }
        if (this.profile.toolbox) {
            this.profile.toolbox.forEach(t => this.toolbox.addEntry(t));
        }
        if (this.profile.parts) {
            this.profile.parts.forEach(p => this.parts.registerAPI(p));
        }
        if (this.profile.creationPreviewProvider) {
            this.creationPreviewProvider = this.profile.creationPreviewProvider;
            this.addPlugin(this.creationPreviewProvider);
        }
        if (this.profile.creationStorageProvider) {
            this.creationStorageProvider = this.profile.creationStorageProvider;
            this.addPlugin(this.creationStorageProvider);
        }
    }
    registerWorkspaceViewProvider(provider) {
        this.workspaceProvider = provider;
        this.workspaceProvider.onInstall(this);
    }
    appendWorkspaceView() {
        this.rootEl.$.workspace.appendView(this.workspaceProvider);
        this.output.checkOutputView();
        this.workspaceProvider.setOutputView(this.output.outputView);
    }
    get sourceEditor() {
        return this.getElement('source-view');
    }
    get workspaceView() {
        return this.workspaceProvider;
    }
    get root() {
        return this.rootEl.shadowRoot;
    }
}

export default Editor;
