import { CollidableMixin } from './collidable.js';

export const WebCollidableMixin = base => class extends CollidableMixin(base) {
    parseComputedSize(size) {
        return parseInt(size, 10);
    }
    /**
     * Gets the part size through computed style
     * */
    _getNativeSize() {
        const style = window.getComputedStyle(this);
        return {
            width: this.parseComputedSize(style.width),
            height: this.parseComputedSize(style.height),
        };
    }
};

export default WebCollidableMixin;
