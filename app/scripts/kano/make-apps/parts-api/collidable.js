import { BaseMixin } from './base.js';

export const CollidableMixin = base => class extends BaseMixin(base) {
    onCreated() {
        this.model.collidable = true;
    }
    start(...args) {
        super.start(...args);
        this._updateCollisionSize();
    }
    /**
     * Native size is the actual width in pixels, fake for non web parts
     * */
    _getNativeSize() {
        return {
            width: 200,
            height: 200,
        };
    }
    _updateCollisionSize() {
        this.nativeSize = this._getNativeSize();
    }
    /**
     * Actual width, including the scale
     * */
    getCollidableWidth() {
        return this.nativeSize.width * (this.getSize() / 100);
    }
    /**
     * Actual height, including the scale
     * */
    getCollidableHeight() {
        return this.nativeSize.height * (this.getSize() / 100);
    }
    getCollidableX() {
        const offset = (this.getCollidableWidth() - this.nativeSize.width) / 2;
        return this.getX() - offset;
    }
    getCollidableY() {
        const offset = (this.getCollidableHeight() - this.nativeSize.height) / 2;
        return this.getY() - offset;
    }
    getCollidableRect() {
        return {
            x: this.getCollidableX(),
            y: this.getCollidableY(),
            width: this.getCollidableWidth(),
            height: this.getCollidableHeight(),
        };
    }
    collidesWith(target) {
        const thisRect = this.getCollidableRect();
        const targetRect = target.getCollidableRect();
        return thisRect.x < targetRect.x + targetRect.width &&
            thisRect.x + thisRect.width > targetRect.x &&
            thisRect.y < targetRect.y + targetRect.height &&
            thisRect.height + thisRect.y > targetRect.y;
    }
};

export default CollidableMixin;
