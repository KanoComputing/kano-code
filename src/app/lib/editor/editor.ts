import { TelemetryClient } from '@kano/telemetry/index.js';
import Config from '../config.js';
import Toolbox from './toolbox.js';
import { Logger } from '../log/index.js';
import { DefaultWorkspaceViewProvider } from './workspace/default.js';
import { Dialogs } from './dialogs/index.js';
import { Keybindings } from './keybindings/index.js';
import '../../elements/kano-app-editor/kano-app-editor.js';
import { EditorOrPlayer } from './editor-or-player.js';
import { Output } from '../output/output.js';
import { ActivityBar } from './activity-bar.js';
import { WorkspaceToolbar } from './workspace/toolbar.js';
import { EditorPartsManager } from '../parts/editor.js';
import { transformLegacyApp } from '../legacy/loader.js';
import { SourceEditor, getSourceEditor } from '../source-editor/source-editor.js';
import { Plugin } from './plugin.js';
import EditorProfile, { DefaultEditorProfile } from './profile.js';
import { CreationCustomPreviewProvider } from '../preview/creation-preview-provider.js';
import { deprecated } from '../decorators.js';
import { WorkspaceViewProvider } from './workspace/index.js';
import { EventEmitter } from '@kano/common/index.js';
import { IEditorWidget } from './widget/widget.js';
import { QueryEngine, IQueryResult } from './selector/selector.js';
import { ContentWidgets } from './widget/content-widgets.js';
import { KanoAppEditor } from '../../elements/kano-app-editor/kano-app-editor.js';
import { FileUpload } from './file-upload.js';
import { defaultDropOverlayProvider } from './file-drop-provider.js';
import { extname } from '../util/path.js';
import './loader/kcode.js';
import { FileLoaders } from './loader/loader.js';
import { aliasTagHandlerFactory } from './selector/alias.js';
import { toDisposable } from '@kano/common/index.js';
import ToolbarEntry from '../../elements/kc-workspace-toolbar/entry.js';
import { registerUITagHandlers } from './selector/ui.js';

declare global {
    interface Window {
        Kano : {
            Code : any;
        },
    }
}

// window namespaces used for easy access to editors in development
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};

export interface IEditorOptions {
    sourceType? : string;
    mediaPath? : string;
    blockly? : any;
}

export interface ICreationBundle {}

/**
 * [[include:Editor.md]]
 * A full Kano Code Editor with customizable Workspace and Output
 */
export class Editor extends EditorOrPlayer {
    public config : any;
    /**
     * Logger for this instance. Can configure log level on a per Editor scope
     */
    public logger : Logger = new Logger();
    /**
     * The DOM root of the editor. An kano-app-editor custom element
     */
    public domNode : KanoAppEditor = document.createElement('kano-app-editor') as KanoAppEditor;
    /**
     * The type of source for this editor. Defines what type of source editor will be provided to the user
     */
    public sourceType : string = 'blockly';
    /**
     * The output being driven by this editor
     */
    public output : Output = new Output();
    /**
     * A TelemetryClient instance receiving every telemetry events from the editor. If you create a plugin, you can mount your own client
     */
    public telemetry : TelemetryClient = new TelemetryClient({ scope: 'kc-editor' });
    /**
     * The instance of the source editor
     */
    public sourceEditor : SourceEditor;
    /**
     * The toolbar in the workspace
     */
    public workspaceToolbar : WorkspaceToolbar = new WorkspaceToolbar();
    /**
     * Dialogs API for this editor
     */
    public dialogs : Dialogs = new Dialogs();
    /**
     * Controls ley bindings for the editor.
     */
    public keybindings : Keybindings = new Keybindings();
    /**
     * Handles the API definitions and generate the right toolbox for each source editor
     */
    public toolbox : Toolbox = new Toolbox();
    /**
     * The parts editor manager handles the creation of parts in the editor
     */
    public parts : EditorPartsManager;
    /**
     * The file upload plugin manages files droppped onto the editor
     */
    public fileUpload : FileUpload;
    /**
     * API for the editor's activity bar
     */
    public activityBar : ActivityBar = new ActivityBar();
    /**
     * Whether the editor is part of a DOM tree right now
     */
    public injected : boolean = false;
    private _mediaPath : string = '';
    private _queuedApp : string|null = null;
    /**
     * The provided Workspace, or a default one
     */
    public workspaceProvider? : WorkspaceViewProvider;
    /**
     * The provided Editor profile, or a default one
     */
    public profile? : EditorProfile;
    public creationPreviewProvider? : CreationCustomPreviewProvider;
    public queryEngine : QueryEngine = new QueryEngine();
    private selectorAliases : Map<string, string> = new Map();
    /**
     * Apis to control the content widgets displayed in the editor
     */
    public contentWidgets? : ContentWidgets;

