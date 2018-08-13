class Parts {
    constructor() {
        this.partTypes = {};
        this.list = [];
        this.nameRegistry = {};
    }
    define(part) {
        this.list.push(part);
    }
    defineType(id, PartClass) {
        this.partTypes[id] = PartClass;
    }
    create(model, size) {
        return new this.partTypes[model.partType](model, this, size);
    }
    clear() {
        this.nameRegistry = {};
    }
    freeId(name) {
        delete this.nameRegistry[name];
    }
    lockId(name) {
        this.nameRegistry[name] = true;
    }
    init() {}
    getUniqueName(value, inc = 1) {
        const newName = (inc >= 2) ? `${value} ${inc}` : value;
        if (this.nameRegistry[newName]) {
            return this.getUniqueName(value, inc + 1);
        }
        return newName;
    }
    // Legacy methods
    registerPart(part) {
        this.define(part);
    }
    registerPartType(name, partType) {
        this.defineType(name, partType);
    }
}

export default Parts;
