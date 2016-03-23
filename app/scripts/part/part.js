import slug from 'speakingurl';

export default class Part {

    set name (value) {
        let oldName = this.name,
            names = Part.nameRegistery[this.type],
            newName,
            index;
        if (!value) {
            this.uniqueName = value;
            return;
        }
        index = names.indexOf(oldName);
        if (index !== -1) {
            // Remove the old value from the registery
            names.splice(index, 1);
        }
        // Generate a unique name
        newName = this.getUniqueName(value);
        // Add it to the registery
        names.push(newName);
        this.uniqueName = newName;
        this.id = slug(this.uniqueName);
    }

    get name () {
        return this.uniqueName;
    }

    constructor (opts) {
        this.type = opts.type;
        Part.nameRegistery[this.type] = Part.nameRegistery[this.type] || [];
        this.id = opts.id;
        this.name = opts.name;
        this.label = opts.label;
        if (!this.name) {
            this.name = this.label;
        }
        this.description = opts.description;
        this.image = opts.image;
        this.colour = opts.colour;
        this.blocks = opts.blocks || [];
        this.events = opts.events || [];
        this.listeners = opts.listeners || [];
        this.codes = {};
        this.userStyle = opts.userStyle || {};
        this.userProperties = opts.userProperties || {};
    }
    getUniqueName (value, inc=0) {
        let newName = inc ? `${value} ${inc}` : value;
        if (Part.nameRegistery[this.type].indexOf(newName) !== -1) {
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
    addEventListener (name, callback) {
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
        plain.userStyle = this.userStyle;
        plain.userProperties = this.userProperties;
        plain.position = this.position;
        return plain;
    }
    load (plain) {
        this.id = plain.id;
        this.name = plain.name;
        this.userStyle = plain.userStyle;
        this.userProperties = plain.userProperties;
        this.position = plain.position;
    }
}

Part.nameRegistery = {};
