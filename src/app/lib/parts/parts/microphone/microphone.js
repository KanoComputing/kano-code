import { BaseMixin } from '../../base.js';

export const MicrophoneMixin = base => class extends BaseMixin(base) {
    onCreated(...args) {
        super.onCreated(...args);
        this.reset();
        this._update();
    }
    _update() {
        if (this.isRunning) {
            this._executeThresholds();
        }

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(this._update.bind(this), 32);
    }
    _executeThresholds() {
        this.thresholds.forEach((threshold, index, self) => {
            if (this.volume > threshold.top) {
                if (threshold.over && !threshold.isOver) {
                    self[index].isOver = true;
                    threshold.cb.call({});
                } else if (!threshold.over && threshold.isUnder) {
                    self[index].isUnder = false;
                }
            } else if (this.volume < threshold.bottom) {
                if (threshold.over && threshold.isOver) {
                    self[index].isOver = false;
                } else if (!threshold.over && !threshold.isUnder) {
                    self[index].isUnder = true;
                    threshold.cb.call({});
                }
            }
        });
    }
    onDestroyed() {
        clearTimeout(this.timeoutId);
    }
    onVolumeThreshold(value, over, cb) {
        const threshold = {
            value: Math.max(0, Math.min(100, value)),
            over,
            cb,
        };
        threshold.top = Math.min(100 - 2.5, threshold.value + 2.5);
        threshold.bottom = Math.max(2.5, threshold.value - 2.5);
        this.thresholds.push(threshold);
    }
    reset() {
        this.thresholds = [];
    }
    get volume() {
        return this.appModules ? this.appModules.getModule('mic').getVolume() : 0;
    }
    get pitch() {
        return this.appModules ? this.appModules.getModule('mic').getPitch() : 0;
    }
};

export default MicrophoneMixin;

