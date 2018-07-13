import Config from '../config.js';
import Store from './store.js';
import EditorActions from '../actions/editor.js';
import StoreObserver from './store-observer.js';
import Toolbox from './toolbox.js';
import { Logger } from '../log/index.js';
import { DefaultWorkspaceViewProvider } from './workspace/default.js';
import { Dialogs } from './dialogs/index.js';
import { Keybindings } from './keybindings/index.js';

import '../../elements/kano-app-editor/kano-app-editor.js';
import { EditorOrPlayer } from './editor-or-player.js';
import { Output } from '../output/output.js';
import { ActivityBar } from './activity-bar.js';

const PROXY_EVENTS = [
    'share',
    'exit',
    'change',
    'reset',
    'add-part-request',
    'remove-part-request',
    'import',
];

class Editor extends EditorOrPlayer {
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
        this.store = Store.create({
            config: this.config,
            addedParts: [],
            workspaceTab: 'workspace',
            sourceType: this.sourceType,
            // When using blockly, can apply specific options
            blockly: {
                flyoutMode: false,
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

        this.output = new Output();

        this.dialogs = new Dialogs();
        this.addPlugin(this.dialogs);

        this.keybindings = new Keybindings();
        this.addPlugin(this.keybindings);

        this.toolbox = new Toolbox();
        this.addPlugin(this.toolbox);

        this.on('import', (event) => {
            this.load(event.app);
        });

        this.activityBar = new ActivityBar();
        this.addPlugin(this.activityBar);
    }
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
        this.elementsRegistry.set('toolbox-enhancer-above', sourceView.$['toolbox-enhancer-above']);

        this.sourceEditor.addEventListener('code-changed', (e) => {
            this.output.setCode(e.detail.value);
            this.rootEl.code = e.detail.value;
            this.unsavedChanges = true;
            this.output.restart();
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
        if (this.workspaceProvider) {
            this.workspaceProvider.onInject();
        }
        this.runPluginTask('onInject');
    }
    load(app) {
        this.runPluginTask('onImport', app);
        this.output.runPluginTask('onImport', app);
        this.editorActions.loadSource(app.source);
        this.emit('loaded');
    }
    reset() {
        const source = this.profile ? this.profile.source : '';
        this.load({ source });
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
        const workspace = this.getBlocklyWorkspace();
        if (variables && workspace) {
            variables.forEach((v) => {
                Blockly.Variables.addVariable(v, workspace);
            });
        }
    }
    registerProfile(profile) {
        if (profile && !Array.isArray(profile.toolbox)) {
            throw new Error('Could not register EditorProfile: toolbox is not an array');
        }
        if (profile.plugins && !Array.isArray(profile.plugins)) {
            throw new Error('Could not register EditorProfile: plugins is not an array');
        }
        this.profile = profile;
        this.output.registerProfile(this.profile.outputProfile);
        this.registerWorkspaceViewProvider(this.profile.workspaceViewProvider);
        if (this.profile.plugins) {
            this.profile.plugins.forEach(p => this.addPlugin(p));
        }
        if (this.profile.toolbox) {
            this.profile.toolbox.forEach(t => this.toolbox.addEntry(t));
        }
    }
    registerWorkspaceViewProvider(provider) {
        this.workspaceProvider = provider;
        this.workspaceProvider.onInstall(this);
    }
    appendWorkspaceView() {
        if (!this.workspaceProvider) {
            this.workspaceProvider = new DefaultWorkspaceViewProvider(this);
        }
        this.rootEl.$.workspace.appendView(this.workspaceProvider);
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
