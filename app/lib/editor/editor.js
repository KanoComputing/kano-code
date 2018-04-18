import EventEmitter from '../util/event-emitter.js';
import Config from '../config.js';
import Store from './store.js';
import ModeActions from '../actions/mode.js';
import EditorActions from '../actions/editor.js';
import StoreObserver from './store-observer.js';
import Toolbox from './toolbox.js';
import { getMessages } from '../i18n/index.js';

const PROXY_EVENTS = [
    'share',
    'exit',
    'change',
    'reset',
    'add-part-request',
    'remove-part-request',
];

class Editor extends EventEmitter {
    constructor(opts) {
        super();
        this.config = Config.merge(opts);
        this.config.restartCodeHandler = this.restartApp.bind(this);
        this.elRegistry = new Map();
        this.rootEl = document.createElement('kano-app-editor');
        this.elRegistry.set('editor', this.rootEl);
        this.rootEl.editor = this;
        this.store = Store.create({
            running: false,
            config: this.config,
            addedParts: [],
            workspaceTab: 'workspace',
        });
        this.storeObserver = new StoreObserver(this.store, this);
        this.modeActions = ModeActions(this.store);
        this.editorActions = EditorActions(this.store);

        this.sourceType = 'blockly';

        this.rootEl.storeId = this.store.id;

        this.rootEl.addEventListener('reset', () => {
            this.reset();
        });

        this.eventRemovers = PROXY_EVENTS.map(name => Editor.proxyEvent(this.rootEl, this, name));

        this.plugins = [];

        this.toolbox = new Toolbox();
        this.addPlugin(this.toolbox);
    }

    addPlugin(plugin) {
        this.plugins.push(plugin);
        plugin.onInstall(this);
        if (this.injected) {
            this.runPluginTask('onInject');
        }
    }

    runPluginTask(taskName, ...args) {
        this.plugins.forEach(plugin => plugin[taskName](...args));
    }

    setupElements() {
        const workspace = this.rootEl.getWorkspace();
        const addPartForm = this.rootEl.$['add-parts'];
        const sourceView = this.rootEl.$['root-view'];
        const addPartDialog = this.rootEl.$['parts-modal'];
        this.elRegistry.set('workspace', workspace);
        this.elRegistry.set('add-parts-form', addPartForm);
        this.elRegistry.set('add-parts-dialog', addPartDialog);
        this.elRegistry.set('source-view', sourceView);
        this.elRegistry.set('toolbox-enhancer-above', sourceView.$['toolbox-enhancer-above']);
    }

    getElement(id) {
        return this.elRegistry.get(id);
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
        Editor.enableLegacyI18nSupport();
        element.appendChild(this.store.providerElement);
        element.appendChild(this.storeObserver.rootEl);
        if (before) {
            element.insertBefore(this.rootEl, before);
        } else {
            element.appendChild(this.rootEl);
        }
        this.setupElements();
        this.runPluginTask('onInject');
    }
    static enableLegacyI18nSupport() {
        window.Kano.MakeApps = window.Kano.MakeApps || {};
        window.Kano.MakeApps.Msg = getMessages();
    }

    setMode(modeDefinition) {
        this.runPluginTask('onModeSet', modeDefinition);
        this.modeActions.updateMode(modeDefinition);
    }

    setToolbox(toolbox) {
        this._toolbox = toolbox;
        this.rootEl.defaultCategories = this._toolbox;
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
    get addedParts() {
        const { addedParts } = this.store.getState();
        return addedParts;
    }
}

export default Editor;
