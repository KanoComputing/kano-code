import Part from '../part.js';

class Hardware extends Part {
    static get id() { return 'hardware'; }
    constructor(opts, ...args) {
        super(opts, ...args);
        this.partType = Hardware.id;
        // Allow the part to have a custom component instead of the icon only
        this.tagName = opts.component || 'kano-part-hardware';
        this.configPanel = opts.configPanel || 'kano-ui-editor';
        this.customizable = Object.assign({}, opts.customizable) || { style: [], properties: [] };
    }
}

export default Hardware;