    // Events
    private _onDidReset : EventEmitter = new EventEmitter();
    /**
     * Fired when the user resets the editor
     * @event
     */
    get onDidReset() { return this._onDidReset.event }

    private _onDidLoad : EventEmitter = new EventEmitter();
    /**
     * Fired after an app has beed loaded
     * @event
     */
    get onDidLoad() { return this._onDidLoad.event }

    private _onDidInject : EventEmitter = new EventEmitter();
    /**
     * Fired after the editor has been injected in a DOM tree
     * @event
     */
    get onDidInject() { return this._onDidInject.event }

    private _onDidLayoutChange : EventEmitter = new EventEmitter();
    /**
     * Fired when the internal layout of the editor changed
     * @event
     */
    get onDidLayoutChange() { return this._onDidLayoutChange.event }

    private _onWillPlaySound: EventEmitter<string> = new EventEmitter();
    /**
     * Fired when the an editor element requests a sound be played
     * @event
     */
    get onWillPlaySound() { return this._onWillPlaySound.event; };

    /**
     * Creates a new Editor. This editor can then be injected into any web page
     * @param opts Options for the editor
     */
    constructor(opts : IEditorOptions = {}) {
        super();
        this.config = Config.merge(opts);
        this.logger.setLevel(this.config.LOG_LEVEL);
        this.sourceType = opts.sourceType || 'blockly';
        this._setupMediaPath(opts.mediaPath);

        const SourceEditorClass = getSourceEditor(this.sourceType);

        if (!SourceEditorClass) {
            throw new Error(`Could not create Editor: Source editor '${this.sourceType}' was not registered. Make sure your import an editor from @kano/code/source-editor`);
        }

        this.sourceEditor = new SourceEditorClass(this);
        this.sourceEditor.onDidCodeChange((code) => {
            this.setCode(code);
        });
        this.sourceEditor.onDidLayout(() => this._onDidLayoutChange.fire());
        this.sourceEditor.registerQueryHandlers(this.queryEngine);
        
        this.dialogs.onDidLayout(() => this._onDidLayoutChange.fire());

        this.queryEngine.registerTagHandler('alias', aliasTagHandlerFactory(this.queryEngine, this.selectorAliases));
        this.registerTagHandlers();

        this.addPlugin(this.workspaceToolbar);
        this.addPlugin(this.dialogs);
        this.addPlugin(this.keybindings);
        this.addPlugin(this.toolbox);
        this.addPlugin(this.activityBar);


        this.fileUpload = new FileUpload(this.domNode, defaultDropOverlayProvider);

        this.fileUpload.onDidUpload((f) => {
            const extension = extname(f.file.name);
            if (!extension) {
                return;
            }
            const loader = FileLoaders.get(extension);
            if (!loader) {
                this.logger.warn(`Could not load file '${f.file.name}': Not file loader exists for extension '${extension}'`);
                return;
            }
            loader.load(this, f.content.toString());
        });

        this.addPlugin(this.fileUpload);

        this.toolbox.registerQueryHandlers(this.queryEngine);

        this.parts = new EditorPartsManager(this);
        this.parts.registerQueryHandlers(this.queryEngine);
        this.parts.onDidOpenAddParts(() => {
            this.playUISound('computer_toggle');
        });
        this.parts.onDidAddPart(() => {
            this.playUISound('pop');
        });
        window.Kano.Code.mainEditor = this;
    }
    private _setupMediaPath(path = '/node_modules/@kano/code') {
        this._mediaPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    }
    /**
     * Returns the absolute path to the provided relative resource
     * @param path A path relative to the media directory
     */
    asAbsoluteMediaPath(path = '') {
        const normalized = path.replace(/^(\.\/|\.\.\/|\/)/, '');
        return `${this._mediaPath}/${normalized}`;
    }
    /**
     * Adds a plugin to this editor, plugins have access to lifecycle steps and
     * customization APIs to tailor the coding experience to your needs
     * @param plugin The plugin to add
     */
    addPlugin(plugin : Plugin) {
        super.addPlugin(plugin);
        plugin.onInstall(this);
        if (this.injected) {
            plugin.onInject();
        }
    }
    setInputDisabled(isInputDisabled : boolean) {
        if (isInputDisabled) {
            this.domNode.setAttribute('disabled', '');
        }
        else {
            this.domNode.removeAttribute('disabled');
        }
    }
    protected appendSourceEditor() {
        if (this.domNode) {
            this.sourceEditor.domNode.setAttribute('slot', 'source-editor');
            this.sourceEditor.domNode.style.flex = '1';
            this.domNode.appendChild(this.sourceEditor.domNode);
        }
    }
    protected ensureProfile() {
        if (!this.profile) {
            this.registerProfile(new DefaultEditorProfile());
        }
    }
    /**
     * Injectes the editor into a host element
     * @param element The host element to inject the editor into
     * @param before Another element before which the editor should be injected
     */
    inject(element = document.body, before? : HTMLElement) {
        if (this.injected) {
            return;
        }
        this.injected = true;
        this.ensureProfile();
        if (before) {
            element.insertBefore(this.domNode, before);
        } else {
            element.appendChild(this.domNode);
        }
        // Force a synchronous component update. No performance implications as it is about to render anyway
        // Makes inject a synchronous method. Way easier to handle injection 
        (this.domNode as any).update();
        this.appendSourceEditor();
        this.appendWorkspaceView();
        this.output.onInject();
        if (this.workspaceProvider) {
            this.workspaceProvider.onInject();
        }
        this.parts.onInject();
        this.contentWidgets = new ContentWidgets(this, (this.domNode as any).widgetLayer);
        this.runPluginTask('onInject');
        this.telemetry.trackEvent({ name: 'ide_opened' });
        if (this._queuedApp) {
            this.load(this._queuedApp);
            this._queuedApp = null;
        } else {
            this.reset(false);
        }
        this._onDidInject.fire();
    }
    /**
     * Gets rid of this editor. Free any allocated resources and remove the editor from the DOM if it was injected
     */
    dispose() {
        if (this.injected) {
            (this.domNode as any).parentNode.removeChild(this.domNode);
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
        this.dialogs.dispose();
    }
    /**
     * Load a previously saved app
     * @param app A JSON object representation of an app
     */
    load(app : any) {
        const replacedApp = this.replaceSource(app);
        const safeApp = transformLegacyApp(replacedApp, this.output);
        if (!this.injected) {
            this._queuedApp = safeApp;
            return;
        }
        this.setCode();
        this.parts.reset();
        this.runPluginTask('onImport', safeApp);
        this.output.runPluginTask('onImport', safeApp);
        this.parts.onImport(safeApp);
        this.sourceEditor.setSource(safeApp.source);
        this._onDidLoad.fire();
        this.telemetry.trackEvent({ name: 'app_imported' });
    }
    /**
     * Resets the editor. Removes every part, reset the source to the default source
     * @param trigger Fire the reset event or not. Useful when we want to reset just before a load without triggering the onDidReset event
     */
    reset(trigger : boolean = true) {
        const source = this.workspaceProvider ? this.workspaceProvider.source : '';
        this.setCode();
        this.parts.reset();
        this.load({ source, parts: [] });
        if (trigger) {
            this._onDidReset.fire();
        }
    }
    /**
     * Update the generated code and restart the output
     * @param content the generated code
     */
    setCode(content? : string) {
        this.output.setCode(content);
        this.domNode.code = content;
        this.output.restart();
    }
    /**
     * Restarts the app
     */
    restart() {
        this.output.restart();
    }
    /**
     * Generate a creation from the curretn app
     */
    exportCreation() {
        let data = this.export();
        this.plugins.forEach((plugin) => {
            data = plugin.onCreationExport(data);
        });
        data = this.output.onCreationExport(data);
        return data;
    }
    /**
     * Generate a JSON object representation of the current app
     */
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
    /**
     * Downloads a .kcode file with the exported app
     */
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
    /**
     * Prompts the user to load a .kcode from its disk and loads it
     */
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
    save() {
        return this.export();
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
        return (this.domNode as any).getWorkspace();
    }
    getBlocklyWorkspace() {
        return (this.domNode as any).getBlocklyWorkspace();
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
        const workspaceViewProvider = this.profile.workspaceViewProvider || new DefaultWorkspaceViewProvider();
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
    }
    registerWorkspaceViewProvider(provider : WorkspaceViewProvider) {
        this.workspaceProvider = provider;
        this.workspaceProvider.onInstall(this);
    }
    appendWorkspaceView() {
        if (!this.workspaceProvider) {
            return;
        }
        this.domNode.workspaceEl!.appendChild(this.workspaceProvider.root);
        this.workspaceProvider.setOutputView(this.output.outputView);
    }
    get workspaceView() {
        return this.workspaceProvider;
    }
    get root() {
        return this.domNode.shadowRoot;
    }
    resolvePosition(result : IQueryResult) {
        return result.getHTMLElement().getBoundingClientRect();
    }
    /**
     * Adds a widget to the editor.
     * [[include:addContentWidget.md]]
     * @param widget An editor widget
     */
    addContentWidget(widget : IEditorWidget) {
        if (!this.contentWidgets) {
            throw new Error('Could not use content widgets: Editor was not injected');
        }
        this.contentWidgets.addWidget(widget);
    }
    /**
     * Update the position of a previously added widget
     * @param widget An editor widget
     */
    layoutContentWidget(widget : IEditorWidget) {
        if (!this.contentWidgets) {
            throw new Error('Could not use content widgets: Editor was not injected');
        }
        this.contentWidgets.layoutWidget(widget);
    }
    /**
     * Removes a previously added widget
     * @param widget An editor widget
     */
    removeContentWidget(widget : IEditorWidget) {
        if (!this.contentWidgets) {
            throw new Error('Could not use content widgets: Editor was not injected');
        }
        this.contentWidgets.removeWidget(widget);
    }
    /**
     * Uses the [[QueryEngine]] to query for an element using that selector and returns the matching HTMLElement
     * @param selector An element selector
     */
    queryElement(selector : string) {
        const result = this.querySelector(selector);
        if (!result) {
            return null;
        }
        return result.getHTMLElement();
    }
    /**
     * Uses the [[QueryEngine]] to query for an element using that selector and returns the matching x, y position
     * @param selector An element selector
     */
    queryPosition(selector : string) {
        // Retrieve the result using the usual querying system
        const root = this.queryEngine.parse(selector);
        const result = this.queryEngine.resolve(root);
        if (!result) {
            return null;
        }

        // A position is provided, use it
        if (typeof result.getPosition === 'function') {
            const position = result.getPosition();
            return { x: position.x, y: position.y, isBlock: true }
        }
        // Otherwise, generate the position using the DOMRect and alignment
        const rect = result.getHTMLElement().getBoundingClientRect();
        let x = rect.left;
        let y = rect.top;
        if (root.position) {
            x += rect.width * (root.position.x || 0) / 100;
            y += rect.height * (root.position.y || 0) / 100;
        }
        return { x, y, isBlock : (typeof result.getBlock === 'function') };
    }
    /**
     * Uses the [[QueryEngine]] to query for an element using that selector and returns the result
     * @param selector An element selector
     */
    querySelector(selector : string) {
        return this.queryEngine.query(selector);
    }
    /**
     * Adds a method to the editor for develpoment convenience
     */
    exposeMethod(name : string, method : Function) {
        (this as any)[name] = method;
    }
    registerAlias(alias : string, target : string) {
        this.selectorAliases.set(alias, target);
        return toDisposable(() => {
            this.selectorAliases.delete(alias);
        });
    }
    playUISound(name : string) {
        this._onWillPlaySound.fire(name);
    }
    private registerTagHandlers() {
        registerUITagHandlers(this);
    }
}

export default Editor;
