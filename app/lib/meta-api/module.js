class Meta {
    constructor(def, parent) {
        this.parent = parent;
        this.def = def;
        this.build();
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
                return new MetaFunction(sym, this);
            }
            default: {
                break;
            }
            }
            return null;
        }).filter(v => v);
    }
    getNameChain(sep = '_', prev = '') {
        if (!this.parent) {
            return this.def.name;
        }
        return `${this.parent.getNameChain(sep, prev)}${sep}${this.def.name}`;
    }
    getColor() {
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
}

class MetaParameter extends Meta {
    getReturnType() {
        return this.def.returnType;
    }
}

class MetaVariable extends Meta {
    getReturnType() {
        return this.def.returnType;
    }
}

class MetaModule extends Meta {

}

class MetaFunction extends Meta {
    constructor(...args) {
        super(...args);
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
