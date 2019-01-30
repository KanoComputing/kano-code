/**
 * Behavior common to all UI components
 * Adds the style object that can be used to give the user
 * customization features
 * @type {Object}
 */

const properties = {
    model: {
        type: Object,
        notify: true,
    },
    isRunning: {
        type: Boolean,
        value: false,
    },
    autoStart: {
        type: Boolean,
        value: false,
    },
};

const observers = [
    'applyTransform(model.position.*, model.rotation, model.scale, model.visible)',
];

const listeners = {
    down: 'onTap',
    up: 'clearMoveCursor',
};

// @polymerBehavior
export const UIBehavior = {
    properties,
    observers,
    listeners,
    onTap() {
        // Do not trigger `part-tapped` if no model is present i.e if this is a mode
        if (this.model) {
            this.fire('part-tapped', this);
        }
    },
    clearMoveCursor() {
        const htmlStyle = document.documentElement.style;

        /* Interact sets cursor globally and sometimes it fails to
           clear it up. This is an extra check to make sure it goes away
           every time properly. */
        if (htmlStyle.cursor === 'move') {
            htmlStyle.cursor = '';
        }
    },
    attached() {
        this.fire('ui-ready', this);
    },
    getPartialStyle(attrs) {
        if (!this.model) {
            return '';
        }
        attrs = attrs || Object.keys(this.model.userStyle);
        return attrs.reduce((acc, key) => {
            acc += this.model.userStyle && this.model.userStyle[key] ? `${key}:${this.model.userStyle[key]};` : '';
            return acc;
        }, '');
    },
    applyTransform() {
        if (!this.model) {
            return;
        }
        let position = this.model.position || { x: 0, y: 0 },
            rotation = this.model.rotation || 0,
            scale = isNaN(this.model.scale / 100) ? 1 : this.model.scale / 100,
            transform,
            visibility;
        transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale}, ${scale})`;
        visibility = this.model.visible ? 'visible' : 'hidden';
        this.style.webkitTransform = this.style.transform = transform;
        this.style.visibility = visibility;
    },
    prepareRendering(ctx) {
        let position = this.model.position || { x: 0, y: 0 },
            rotation = this.model.rotation || 0,
            rad = rotation * Math.PI / 180,
            cos = Math.cos(rad),
            sin = Math.sin(rad),
            scale = this.model.scale / 100 || 1,
            w = this.offsetWidth,
            h = this.offsetHeight;

        ctx.save();

        // Move to part position
        ctx.transform(1, 0, 0, 1, position.x, position.y);
        // Move to part center
        ctx.transform(1, 0, 0, 1, w / 2, h / 2);
        // Apply rotation
        ctx.transform(cos, sin, -sin, cos, 0, 0);
        // Apply scale
        ctx.transform(scale, 0, 0, scale, 0, 0);
        // Move back to top left of part
        ctx.transform(1, 0, 0, 1, -w / 2, -h / 2);
    },
    finishRendering(ctx) {
        ctx.restore();
    },
    renderOnCanvas(ctx) {
        if (!this.model || this.model.partType !== 'ui') {
            return Promise.resolve();
        }
        this.prepareRendering(ctx);

        return Promise.resolve();
    },
    renderFallback(ctx) {
        this.finishRendering(ctx);
        return Promise.resolve();
    },
    getConnectable(property) {
        let connectable = {
                node: this,
                property,
            },
            customizable;
        if (property.indexOf('model.userProperties') === 0) {
            for (let i = 0; i < this.model.customizable.properties.length; i++) {
                customizable = this.model.customizable.properties[i];
                if (customizable.key === property.replace('model.userProperties.', '')) {
                    connectable.bounds = {
                        min: customizable.min,
                        max: customizable.max,
                    };
                    break;
                }
            }
        }
        return connectable;
    },
};

export const UIMixin = base => class extends base {
    constructor() {
        super();
        Object.keys(listeners).forEach((event) => {
            this[listeners[event]] = this[listeners[event]].bind(this);
        });
    }
    static get properties() {
        return properties;
    }
    static get observers() {
        return observers;
    }
    onTap() {
        // Do not trigger `part-tapped` if no model is present i.e if this is a mode
        if (this.model) {
            this.dispatchEvent(new CustomEvent('part-tapped', { detail: this, bubbles: true }));
        }
    }
    clearMoveCursor() {
        const htmlStyle = document.documentElement.style;

        /* Interact sets cursor globally and sometimes it fails to
           clear it up. This is an extra check to make sure it goes away
           every time properly. */
        if (htmlStyle.cursor === 'move') {
            htmlStyle.cursor = '';
        }
    }
    connectedCallback() {
        super.connectedCallback();
        Object.keys(listeners).forEach((event) => {
            this.addEventListener(event, this[listeners[event]]);
        });
        this.dispatchEvent(new CustomEvent('ui-ready', { detail: this, bubbles: true }));
    }
    disconnectedCallback() {
        Object.keys(listeners).forEach((event) => {
            this.removeEventListener(event, this[listeners[event]]);
        });
    }
    getPartialStyle(attrs) {
        if (!this.model) {
            return '';
        }
        attrs = attrs || Object.keys(this.model.userStyle);
        return attrs.reduce((acc, key) => {
            acc += this.model.userStyle && this.model.userStyle[key] ? `${key}:${this.model.userStyle[key]};` : '';
            return acc;
        }, '');
    }
    applyTransform() {
        if (!this.model) {
            return;
        }
        let position = this.model.position || { x: 0, y: 0 },
            rotation = this.model.rotation || 0,
            scale = isNaN(this.model.scale / 100) ? 1 : this.model.scale / 100,
            transform,
            visibility;
        transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale}, ${scale})`;
        visibility = this.model.visible ? 'visible' : 'hidden';
        this.style.webkitTransform = this.style.transform = transform;
        this.style.visibility = visibility;
    }
    prepareRendering(ctx) {
        let position = this.model.position || { x: 0, y: 0 },
            rotation = this.model.rotation || 0,
            rad = rotation * Math.PI / 180,
            cos = Math.cos(rad),
            sin = Math.sin(rad),
            scale = this.model.scale / 100 || 1,
            w = this.offsetWidth,
            h = this.offsetHeight;

        ctx.save();

        // Move to part position
        ctx.transform(1, 0, 0, 1, position.x, position.y);
        // Move to part center
        ctx.transform(1, 0, 0, 1, w / 2, h / 2);
        // Apply rotation
        ctx.transform(cos, sin, -sin, cos, 0, 0);
        // Apply scale
        ctx.transform(scale, 0, 0, scale, 0, 0);
        // Move back to top left of part
        ctx.transform(1, 0, 0, 1, -w / 2, -h / 2);
    }
    finishRendering(ctx) {
        ctx.restore();
    }
    renderOnCanvas(ctx) {
        if (!this.model || this.model.partType !== 'ui') {
            return Promise.resolve();
        }
        this.prepareRendering(ctx);

        return Promise.resolve();
    }
    renderFallback(ctx) {
        this.finishRendering(ctx);
        return Promise.resolve();
    }
    getConnectable(property) {
        let connectable = {
                node: this,
                property,
            },
            customizable;
        if (property.indexOf('model.userProperties') === 0) {
            for (let i = 0; i < this.model.customizable.properties.length; i++) {
                customizable = this.model.customizable.properties[i];
                if (customizable.key === property.replace('model.userProperties.', '')) {
                    connectable.bounds = {
                        min: customizable.min,
                        max: customizable.max,
                    };
                    break;
                }
            }
        }
        return connectable;
    }
};

export default UIMixin;
