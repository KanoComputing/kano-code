import { Base } from './base.js';

const LightShapeImpl = {
    PIXEL_SIZE: 27,
    start () {
        Base.start.apply(this);
        this._updateLightboard(true);
    },
    move (x, y) {
        x *= this.PIXEL_SIZE;
        y *= this.PIXEL_SIZE;
        Base.move.call(this, x, y);
        this._updateLightboard();
    },
    setX (x) {
        x *= this.PIXEL_SIZE;
        Base.setX.call(this, x);
        this._updateLightboard();
    },
    setY (y) {
        y *= this.PIXEL_SIZE;
        Base.setY.call(this, y);
        this._updateLightboard();
    },
    getWidth () {
        return null;
    },
    getHeight () {
        return null;
    },
    getX () {
        let width = this.getWidth(),
            newPos = Math.max(0, Math.floor(Base.getX.apply(this) / this.PIXEL_SIZE));
        if (width) {
            newPos = Math.min(this.BOARD_WIDTH - width, newPos);
        }
        return newPos;
    },
    getY () {
        let height = this.getHeight(),
            newPos = Math.max(0, Math.floor(Base.getY.apply(this) / this.PIXEL_SIZE));
        if (height) {
            newPos = Math.min(this.BOARD_HEIGHT - height, newPos);
        }
        return newPos;
    },
    show (visibility) {
        this.set('model.visible', visibility);
        this._updateLightboard();
    },
    limitValue (model, key, value) {
        let config = this.findPropertyByKey(model, key);
        return Math.min(Math.max(config.min, value), config.max);
    },
    findPropertyByKey (model, key) {
        let properties = model.customizable.properties
        for (let i = 0; i < properties.length; i++) {
            if (properties[i].key === key) {
                return properties[i];
            }
        }
    },
    _updateLightboard() {}
};

export const LightShape = Object.assign({}, Base, LightShapeImpl);
