import filesets from '../service/filesets';
import Part from './part';

const STYLE_CONF = {
    'background-color': {
        key: 'background-color',
        type: 'color',
        label: 'Background color'
    },
    'color': {
        key: 'color',
        type: 'color',
        label: 'Color'
    },
    'width': {
        key: 'width',
        type: 'size',
        label: 'Width',
        boundTo: 'width'
    },
    'height': {
        key: 'height',
        type: 'size',
        label: 'Height',
        boundTo: 'height'
    },
    'background': {
        key: 'background',
        type: 'background',
        label: 'Background',
        boundTo: 'width',
        data: {
            files: filesets.load('background')
        }
    },
    'font-size': {
        key: 'font-size',
        type: 'font-size',
        label: 'Text size'
    },
    'font-weight': {
        key: 'font-weight',
        type: 'font-weight',
        label: 'Text weight'
    }
};

export default class UI extends Part {

    constructor (opts, size) {
        super(opts);
        this.customizable = Object.assign({}, opts.customizable) || { style: [], properties: [] };
        this.customizable.properties = this.customizable.properties || [];
        if (opts.customizable && opts.customizable.style) {
            this.customizable.style = opts.customizable.style.map((key) => {
                let style = STYLE_CONF[key];
                if (style.boundTo === 'width') {
                    style.max = size.width;
                } else if (style.boundTo === 'height') {
                    style.max = size.height;
                }
                return style;
            });
        }
        this.partType = 'ui';
        this.position = opts.position || {
            x: 0,
            y: 0
        };
        this.rotation = opts.rotation || 0;
        this.scale = opts.scale || 1;
        this.visible = opts.visible || true;
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        plain.customizable = {
            properties: this.customizable.properties,
            style: this.customizable.style.map(style => style.key)
        };
        plain.rotation = this.rotation;
        plain.scale = this.scale;
        plain.visible = this.visible;
        return plain;
    }
}
