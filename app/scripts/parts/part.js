/* globals Blockly */
import slug from 'speakingurl';

export default class Part {

    set name (value) {
        let oldName = this.name,
            names = Part.nameRegistry[this.type],
            newName;
        if (!value) {
            this.uniqueName = value;
            return;
        }
        names[oldName] = false;
        // Generate a unique name
        newName = this.getUniqueName(value);
        // Add it to the registery
        names[newName] = true;
        this.uniqueName = newName;
        this.id = slug(this.uniqueName, '');
    }

    get name () {
        return this.uniqueName;
    }

    constructor (opts) {
        this.type = opts.type;
        Part.nameRegistry[this.type] = Part.nameRegistry[this.type] || {};
        this.id = opts.id;
        this.name = opts.name;
        this.label = opts.label;
        this.name = this.name || this.label;
        this.description = opts.description;
        opts.position = opts.position || { x: 0, y: 0 };
        this.position = {
            x: opts.position.x || 0,
            y: opts.position.y || 0
        };
        this.visible = true;
        this.image = opts.image;
        this.restrict = opts.restrict;
        this.colour = opts.colour;
        this.blocks = Array.isArray(opts.blocks) ? opts.blocks.slice(0) : [];
        this.legacyBlocks = Array.isArray(opts.legacyBlocks) ? opts.legacyBlocks.slice(0) : [];
        this.events = Array.isArray(opts.events) ? opts.events.slice(0) : [];
        this.listeners = Array.isArray(opts.listeners) ? opts.listeners.slice(0) : [];
        this.codes = {};
        this.userStyle = Object.assign({}, opts.userStyle);
        this.userProperties = Object.assign({}, opts.userProperties);
        this.nonvolatileProperties = Array.isArray(opts.nonvolatileProperties) ? opts.nonvolatileProperties : [];
        this.removable = typeof opts.removable === 'undefined' ? true : opts.removable;
    }
    getUniqueName (value, inc=0) {
        let newName = inc ? `${value} ${inc}` : value;
        if (Part.nameRegistry[this.type][newName]) {
            return this.getUniqueName(value, inc + 1);
        }
        return newName;
    }
    addBlock (block) {
        this.blocks.push(block);
    }
    addEvent (event) {
        this.events.push(event);
    }
    stop () {
        this.removeListeners();
    }
    start () {

    }
    addEventListener () {
        this.listeners.push(arguments);
    }
    removeListeners () {
        this.listeners = [];
    }
    toJSON () {
        let plain = {};
        plain.id = this.id;
        plain.name = this.name;
        plain.type = this.type;
        plain.tagName = this.tagName;
        plain.userStyle = this.userStyle;
        plain.userProperties = this.userProperties;
        plain.position = this.position;
        plain.partType = this.partType;
        plain.configPanel = this.configPanel;
        return plain;
    }
}

Part.nameRegistry = {};
Part.clear = () => {
    Part.nameRegistry = {};
};
