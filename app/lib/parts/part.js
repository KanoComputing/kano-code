import getSlug from '../vendor/speakingurl.js';

export class Part {
    set name(value) {
        const oldName = this.name;
        if (!value) {
            this.uniqueName = value;
            return;
        }
        this.manager.freeId(oldName);
        // Generate a unique name
        const newName = this.manager.getUniqueName(value);
        // Add it to the registery
        this.manager.lockId(newName);
        this.uniqueName = newName;
        this.id = this.id || getSlug(this.uniqueName, '');
    }

    get name() {
        return this.uniqueName;
    }

    constructor(opts, manager) {
        this.manager = manager;
        this.type = opts.type;
        this.id = opts.id;
        this.name = opts.name;
        this.label = opts.label;
        this.name = this.name || this.label;
        this.description = opts.description;
        opts.position = opts.position || { x: 0, y: 0 };
        this.position = {
            x: opts.position.x || 0,
            y: opts.position.y || 0,
        };
        this.visible = true;
        this.image = opts.image;
        this.restrict = opts.restrict;
        this.colour = opts.colour;
        this.defaults = opts.defaults || {};
        this.blocks = Array.isArray(opts.blocks) ? opts.blocks.slice(0) : [];
        this.symbols = Array.isArray(opts.symbols) ? opts.symbols.slice(0) : null;
        this.legacyBlocks = Array.isArray(opts.legacyBlocks) ? opts.legacyBlocks.slice(0) : [];
        this.events = Array.isArray(opts.events) ? opts.events.slice(0) : [];
        this.listeners = Array.isArray(opts.listeners) ? opts.listeners.slice(0) : [];
        this.codes = {};
        this.userStyle = Object.assign({}, opts.userStyle);
        this.userProperties = Object.assign({}, opts.userProperties);
        this.nonvolatileProperties = Array.isArray(opts.nonvolatileProperties)
            ? opts.nonvolatileProperties : [];
        this.removable = typeof opts.removable === 'undefined' ? true : opts.removable;
        this.supportedHardware = opts.supportedHardware || [];
        this.fullscreenEdit = opts.fullscreenEdit || false;
        // Define whether a part can be added more than once in an app
        this.singleton = opts.singleton || false;
        this.config = opts.config || {};
    }
    addBlock(block) {
        this.blocks.push(block);
    }
    addEvent(event) {
        this.events.push(event);
    }
    stop() {
        this.removeListeners();
    }
    start() {}
    addEventListener(...args) {
        this.listeners.push(args);
    }
    removeListeners() {
        this.listeners = [];
    }
    toJSON() {
        const plain = {};
        plain.id = this.id;
        plain.name = this.name;
        plain.type = this.type;
        plain.tagName = this.tagName;
        plain.userStyle = this.userStyle;
        plain.userProperties = this.userProperties;
        plain.nonvolatileProperties = this.nonvolatileProperties;
        plain.position = this.position;
        plain.partType = this.partType;
        plain.supportedHardware = this.supportedHardware;
        return plain;
    }
    _getAPI() {
        return {
            type: 'module',
            name: this.id,
            verbose: this.name,
            color: this.color,
            symbols: [],
        };
    }
    get api() {
        return this._getAPI();
    }
}

export default Part;
