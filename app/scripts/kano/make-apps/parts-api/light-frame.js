import { LightShape } from './light-shape.js';

const LightFrameImpl = {
    _updateLightboard (force) {
        this.debounce('_updateLightboard', () => {
            if (this.isRunning) {
                let shape = this.getShape();
                shape.force = force;
                this.fire('update-shape', shape);
            }
        });
    },
    getShape () {
        return {
            id: this.model.id,
            x: this.getX(),
            y: this.getY(),
            width: this.model.userProperties.width,
            height: this.model.userProperties.height,
            visible: this.model.visible,
            bitmap: this.model.userProperties.bitmap,
            type: 'frame'
        };
    },
    getWidth () {
        return parseInt(this.get('model.userProperties.width'));
    },
    getHeight () {
        return parseInt(this.get('model.userProperties.height'));
    }
};
export const LightFrame = Object.assign({}, LightShape, LightFrameImpl);
