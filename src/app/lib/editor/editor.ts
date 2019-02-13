import { TelemetryClient } from '@kano/telemetry/index.js';
import Config from '../config.js';
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
import { EditorPartsManager } from '../parts/editor.js';
import { BlocklySourceEditor } from './source-editor/blockly.js';
import { transformLegacyApp } from '../legacy/loader.js';
import { SourceEditor } from './source-editor/source-editor.js';
import { Plugin } from './plugin.js';
import EditorProfile from './profile.js';
import { CreationCustomPreviewProvider } from '../creation/creation-preview-provider.js';
import CreationStorageProvider from '../creation/creation-storage-provider.js';
import { deprecated } from '../decorators.js';
import { WorkspaceViewProvider } from './workspace/index.js';
import { EventEmitter } from '@kano/common/index.js';
import { IEditorWidget } from './widget/widget.js';
import { QueryEngine, IQueryResult } from './selector/selector.js';

declare global {
    interface Window {
        Kano : {
            Code : {
                mainEditor? : Editor|null,
            },
        },
    }
}

// window namespaces used for easy access to editors in development
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};

export interface IEditorOptions {
    sourceType? : 'blockly'|'code';
    mediaPath? : string;
    blockly? : any;
}

export interface ICreationBundle {}

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
    public config : any;
    public logger : Logger = new Logger();
    public elementsRegistry : Map<string, HTMLElement> = new Map();
    public rootEl : HTMLElement = document.createElement('kano-app-editor');
    public sourceType : 'blockly'|'code' = 'blockly';
    public output : Output = new Output();
    public telemetry : TelemetryClient = new TelemetryClient({ scope: 'kc-editor' });
    public sourceEditor : SourceEditor;
    public workspaceToolbar : WorkspaceToolbar = new WorkspaceToolbar();
    public dialogs : Dialogs = new Dialogs();
    public keybindings : Keybindings = new Keybindings();
    public toolbox : Toolbox = new Toolbox();
    public creation : CreationPlugin = new CreationPlugin();
    public parts : EditorPartsManager;
    public activityBar : ActivityBar = new ActivityBar();
    public injected : boolean = false;
    private _registeredEvents : string[] = [];
    private _mediaPath : string = '';
    private _queuedApp : string|null = null;
    public workspaceProvider? : WorkspaceViewProvider;
    public profile? : EditorProfile;
    public unsavedChanges : boolean = false;
    public creationPreviewProvider? : CreationCustomPreviewProvider;
    public creationStorageProvider? : CreationStorageProvider;

    // Events
    private _onDidReset : EventEmitter = new EventEmitter();
    get onDidReset() { return this._onDidReset.event }
    private _onDidLoad : EventEmitter = new EventEmitter();
    get onDidLoad() { return this._onDidLoad.event }
    private _onDidInject : EventEmitter = new EventEmitter();
    get onDidInject() { return this._onDidInject.event }

    private queryEngine : QueryEngine = new QueryEngine();
    constructor(opts : IEditorOptions = {}) {
        super();
        this.config = Config.merge(opts);
        this.logger.setLevel(this.config.LOG_LEVEL);
        this.elementsRegistry.set('editor', this.rootEl);
        (this.rootEl as any).editor = this;
        this.sourceType = opts.sourceType || 'blockly';
        this._setupMediaPath(opts.mediaPath);

        // No support for dynamic editor yet
        if (this.sourceType === 'blockly') {
        }
        this.sourceEditor = new BlocklySourceEditor(this);
        this.sourceEditor.registerQueryHandlers(this.queryEngine);

        this.addPlugin(this.workspaceToolbar);
        this.addPlugin(this.dialogs);
        this.addPlugin(this.keybindings);
        this.addPlugin(this.toolbox);
        this.addPlugin(this.creation);
        this.addPlugin(this.activityBar);

        this.toolbox.registerQueryHandlers(this.queryEngine);

        this.parts = new EditorPartsManager(this);
        this.parts.registerQueryHandlers(this.queryEngine);
        window.Kano.Code.mainEditor = this;
    }
    _setupMediaPath(path = '/node_modules/@kano/code') {
        this._mediaPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    }
    asAbsoluteMediaPath(path = '') {
        const normalized = path.replace(/^(\.\/|\.\.\/|\/)/, '');
        return `${this._mediaPath}/${normalized}`;
    }
    registerEvent(name : string) {
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
     * @param plugin The plugin to add
     */
    addPlugin(plugin : Plugin) {
        super.addPlugin(plugin);
        plugin.onInstall(this);
        if (this.injected) {
            plugin.onInject();
        }
    }
    setupElements() {
        const workspace = (this.rootEl as any).getWorkspace();
        const sourceView = (this.rootEl as any).shadowRoot.querySelector('#root-view');
        this.elementsRegistry.set('workspace', workspace);
        this.elementsRegistry.set('source-view', sourceView);

        this.sourceEditor.onDidCodeChange((code) => {
            this.setCode(code);
        });
    }
    /**
     * TODO: Remove once the editor moved to a better element registry API
     * Ads an element to the old app-element-registry-behavior
     */
    registerLegacyElement(id : string, el : HTMLElement) {
        (this.rootEl as any)._registerElement(id, el);
    }
    getElement(id : string) {
        return this.elementsRegistry.get(id);
    }
    appendSourceEditor() {
        (this.rootEl as any).sourceContainer.appendChild(this.sourceEditor.domNode);
        (this.rootEl as any).$['root-view'] = this.sourceEditor.domNode;
    }
    ensureProviders() {
        this.output.ensureOutputView();
        if (!this.workspaceProvider) {
            this.registerWorkspaceViewProvider(new DefaultWorkspaceViewProvider(this));
        }
    }
    inject(element = document.body, before = null) {
        if (this.injected) {
            return;
        }
        this.ensureProviders();
        this.injected = true;
        if (before) {
            element.insertBefore(this.rootEl, before);
        } else {
            element.appendChild(this.rootEl);
        }
        this.appendSourceEditor();
        this.appendWorkspaceView();
        this.setupElements();
        this.output.onInject();
        if (this.workspaceProvider) {
            this.workspaceProvider.onInject();
        }
        this.parts.onInject();
        this.runPluginTask('onInject');
        this.telemetry.trackEvent({ name: 'ide_opened' });
        if (this._queuedApp) {
            this.load(this._queuedApp);
            this._queuedApp = null;
        }
        this._onDidInject.fire();
    }
    dispose() {
        if (this.injected) {
            (this.rootEl as any).parentNode.removeChild(this.rootEl);
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
    load(app : any) {
        const safeApp = transformLegacyApp(app, this);
        if (!this.injected) {
            this._queuedApp = safeApp;
            return;
        }
        this.parts.reset();
        this.runPluginTask('onImport', safeApp);
        this.output.runPluginTask('onImport', safeApp);
        this.parts.onImport(safeApp);
        this.sourceEditor.setSource(safeApp.source);
        this._onDidLoad.fire();
        this.telemetry.trackEvent({ name: 'app_imported' });
    }
    reset() {
        const source = this.workspaceProvider ? this.workspaceProvider.source : '';
        this.setCode();
        this.parts.reset();
        this.load({ source, parts: [] });
        this._onDidReset.fire();
    }
    setCode(content? : string) {
        this.output.setCode(content);
        (this.rootEl as any).code = content;
        this.unsavedChanges = true;
        this.output.restart();
    }
    restart() {
        this.output.restart();
    }
    restartApp() {
        this.restart();
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
        let app = {
            source: this.sourceEditor.getSource(),
            code: this.getCode(),
        };
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
        const fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (evt : any) => {
            const f = evt.target.files[0];
            if (f) {
                const r = new FileReader();
                r.onload = (e : any) => {
                    const app = JSON.parse(e.target.result);
                    this.load(app);
                };
                r.readAsText(f);
                document.body.removeChild(fileInput);
            }
        });
        document.body.appendChild(fileInput);
        fileInput.click();
    }
    createCreationPreview(externalOutput? : Output) {
        const output = externalOutput || this.output;
        if (!this.creationPreviewProvider) {
            throw new Error('Could not create creation preview: No CreationPreviewProvider was registered');
        }
        return this.creationPreviewProvider.createFile(output);
    }
    createCreationDisplay(blob : Blob) {
        if (!this.creationPreviewProvider) {
            throw new Error('Could not create creation display: No CreationPreviewProvider was registered');
        }
        return this.creationPreviewProvider.display(blob);
    }
    storeCreation(creationBundle : ICreationBundle) {
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
        (this.rootEl as any).share();
    }
    @deprecated('Use editor.sourceEditor.getSource() instead')
    getSource() {
        return this.sourceEditor.getSource();
    }
    getCode() {
        return this.output.getCode();
    }
    getViewport() {
        const ws = this.getWorkspace();
        return ws.getViewport();
    }
    getWorkspace() {
        return (this.rootEl as any).getWorkspace();
    }
    getBlocklyWorkspace() {
        return (this.rootEl as any).getBlocklyWorkspace();
    }
    registerProfile(profile : EditorProfile) {
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
    registerWorkspaceViewProvider(provider : WorkspaceViewProvider) {
        this.workspaceProvider = provider;
        this.workspaceProvider.onInstall(this);
    }
    appendWorkspaceView() {
        if (!this.workspaceProvider) {
            return;
        }
        (this.rootEl as any).$.workspace.appendView(this.workspaceProvider);
        this.workspaceProvider.setOutputView(this.output.outputView);
    }
    get workspaceView() {
        return this.workspaceProvider;
    }
    get root() {
        return this.rootEl.shadowRoot;
    }
    resolvePosition(result : IQueryResult) {
        return result.getHTMLElement().getBoundingClientRect();
    }
    addContentWidget(widget : IEditorWidget) {
        const domNode = widget.getDomNode();
        domNode.style.position = 'absolute';
        (this.rootEl as any).widgetLayer.appendChild(domNode);
        this.layoutContentWidget(widget);
    }
    layoutContentWidget(widget : IEditorWidget) {
        const position = widget.getPosition();
        if (position === null) {
            return;
        }
        const result = this.querySelector(position);
        const rect = this.resolvePosition(result);
        const domNode = widget.getDomNode();
        domNode.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    }
    removeContentWidget(widget : IEditorWidget) {
        (this.rootEl as any).widgetLayer.removeChild(widget.getDomNode());
    }
    querySelector(selector : string) {
        return this.queryEngine.query(selector);
    }
}

export default Editor;
