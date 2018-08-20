import '@polymer/polymer/polymer-legacy.js';
import '@polymer/neon-animation/web-animations.js';
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
    is: 'from-big-animation',
    behaviors: [
        NeonAnimationBehavior
    ],
    configure (config) {
        let node = config.node;

        this._effect = new KeyframeEffect(node, [
            {'transform': 'scale(3,3)', opacity: 0},
            {'transform': 'scale(1,1)', opacity: 1}
        ], this.timingFromConfig(config));

        if (config.transformOrigin) {
            this.setPrefixedProperty(node, 'transformOrigin', config.transformOrigin);
        }
        return this._effect;
    }
});
