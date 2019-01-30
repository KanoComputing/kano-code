import { LightShape } from './light-shape.js';

const LightAnimationImpl = {
    _updateLightboard (force) {
        if (!this.frame) {
            return;
        }
        this.debounce('_updateLightboard', () => {
            if (this.isRunning) {
                let shape = {
                    id: this.model.id,
                    x: this.getX(),
                    y: this.getY(),
                    width: this.model.userProperties.width,
                    height: this.model.userProperties.height,
                    visible: this.model.visible,
                    bitmap: this.frame,
                    type: 'frame',
                    force
                };
                this.fire('update-shape', shape);
            }
        });
    },
    _updateFrame (loop) {
        const bitmaps = this.model.userProperties.bitmaps;
        this.frame = bitmaps[this.frameIndex];
        this._updateLightboard();

        this.timeoutId = setTimeout(() => {
            this.frameIndex++;
            if (this.frameIndex === bitmaps.length) {
                this.frameIndex = 0;

                if (!loop) {
                    clearTimeout(this.timeoutId);
                    return;
                }
            }
            this._updateFrame(loop);
        }, 1000 / this.model.userProperties.speed);
    },
    play () {
        this.pause();
        this._updateFrame(true);
    },
    playOnce () {
        this.pause();
        this._updateFrame();
    },
    pause () {
        clearTimeout(this.timeoutId);
    },
    setSpeed (s) {
        let speed = Math.min(30, Math.max(1, s));
        this.set('model.userProperties.speed', speed);
    },
    stop () {
        LightShape.stop.call(this);
        this.pause();
    },
    start () {
        LightShape.start.call(this);
        this.frameIndex = 0;
    },
    goToFrame (frame) {
        let bitmaps = this.model.userProperties.bitmaps;
        this.frameIndex = Math.min(bitmaps.length - 1, Math.max(0, frame - 1));
        this.frame = bitmaps[this.frameIndex];
        this._updateLightboard();
    },
    getWidth () {
        return parseInt(this.get('model.userProperties.width'));
    },
    getHeight () {
        return parseInt(this.get('model.userProperties.height'));
    },
    getFrameCount () {
        return this.model.userProperties.bitmaps.length;
    },
    getCurrentFrame () {
        return (this.frameIndex + 1);
    }
};
export const LightAnimation = Object.assign({}, LightShape, LightAnimationImpl);
