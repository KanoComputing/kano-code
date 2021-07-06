import { subscribeDOM, IDisposable } from '@kano/common/index.js';
import { IPartContext } from '../../part.js';
import { part, component } from '../../decorators.js';
import { DOMPart } from '../dom/dom.js';
import { JoystickComponent} from './joystick-component.js';
import { JoystickAxis } from './enums.js';

// The number of seconds required to transition the stick handle back to the
// rest position when releasing the mouse button or a touch target. For keyboard
// input, this also controls how long it takes to transition the stick to a
// directional position.
const STICK_ANIMATION_DURATION = .1;

// The size of a joystick (in pixels)
const STICK_SIZE = 75;

// Dead zone defines how far from centre the handle must move before it is
// considered valid user input. A value of 0.25 indicates that the stick needs to
// move by 25% before input is detected.
const DEAD_ZONE = .25;

// Try and detect if keyboard input should be ignored for joysticks when
// certain elements have focus, such as <input>s. This prevents the stick
// from moving because of side-effects triggered by the user performing actions
// in other parts of the UI, like moving the cursor to make text selections.
// `composedPath` is used here so events from the shadow dom can be checked. If
// the browser doesn't support composedPath, the joystick will move for all key
// presses.
const getKeyEventFilter = () => {
    if ('composedPath' in (window as any).KeyboardEvent.prototype) {
        return (e : KeyboardEvent) => {
            let originatingElem = e.composedPath()[0];
            return !('form' in originatingElem);
        }
    }
    return () => true;
}


const shouldRespondToKeyEvent = getKeyEventFilter();

// Define the unique type for the part and extend the parent Part class
@part('joystick')
export class JoystickPart extends DOMPart<HTMLDivElement> {

    @component(JoystickComponent)
    public core : JoystickComponent;
    public axis : JoystickAxis = JoystickAxis.xy;
    private _upPressed : boolean = false;
    private _downPressed : boolean = false;
    private _leftPressed : boolean = false;
    private _rightPressed : boolean = false;
    private _mouseHandler : IDisposable|null = null;
    private _touchHandler : IDisposable|null = null;
    private _keyDownHandler : IDisposable|null = null;
    private _keyUpHandler : IDisposable|null = null;

    constructor() {
        super();
        this.core = this._components.get('core') as JoystickComponent;
        this.core.invalidate();
    }

