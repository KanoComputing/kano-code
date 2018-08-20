import '@polymer/polymer/polymer-legacy.js';
import { UIBehavior } from '../kano-ui-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { MotionSensor } from '../../../scripts/kano/make-apps/parts-api/motion-sensor.js';
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-motion-sensor',
    behaviors: [
        MotionSensor,
        UIBehavior
    ],
    observers: [
        '_reconfigure(model.userProperties.mode, model.userProperties.updateInterval)',
        '_onConnectedChange(model.connected)'
    ],
    _onConnectedChange (connected) {
        if (connected) {
            this.setMode(this.model.userProperties.mode);
        } else {
            this.set('model.lastProximityValue', 0);
        }
    },
    _reconfigure (mode, interval) {
        this.debounce('reconfigure', () => {
            if (mode !== this.lastMode) {
                this.lastMode = this.model.userProperties.mode;
                this.setMode(this.model.userProperties.mode);
            }

            if (interval !== this.lastUpdateInterval) {
                this.lastUpdateInterval = this.model.userProperties.updateInterval;
                this.setUpdateInterval(this.model.userProperties.updateInterval);
            }
        }, 250);
    }
});
