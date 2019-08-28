import AppModule from '../app-modules/app-module.js';
import Editor from '../editor/editor.js';
import { Field, Blockly, Block } from '@kano/kwc-blockly/blockly.js';

export interface ICategory {
    name : string,
    id : string,
    colour : string,
}

export interface IMetaRenderer {
    renderToolboxEntry(entry : MetaModule, whitelist : string[]|null) : ICategory|null;
    disposeToolboxEntry(entry : ICategory) : void;
}

export interface IMetaDefinition {
    id? : string;
    symbols? : IMetaDefinition[];
    name : string;
    type : 'module'|'variable'|'function'|'parameter'|'blockly';
    color? : string;
    verbose? : string;
    returnType? : any;
    typeScriptDefinition? : string;
    parameters? : IMetaDefinition[];
    default? : any;
    enum? : [string, string][];
    blockly? : {
        customField?(Blockly : Blockly, block : Block) : Field;
        field? : boolean;
        javascript?(Blockly : Blockly, block : Block, m : MetaFunction) : string|string[];
        toolbox? : boolean;
        aliases? : string[];
        scope? : Symbol;
        postProcess?(block : Block) : void;
        shadow?(def : any, root : Meta) : string;
        prefix? : string;
        idPrefix? : string;
    };
    toolbox? : boolean;
    getter? : boolean;
    setter? : boolean;
    disabled? : boolean;
}

export interface IAPIDefinition extends IMetaDefinition {
    onInstall?(editor : Editor, mod : AppModule) : void;
}

export interface IAPIFunctionDefition {
    (editor: Editor): IAPIDefinition;
    type: 'module',
}

export type IAPIJointDefinition = (IAPIDefinition | IAPIFunctionDefition)

export class Meta {
    public def : IMetaDefinition;
    public parent? : Meta;
    public symbols? : Meta[];
    constructor(def : IMetaDefinition, parent? : Meta) {
        this.parent = parent;
        this.def = def;
        this.build();
    }
    disable() {
        this.def.disabled = true;
    }
    build() {
        if (!this.def.symbols) {
            return;
        }
        this.symbols = this.def.symbols.map((sym) => {
            switch (sym.type) {
            case 'variable': {
                return new MetaVariable(sym, this);
            }
            case 'module': {
                return new MetaModule(sym, this);
            }
            case 'function': {
                return new MetaFunction(sym as IFunctionDefinition, this);
            }
            default: {
                break;
            }
            }
            return null;
        }).filter(v => v !== null) as Meta[];
    }
    getNameChain(sep = '_', prev = '') : string {
        if (!this.parent) {
            return this.def.name;
        }
        return `${this.parent.getNameChain(sep, prev)}${sep}${this.def.name}`;
    }
    getColor() : string {
        if (this.def.color) {
            return this.def.color;
        }
        if (this.parent) {
            return this.parent.getColor();
        }
        return '';
    }
    getVerboseDisplay() {
        if (typeof this.def.verbose === 'undefined') {
            return this.def.name;
        }
        return this.def.verbose;
    }
    getRoot() : Meta {
        if (!this.parent) {
            return this;
        }
        return this.parent.getRoot();
    }
}

export class MetaParameter extends Meta {
    getReturnType() {
        return this.def.returnType;
    }
}

export class MetaVariable extends Meta {
    getReturnType() {
        return this.def.returnType;
    }
}

export class MetaModule extends Meta {}

interface IParameters extends IMetaDefinition {

}

interface IFunctionDefinition extends IMetaDefinition {
    parameters : IParameters[];
}

export class MetaFunction extends Meta {
    public parameters : MetaParameter[];
    public def : IFunctionDefinition;
    constructor(def : IFunctionDefinition, parent? : Meta) {
        super(def, parent);
        this.def = def;
        this.parameters = (this.def.parameters || []).map(p => new MetaParameter(p, this));
    }
    getReturnType() {
        return this.def.returnType;
    }
    getParameters() {
        return this.parameters;
    }
}

export default MetaModule;
