import EventEmitter from '../util/event-emitter.js';
import Config from '../config.js';
import Store from './store.js';
import ModeActions from '../actions/mode.js';
import EditorActions from '../actions/editor.js';
import StoreObserver from './store-observer.js';
import Toolbox from './toolbox.js';
import Runner from './runner.js';
import { Logger } from '../log/index.js';
import { DefaultWorkspaceViewProvider } from './workspace/default.js';
import { OutputModule } from './output/module.js';
import { Dialogs } from './dialogs/index.js';
import { Keybindings } from './keybindings/index.js';

import '../../elements/kano-app-editor/kano-app-editor.js';

const PROXY_EVENTS = [
    'share',
    'exit',
    'change',
    'reset',
    'add-part-request',
    'remove-part-request',
    'import',
];

class Editor extends EventEmitter {
    constructor(opts = {}) {
        super();
        this.config = Config.merge(opts);
        this.config.restartCodeHandler = this.restartApp.bind(this);
        this.logger = new Logger();
        this.logger.setLevel(this.config.LOG_LEVEL);
        this.elementsRegistry = new Map();
        this.rootEl = document.createElement('kano-app-editor');
        this.elementsRegistry.set('editor', this.rootEl);
        this.rootEl.editor = this;
        this.sourceType = opts.sourceType || 'blockly';
        this.store = Store.create({
            running: false,
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
        this.modeActions = ModeActions(this.store);
        this.editorActions = EditorActions(this.store);

        this.rootEl.storeId = this.store.id;
        this.storeObserver.rootEl.storeId = this.store.id;

        this.rootEl.addEventListener('reset', () => {
            this.reset();
        });

        this.eventRemovers = PROXY_EVENTS.map(name => Editor.proxyEvent(this.rootEl, this, name));

        this.plugins = [];

        this.dialogs = new Dialogs();
        this.addPlugin(this.dialogs);

        this.keybindings = new Keybindings();
        this.addPlugin(this.keybindings);

        this.toolbox = new Toolbox();
        this.addPlugin(this.toolbox);

        this.runner = new Runner();
        this.runner.addModule(OutputModule);
        this.addPlugin(this.runner);

        this.on('import', (event) => {
            this.load(event.app);
        });
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
        plugin.onInstall(this);
        if (this.injected) {
            plugin.onInject();
        }
    }
    runPluginTask(taskName, ...args) {
        this.plugins.forEach(plugin => plugin[taskName](...args));
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
        this.runPluginTask('onInject');
    }
    setMode(modeDefinition) {
        this.modeActions.updateMode(modeDefinition);
        this.runPluginTask('onModeSet', modeDefinition);
    }
    loadDefault() {
        const { mode } = this.store.getState();
        this.load({
            parts: [],
            source: mode.defaultSource,
        });
    }
    load(app) {
        this.runPluginTask('onAppLoad', app);
        this.editorActions.loadSource(app.source);
        this.emit('loaded');
    }
    reset() {
        this.loadDefault();
    }
    restartApp() {
        this.editorActions.setRunningState(false);
        this.editorActions.setRunningState(true);
    }
    save() {
        let app = this.rootEl.save();
        this.plugins.forEach((plugin) => {
            app = plugin.onSave(app);
        });
        return app;
    }
    share() {
        this.rootEl.share();
    }
    getMode() {
        const { mode } = this.store.getState();
        return mode;
    }
    getSource() {
        const { source } = this.store.getState();
        return source;
    }
    getCode() {
        const { code } = this.store.getState();
        return code;
    }
    setRunningState(state) {
        this.editorActions.setRunningState(state);
    }
    getRunningState() {
        const { running } = this.store.getState();
        return running;
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
    registerWorkspaceViewProvider(provider) {
        this.workspaceProvider = provider;
    }
    appendWorkspaceView() {
        if (!this.workspaceProvider) {
            this.workspaceProvider = new DefaultWorkspaceViewProvider(this);
        }
        this.rootEl.$.workspace.appendView(this.workspaceProvider);
    }
    get addedParts() {
        const { addedParts } = this.store.getState();
        return addedParts;
    }
    get sourceEditor() {
        return this.getElement('source-view');
    }
    get outputView() {
        return this.workspaceView.outputView;
    }
    get workspaceView() {
        return this.workspaceProvider;
    }
    get root() {
        return this.rootEl.shadowRoot;
    }
}

export default Editor;
