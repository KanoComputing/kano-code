import { Collidable } from './collidable.js';
import { Base } from './base.js';

const WebCollidableImpl = {
    parseComputedSize (size) {
        return parseInt(size, 10);
    },
    /**
     * Gets the part size through computed style
     **/
    _getNativeSize () {
        let style = window.getComputedStyle(this);
        return {
            width: this.parseComputedSize(style.width),
            height: this.parseComputedSize(style.height)
        };
    },
};

/**
 * @polymerBehavior
 */
export const WebCollidable = Base.applyMixins({}, Collidable, WebCollidableImpl);