    getElement() : HTMLDivElement {
        const el = document.createElement('div');
        el.style.width = `${STICK_SIZE}px`;
        el.style.height = `${STICK_SIZE}px`;
        el.style.userSelect = 'none';
        el.style.background = `radial-gradient(circle ${STICK_SIZE / 4}px, red 100%, transparent),radial-gradient(circle ${STICK_SIZE / 2}px, #ccc8 80%, transparent 80%)`;
        el.style.backgroundRepeat = 'no-repeat';
        el.style.transition = `background-position ${STICK_ANIMATION_DURATION}s`;
        return el;
    }

    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        if (!this.core.stickX && !this.core.stickY) {
            this._el.style.backgroundPosition = '';
        } else {
            let direction = Math.atan2(this.core.stickY, this.core.stickX);
            let x = Math.cos(direction) * Math.abs(this.core.stickX);
            let y = Math.sin(direction) * Math.abs(this.core.stickY);
            this._el.style.backgroundPosition = `${Math.floor(x * STICK_SIZE / 4)}px ${Math.floor(y * STICK_SIZE / 4)}px, 50% 50%`;
        }
        this.core.apply();
    }

    /**
     * Sets the joystick values from the current keyboard state.
     */
    private updateStickFromKeyState() {
        let stickX = 0;
        let stickY = 0;

        if (this._upPressed) {
            stickY = -1;
        } else if (this._downPressed) {
            stickY = 1;
        }

        if (this._leftPressed) {
            stickX = -1;
        } else if (this._rightPressed) {
            stickX = 1;
        }

        this.setStick(stickX, stickY);
    }

    /**
     * Sets the joystick values based on screen coordinates
     *
     * @param x - X pixel position of the pointer
     * @param y - Y pixel position of the pointer
     * @param rect - The bounding rect to clamp coordinates to
    */
    private updateStickFromCoordinates(x : number, y : number, rect : ClientRect) {
        let localX = Math.max(0, Math.min(rect.width, x - rect.left));
        let localY = Math.max(0, Math.min(rect.height, y - rect.top));

        // normalise x and y to -1 ... 1
        localX = localX / (rect.width / 2) - 1;
        localY = localY / (rect.height / 2) - 1;

        localX = Math.max(-1, Math.min(1, localX * 2));
        localY = Math.max(-1, Math.min(1, localY * 2));

        this.setStick(localX, localY);
    }

    /**
     * Disables the animation used when the stick is accepting keyboard input or
     * returning back to rest after touch / mouse release.
     */
    private disableStickAnimation() {
        this._el.style.transition = '';
    }

    /**
     * Enables the animation for keyboard input and returning back to rest after
     * touch / mouse release.
     */
    private enableStickAnimation() {
        this._el.style.transition = `background-position ${STICK_ANIMATION_DURATION}s`;
    }

    /**
     * Finds a specific touch based on it's identifier
     *
     * @param touches
     * @param identifier
     */
    private getTouchByIdentifier(touches : TouchList, identifier : number) : Touch | null {
        for (let touch of touches) {
            if (touch.identifier === identifier) {
                return touch;
            }
        }
        return null;
    }

    /**
     * Set the joystick position. If the joystick is fixed to a specific axis,
     * arguments for the relevant axis will be ignored.
     *
     * @param x - value between -1 and 1 to indicate X input
     * @param y - value between -1 and 1 to indicate Y input
     */
    setStick(x : number, y : number) {
        if (this.axis === JoystickAxis.x || this.axis === JoystickAxis.xy) {
            this.core.stickX = x;
        }
        if (this.axis === JoystickAxis.y || this.axis === JoystickAxis.xy) {
            this.core.stickY = y;
        }
        this.core.invalidate();
    }


    onInstall(context : IPartContext) {
        super.onInstall(context);

        const rootEl = document.body;
        const el = this._el;

        this._mouseHandler = subscribeDOM(el, 'mousedown', (e : MouseEvent) => {
            if (e.target === el) {
                e.preventDefault();
                let rect = el.getBoundingClientRect();
                this.disableStickAnimation();

                const move = subscribeDOM(rootEl, 'mousemove', (e : MouseEvent) => {
                    this.updateStickFromCoordinates(e.pageX, e.pageY, rect);
                });

                const end = subscribeDOM(rootEl, 'mouseup', (e : MouseEvent) => {
                    this.enableStickAnimation();
                    this.setStick(0, 0);
                    move.dispose();
                    end.dispose();
                });
            }
        });

        this._touchHandler = subscribeDOM(el, 'touchstart', (e : TouchEvent) => {
            if (e.target === el) {
                e.preventDefault();
                let touchId = e.changedTouches[0].identifier;
                let rect = el.getBoundingClientRect();
                this.disableStickAnimation();

                const move = subscribeDOM(rootEl, 'touchmove', (e : TouchEvent) => {
                    let touch = this.getTouchByIdentifier(e.changedTouches, touchId);
                    if (touch) {
                        this.updateStickFromCoordinates(touch.pageX, touch.pageY, rect);
                    }
                });

                const end = subscribeDOM(rootEl, 'touchend', (e : TouchEvent) => {
                    let touch = this.getTouchByIdentifier(e.changedTouches, touchId);
                    if (touch) {
                        this.enableStickAnimation();
                        this.setStick(0, 0);
                        move.dispose();
                        end.dispose();
                    }
                });
            }
        });

        this._keyDownHandler = subscribeDOM(rootEl, 'keydown', (e : KeyboardEvent) => {
            if (!shouldRespondToKeyEvent(e)) {
                return false;
            }

            let needsUpdate = false;
            if (!e.repeat) {
                if (e.key === 'ArrowRight') {
                    this._rightPressed = true;
                    needsUpdate = true;
                }
                if (e.key === 'ArrowLeft') {
                    this._leftPressed = true;
                    needsUpdate = true;
                }
                if (e.key === 'ArrowUp') {
                    needsUpdate = true;
                    this._upPressed = true;
                }
                if (e.key === 'ArrowDown') {
                    needsUpdate = true;
                    this._downPressed = true;
                }
                if (needsUpdate) {
                    this.updateStickFromKeyState();
                }
            }
        });

        this._keyUpHandler = subscribeDOM(rootEl, 'keyup', (e : KeyboardEvent) => {
            if (!shouldRespondToKeyEvent(e)) {
                return false;
            }

            let needsUpdate = false;

            if (e.key === 'ArrowRight') {
                this._rightPressed = false;
                needsUpdate = true;
            }
            if (e.key === 'ArrowLeft') {
                this._leftPressed = false;
                needsUpdate = true;
            }
            if (e.key === 'ArrowUp') {
                this._upPressed = false;
                needsUpdate = true;
            }
            if (e.key === 'ArrowDown') {
                this._downPressed = false;
                needsUpdate = true;
            }
            if (needsUpdate) {
                this.updateStickFromKeyState();
            }
        });
    }

    /**
     * Has the stick been pushed to the left, outside the dead zone?
     */
    get left() : boolean {
        return this.core.stickX < -DEAD_ZONE;
    }

    /**
     * Has the stick been pushed to the right, outside the dead zone?
     */
    get right() : boolean {
        return this.core.stickX > DEAD_ZONE;
    }

    /**
     * Has the stick been pushed up, outside the dead zone?
     */
    get up() : boolean {
        return this.core.stickY < -DEAD_ZONE;
    }

    /**
     * Has the stick been pushed down, outside the dead zone?
     */
    get down() : boolean {
        return this.core.stickY > DEAD_ZONE;
    }

    /**
     * The angle of the stick in degrees, with `0` indicating right.
     */
    get direction() : number {
        return Math.atan2(this.core.stickY, this.core.stickX) * (180 / Math.PI);
    }

    /**
     * The amount of force applied to the stick
     *
     * @returns number between 0 and 1
     */
    get force() : number {
        let {stickX, stickY} = this.core;
        stickX = Math.max(0, (Math.abs(stickX) - DEAD_ZONE) * (1 / DEAD_ZONE));
        stickY = Math.max(0, (Math.abs(stickY) - DEAD_ZONE) * (1 / DEAD_ZONE));
        return Math.sqrt(stickX * stickX + stickY * stickY);
    }

    dispose() {
        if (this._mouseHandler) {
            this._mouseHandler.dispose();
        }
        if (this._touchHandler) {
            this._touchHandler.dispose();
        }
        if (this._keyDownHandler) {
            this._keyDownHandler.dispose();
        }
        if (this._keyUpHandler) {
            this._keyUpHandler.dispose();
        }
        super.dispose();
    }

    serialize() {
        const data = super.serialize();
        data.axis = this.axis;
        return data;
    }

    load(data : any) {
        super.load(data);
        this.axis = data.axis || JoystickAxis.xy;
    }
}
