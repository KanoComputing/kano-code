import { LightShape } from './light-shape.js';

const LightRectangleImpl = {
    setWidth (w) {
        let x = this.getX();
            w = this.limitValue(this.model, 'width', w);
        this.set('model.userProperties.width', w);
        this._updateLightboard();
    },
    getWidth () {
        return parseInt(this.get('model.userProperties.width'));
    },
    setHeight (h) {
        h = this.limitValue(this.model, 'height', h);
        this.set('model.userProperties.height', h);
        this._updateLightboard();
    },
    getHeight () {
        return parseInt(this.get('model.userProperties.height'));
    },
    setColor (c) {
        c = c || '#ffffff';
        this.set('model.userProperties.color', c);
        this._updateLightboard();
    },
    getColor () {
        return this.get('model.userProperties.color');
    },
    _updateLightboard (force) {
        this.debounce('_updateLightboard', () => {
            if (this.isRunning) {
                let shape = {
                    id: this.model.id,
                    x: this.getX(),
                    y: this.getY(),
                    width: parseInt(this.model.userProperties.width),
                    height: parseInt(this.model.userProperties.height),
                    color: this.model.userProperties.color,
                    visible: this.model.visible,
                    type: 'rectangle',
                    force
                };
                this.fire('update-shape', shape);
            }
        });
    }
};

export const LightRectangle = Object.assign({}, LightShape, LightRectangleImpl);
