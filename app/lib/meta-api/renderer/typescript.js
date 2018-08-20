class TypeScriptMetaRenderer {
    renderLegacyToolboxEntry(mod) {
        mod.def.register(window.Blockly);
        if (mod.def.defaults) {
            Object.keys(mod.def.defaults).forEach((blockId) => {
                this.defaults.define(blockId, mod.def.defaults[blockId]);
            });
        }
        if (!mod.def.category) {
            return null;
        }
        return this.defaults.createCategory(mod.def.category);
    }
    renderToolboxEntry(mod) {
        let definitionFile;
        // Legacy module signature
        if (mod.def.type && mod.def.type === 'blockly') {
            definitionFile = mod.def.typeScriptDefinition ? mod.def.typeScriptDefinition : '';
        } else {
            definitionFile = TypeScriptMetaRenderer.render(mod);
        }

        const category = {
            name: mod.getVerboseDisplay(),
            id: mod.def.name,
            colour: mod.getColor(),
            definitionFile,
        };

        return category;
    }
    static render(m) {
        switch (m.def.type) {
        case 'module': {
            return TypeScriptMetaRenderer.renderModule(m);
        }
        case 'variable': {
            return TypeScriptMetaRenderer.renderVariable(m);
        }
        case 'function': {
            return TypeScriptMetaRenderer.renderFunction(m);
        }
        default: {
            break;
        }
        }
        return null;
    }
    static renderModule(m) {
        return `
        declare namespace ${m.def.name} {
            ${m.symbols.map(sym => TypeScriptMetaRenderer.render(sym)).join('\n')}
        }
        `;
    }
    static renderVariable(m) {
        return `declare var ${m.def.name}: ${TypeScriptMetaRenderer.parseType(m.getReturnType())};`;
    }
    static renderParam(param) {
        return `${param.def.name}: ${TypeScriptMetaRenderer.parseType(param.getReturnType())}`;
    }
    static renderFunction(m) {
        return `declare function ${m.def.name}(${m.getParameters().map(param => TypeScriptMetaRenderer.renderParam(param)).join(', ')}): ${m.getReturnType()};`;
    }
    static parseType(type) {
        switch (type) {
        case Number: {
            return 'number';
        }
        default: {
            return type;
        }
        }
    }
}

export default TypeScriptMetaRenderer;
