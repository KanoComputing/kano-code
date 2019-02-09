import { Meta, MetaModule, MetaVariable, MetaParameter, MetaFunction, IMetaRenderer } from '../module.js';

class TypeScriptMetaRenderer implements IMetaRenderer {
    renderToolboxEntry(mod : MetaModule, whitelist : any[]) {
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
    static render(m : Meta) : string|null {
        switch (m.def.type) {
        case 'module': {
            return TypeScriptMetaRenderer.renderModule(m as MetaModule);
        }
        case 'variable': {
            return TypeScriptMetaRenderer.renderVariable(m as MetaVariable);
        }
        case 'function': {
            return TypeScriptMetaRenderer.renderFunction(m as MetaFunction);
        }
        default: {
            break;
        }
        }
        return null;
    }
    static renderModule(m : MetaModule) : string {
        if (!m.symbols) {
            return '';
        }
        return `
        declare namespace ${m.def.name} {
            ${m.symbols.map(sym => TypeScriptMetaRenderer.render(sym)).join('\n')}
        }
        `;
    }
    static renderVariable(m : MetaVariable) : string {
        return `declare var ${m.def.name}: ${TypeScriptMetaRenderer.parseType(m.getReturnType())};`;
    }
    static renderParam(param : MetaParameter) : string {
        return `${param.def.name}: ${TypeScriptMetaRenderer.parseType(param.getReturnType())}`;
    }
    static renderFunction(m : MetaFunction) {
        return `declare function ${m.def.name}(${m.getParameters().map(param => TypeScriptMetaRenderer.renderParam(param)).join(', ')}): ${m.getReturnType()};`;
    }
    static parseType(type : any) {
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
