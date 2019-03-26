import { Part, IPartContext } from '../../part.js';
import { part, property, component } from '../../decorators.js';
import { subscribeDOM, EventEmitter } from '@kano/common/index.js';
import { PartComponent } from '../../component.js';

class TouchComponent extends PartComponent {
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public touchStart : EventEmitter = new EventEmitter();
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public touchMove : EventEmitter = new EventEmitter();
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public touchEnd : EventEmitter = new EventEmitter();
}

@part('touch')
export class TouchPart extends Part {
    private _scale : number = 1;
    private _width : number = 0;
    private _height : number = 0;
    private _rect : DOMRect|null = null;
    private _dx : number = 0;
    private _dy : number = 0;
    private _ongoingTouches : {id: number, x: number, y: number, dx: number, dy: number}[] = [];
    private _lastMoveEvent : number|null = null;
    /**
     * Gets the array index of an on-going touch.
     *
     * @param id
     *   The identifier of the Touch object.
     */
    protected _findOngoingTouch(touch : Touch) {
        return this._ongoingTouches.findIndex(ongoingTouch => ongoingTouch.id === touch.identifier);
    }

    protected _addOngoingTouch(touch: Touch) {
        if (!this._rect) {
            return;
        }
        // Adjust the touch position by making the coordinates relative to the top left corner of the output
        // Also applies the scale
        const x = Math.max(0, Math.min(this._width, (touch.clientX - this._rect.left) * this._scale));
        const y = Math.max(0, Math.min(this._height, (touch.clientY - this._rect.top) * this._scale));

        // The value that will be stored
        const touchValue = { id: touch.identifier, x: x, y: y, dx: 0, dy: 0 };

        const existingIndex = this._findOngoingTouch(touch);
        // If a touch with this id already exists, update it.
        if (existingIndex >= 0) {
            // Calculate dx and dy
            touchValue.dx = touchValue.x - this._ongoingTouches[existingIndex].x;
            touchValue.dy = touchValue.y - this._ongoingTouches[existingIndex].y;
            this._ongoingTouches[existingIndex] = touchValue;
        }
        else {
            // Otherwise add it to the array.
            this._ongoingTouches.push(touchValue);
        }
    }

    protected _removeOngoingTouch(touch : Touch) {
        let touchIndex = this._findOngoingTouch(touch);
        if (touchIndex >= 0) {
            this._ongoingTouches.splice(touchIndex, 1);
        }
    }

    @component(TouchComponent)
    public core : TouchComponent;
    constructor() {
        super();
        this.core = this._components.get('core') as TouchComponent;
    }

    onInstall(context : IPartContext) {
        // Listen to the resize event ot update the rect and scale
        context.dom.onDidResize(() => {
            this.resize(context);
        });

        subscribeDOM(context.dom.root, 'touchstart', (e : TouchEvent) => {
            // Add new touches to the ongoing touches list.
            const touches = e.changedTouches;
            for (let touch of touches) {
                this._addOngoingTouch(touch);
            }
            this.core.touchStart.fire();
        }, this, this.subscriptions);

        subscribeDOM(context.dom.root, 'touchmove', (e : TouchEvent) => {
            e.preventDefault();

            const touches = e.changedTouches;
            for (let touch of touches) {
                this._addOngoingTouch(touch);
            }
            this.core.touchMove.fire();

        }, this, this.subscriptions);

        subscribeDOM(context.dom.root, 'touchend', (e : TouchEvent) => {
            // Remove all ended touches from ongoing touches list.
            const touches = e.changedTouches;
            for (let touch of touches) {
                this._removeOngoingTouch(touch);
            }
            // Fire touch end when no ongoing touches left.
            this.core.touchEnd.fire();
        }, this, this.subscriptions);


        subscribeDOM(context.dom.root, 'touchcancel', (e : TouchEvent) => {
            const touches = e.changedTouches;
            for (let touch of touches) {
                this._removeOngoingTouch(touch);
            }
            this.core.touchEnd.fire();
        }, this, this.subscriptions);
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
    }
    resize(context : IPartContext) {
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
        this._width = context.visuals.width;
        this._height = context.visuals.height;
        this._scale = context.visuals.width / this._rect.width;
    }
    onTouchStart(callback : () => void) {
        return this.core.touchStart.event(callback, null, this.userSubscriptions);
    }
    onTouchEnd(callback : () => void) {
        return this.core.touchEnd.event(callback, null, this.userSubscriptions);
    }
    onTouchMove(callback : () => void) {
        return this.core.touchMove.event(callback, null, this.userSubscriptions);
    }
    get firstDx() {
        if (this._ongoingTouches.length == 0) {
            return 0;
        }
        return this._ongoingTouches[0].dx;
    }
    get firstDy() {
        if (this._ongoingTouches.length == 0) {
            return 0;
        }
        return this._ongoingTouches[0].dy;
    }
    // Returns the first point's x
    get firstX() {
        return this._ongoingTouches.length ? this._ongoingTouches[0].x : null;
    }
    // Returns the first point's y
    get firstY() {
        return this._ongoingTouches.length ? this._ongoingTouches[0].y : null;
    }
    // Iterate through all points. Exposes x and y of each points through callback arguments
    forEach(cb : (x : number, y : number) => void) {
        this._ongoingTouches.forEach(({ x, y }) => cb(x, y));
    }
}