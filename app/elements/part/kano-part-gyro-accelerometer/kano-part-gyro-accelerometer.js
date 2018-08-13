import '@polymer/polymer/polymer-legacy.js';
import { UIBehavior } from '../kano-ui-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { GyroAccelerometer } from '../../../scripts/kano/make-apps/parts-api/gyro-accelerometer.js';

Polymer({
    is: 'kano-part-gyro-accelerometer',
    behaviors: [
        GyroAccelerometer,
        UIBehavior
    ],
    properties: {
        lastGyroVector: {
            type: Object,
            value: {x: 0.0, y: 0.0, z: 0.0}
        },
        lastAccelVector: {
            type: Object,
            value: {x: 0.0, y: 0.0, z: 0.0}
        }
    },
    getAngle (vec) {
        let ref = {x: 1, y: 0},
            dot = (ref.x * vec.x + ref.y * vec.y),
            det = (ref.x * vec.y + ref.y * vec.x),
            angleRad = Math.atan2(det, dot);

        if (isNaN(angleRad)) {
            return 0;
        } else {
            return angleRad * 180 / Math.PI;
        }
    }
});
