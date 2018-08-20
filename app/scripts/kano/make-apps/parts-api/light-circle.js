import { LightShape } from './light-shape.js';

const LightCircleImpl = {
    _updateLightboard (force) {
        this.debounce('_updateLightboard', () => {
            if (this.isRunning) {
                let shape = {
                    id: this.model.id,
                    x: this.getX(),
                    y: this.getY(),
                    radius: this.getRadius(),
                    color: this.getColor(),
                    visible: this.model.visible,
                    type: 'circle',
                    force
                };
                this.fire('update-shape', shape);
            }
        });
    },
    setRadius (r) {
        this.model.userProperties.radius = r;
        this._updateLightboard();
    },
    getRadius () {
        return parseInt(this.get('model.userProperties.radius'));
    },
    setColor (c) {
        c = c || '#ffffff';
        this.set('model.userProperties.color', c);
        this._updateLightboard();
    },
    getColor () {
        return this.get('model.userProperties.color');
    },
    getWidth () {
        return parseInt(this.get('model.userProperties.radius')) * 2;
    },
    getHeight () {
        return parseInt(this.get('model.userProperties.radius')) * 2;
    },
    getX () {
        let newPos = Math.max(0, Math.floor(PartsAPI.Base.getX.apply(this) / this.PIXEL_SIZE));
            newPos = Math.min(this.BOARD_WIDTH + this.getWidth(), newPos);
        return newPos;
    },
    getY () {
        let newPos = Math.max(0, Math.floor(PartsAPI.Base.getY.apply(this) / this.PIXEL_SIZE));
            newPos = Math.min(this.BOARD_HEIGHT + this.getHeight(), newPos);
        return newPos;
    }
};

export const LightCircle = Object.assign({}, LightShape, LightCircleImpl);
