
class AppModules {
    constructor(output) {
        this.output = output;
        this.modules = {};
    }
    get componentStyles() {
        return `
            :host {
                position: relative;
            }
            kano-ui-viewport {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
            }
            kano-ui-viewport * {
                position: absolute;
            }
            .workspace {
                width: 100%;
                height: 100%;
            }
        `;
    }

    define(name, ModuleClass) {
        this.modules[name] = new ModuleClass(this.output);
        if (ModuleClass.aliases) {
            ModuleClass.aliases.forEach((alias) => {
                this.modules[alias] = this.modules[name];
            });
        }
    }

    config(config) {
        Object.keys(this.modules).forEach((name) => {
            if (this.modules[name] && this.modules[name].config && typeof this.modules[name].config === 'function') {
                this.modules[name].config(config);
            }
        });
    }

    /**
     * Support legacy API
     */
    init(...args) {
        this.config(...args);
    }

    getModule(name) {
        if (this.modules[name]) {
            return this.modules[name].methods;
        }
        return {};
    }

    createAppCode(prefix, code) {
        const moduleImports = Object.keys(this.modules).reduce((acc, name) => {
            const symbols = this.modules[name].getSymbols();
            acc += `var ${name} = ${prefix}.getModule('${name}');\n`;
            acc += symbols.map(s => `var ${s} = ${prefix}.getModule('${name}').${s};\n`).join('');
            return acc;
        }, '');
        return `(function () {\n${moduleImports}\n${code}\n})();\n`;
    }

    generateStandaloneComponent(componentName, parts, background, mode, codes) {
        let template = [];
        // TODO: find a better way to avoid having this script tag swallowed by crisper
        const scriptTagName = 'script';
        let tagName;
        let components;
        const code = this.createAppCode('this.runner', codes);
        let component;
        let partsString;

        parts = parts || [];

        components = parts.reduce((acc, part) => {
            tagName = part.tagName || `kano-ui-${part.type}`;
            acc[part.id] = part.toJSON();
            template.push(`<${tagName} id="${part.id}" slot="part" model="{{parts.${part.id}}}"></${tagName}>`);
            return acc;
        }, {});
        partsString = JSON.stringify(components);

        template = template.join('\n');
        if (background && background.userStyle) {
            background = background.userStyle.background;
        }
        // ensure 'background' css property will not carry double quotes
        background = background ? background.replace(/"/ig, '\"') : null;

        component = `
            <dom-module id="kano-${componentName}">
                <template>
                    <style>
                        ${this.componentStyles}
                    </style>
                    <kano-ui-viewport mode="scaled"
                                view-width="${mode.workspace.viewport.width}"
                                view-height="${mode.workspace.viewport.height}"
                                no-overflow>
                        <${mode.workspace.component} id="${mode.id}" class="workspace" width="${mode.workspace.viewport.width}" height="${mode.workspace.viewport.height}">
                            ${template}
                        </${mode.workspace.component}>
                    </kano-ui-viewport>
                </template>
                <${scriptTagName}>
                    (() => {
                        if (customElements.get('kano-${componentName}')) {
                            return;
                        }
                        class KanoShare extends Polymer.Element {
                            static get is() { return 'kano-${componentName}'; }
                            static get properties() {
                                return {
                                    parts: {
                                        type: Object,
                                        value: ${partsString}
                                    }
                                };
                            }
                            connectedCallback() {
                                super.connectedCallback();
                                const config = Object.assign({}, Kano.MakeApps.config);
                                config.restartCodeHandler = () => {
                                    this.dispatchEvent(new CustomEvent('restart-code'));
                                };
                                this.runner = new Kano.Code.ShareRunner(config);
                                this.runner.setParts(this.$);
                                this.runner.init();
                                this.workspace = this.$['${mode.id}'];

                                if (this.workspace.setBackground) {
                                    this.workspace.setBackground("${background}");
                                }

                                setTimeout(() => {
                                    this.start();
                                });
                            }
                            disconnectedCallback() {
                                super.disconnectedCallback();
                                this.runner.destroy();
                            }
                            start() {
                                ${code}

                                this.runner.start();
                            }
                            stop() {
                                this.runner.stop();
                            }
                        }
                        customElements.define(KanoShare.is, KanoShare);
                    })();
                </${scriptTagName}>
            </dom-module>
        `;

        return component;
    }

    loadParts(parts) {
        // Give a reference to the app modules to every part
        Object.keys(parts).forEach((id) => {
            parts[id].appModules = this;
        });
        if (!this.modules.parts) {
            return;
        }
        this.modules.parts.loadParts(parts);
    }

    _runModuleLifecycleStep(name) {
        Object.keys(this.modules).forEach((key) => {
            if (typeof this.modules[key].executeLifecycleStep === 'function') {
                this.modules[key].executeLifecycleStep(name);
            }
        });
    }

    start() {
        if (this.state === 'running') {
            return;
        }
        this._runModuleLifecycleStep('start');
        this.state = 'running';
    }

    stop() {
        if (this.state === 'running') {
            this._runModuleLifecycleStep('stop');
            this.state = 'stopped';
        }
    }

    afterRun() {
        this._runModuleLifecycleStep('afterRun');
    }

    addModule(id, m) {
        this.modules[id] = m;
    }

    static addModule() {
        return this.default.addModule.apply(this.default, arguments);
    }

    static enablePreviousVersionsSupport() {
        Kano.MakeApps = Kano.MakeApps || {};
        Kano.MakeApps.Modules = AppModules.default.modules;
        window.KanoModules = AppModules.default.modules;
        KanoModules.init = { methods: {} };
    }

    static config() {
        return this.default.config.apply(this.default, arguments);
    }

    static init() {
        return this.default.init.apply(this.default, arguments);
    }

    static start() {
        return this.default.start.apply(this.default, arguments);
    }

    static stop() {
        return this.default.stop.apply(this.default, arguments);
    }

    static loadParts() {
        return this.default.loadParts.apply(this.default, arguments);
    }

    static getModule() {
        return this.default.getModule.apply(this.default, arguments);
    }

    static generateStandaloneComponent() {
        return this.default.generateStandaloneComponent.apply(this.default, arguments);
    }

    static createAppCode() {
        return this.default.createAppCode.apply(this.default, arguments);
    }

    static get modules() {
        return this.default.modules;
    }

    static define(...args) {
        this.default.define(...args);
    }

    static createStandalone() {
        const appModules = new AppModules();
        // Get all the default modules and instantiate+add each one in the standalone
        // AppModules
        Object.keys(AppModules.modules).forEach((key) => {
            appModules.addModule(key, new AppModules.modules[key].constructor());
        });
        return appModules;
    }
}

AppModules.default = new AppModules();

export default AppModules;
