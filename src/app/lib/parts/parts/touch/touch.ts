import { Part, IPartContext } from '../../part.js';
import { part } from '../../decorators.js';
import { subscribeDOM } from '@kano/common/index.js';

@part('touch')
export class TouchPart extends Part {
    private _scale : number = 1;
    private _rect : DOMRect|null = null;
    private _x : number = 0;
    private _y : number = 0;
    private _dx : number = 0;
    private _dy : number = 0;
    private _lastMoveEvent : number|null = null;
    onInstall(context : IPartContext) {
        // Listen to the resize event ot update the rect and scale
        context.dom.onDidResize(() => {
            this.resize(context);
        });
        subscribeDOM(context.dom.root, 'touchmove', (e : TouchEvent) => {
            const touches = e.changedTouches;
            // In case no resize event is triggered before the touch part is added
            if (!this._rect) {
                return;
            }
            // Adjust the cursor position by making the coordinates relative to the top left corner of the output
            // Also applies the scale
            const x = Math.max(0, Math.min(context.visuals.width, (touches[0].clientX - this._rect.left) * this._scale));
            const y = Math.max(0, Math.min(context.visuals.height, (touches[0].clientY - this._rect.top) * this._scale));

            // Record the current timestamp
            const now = Date.now();

            // When no event is received after 100ms, reset the touch speed
            if (this._lastMoveEvent === null || now - this._lastMoveEvent > 100) {
                this._dx = 0;
                this._dy = 0;
            } else {
                this._dx = x - this._x;
                this._dy = y - this._y;
            }

            this._x = x;
            this._y = y;

            // Update last event time
            this._lastMoveEvent = now;
        });
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
    }
    resize(context : IPartContext) {
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
        this._scale = context.visuals.width / this._rect.width;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get dx() {
        return this._dx;
    }
    get dy() {
        return this._dy;
    }
}