import { Base } from './base.js';

const Lightboard = {
    listeners: {
        'update-shape': '_updateShape'
    },
    onCreated () {
        this._buttonDown = this._buttonDown.bind(this);
        this._buttonUp = this._buttonUp.bind(this);
    },
    onDestroyed () {
        this._stopFiring();
    },
    start () {
        Base.start.apply(this, arguments);
        this.attachListeners();

        this.iterator = {
            currentColumn: 1,
            currentRow: 1
        };
        this.clear();
    },
    stop () {
        Base.stop.apply(this, arguments);
        this.detachListeners();
    },
    attachListeners () {
        this.detachListeners();
        this.appModules.getModule('lightboard').on('button-down', this._buttonDown);
        this.appModules.getModule('lightboard').on('button-up', this._buttonUp);
    },
    detachListeners () {
        if (this.appModules) {
            this.appModules.getModule('lightboard').removeListener('button-down', this._buttonDown);
            this.appModules.getModule('lightboard').removeListener('button-up', this._buttonUp);
        }
    },
    clear () {
        return this.appModules.getModule('lightboard').clear(this.render.bind(this));
    },
    turnOn (light, color) {
        return this.appModules.getModule('lightboard').turnOn(light, color, this.render.bind(this));
    },
    turnOff (light) {
        return this.appModules.getModule('lightboard').turnOff(light, this.render.bind(this));
    },
    text (text, color, backgroundColor) {
        return this.appModules.getModule('lightboard').text(text.toString(), color, backgroundColor, this.render.bind(this));
    },
    render () {},
    getBitmap () {
        return this.appModules.getModule('lightboard').getBitmap();
    },
    scroll (text, color, backgroundColor, speed) {
        return this.appModules.getModule('lightboard').scroll(text.toString(), color, backgroundColor, speed, this.render.bind(this));
    },
    forEach (direction, callback) {
        if (direction === 'column') {
            for (this.iterator.currentColumn = 1;
                 this.iterator.currentColumn <= 16;
                 this.iterator.currentColumn++) {
                callback();
            }
        } else {
            for (this.iterator.currentRow = 1;
                 this.iterator.currentRow <= 8;
                 this.iterator.currentRow++) {
                callback();
            }
        }
    },
    isJoystick (buttonId) {
        return buttonId.indexOf('js-') === 0 && buttonId !== 'js-click';
    },
    _buttonDown (data) {
        let buttonId = data['button-id'];
        // Send the button event upward
        this._propagateButtonEvent(buttonId);
        if (this.isJoystick(buttonId)) {
            // When getting a duplicate event, just ignore
            if (this.currentButtonDown === buttonId) {
                return;
            }
            // Store the current joystick button
            this.currentButtonDown = buttonId;
            // Stop the current firing if it exists
            this._stopFiring();
            // Start a new firing after a small timeout
            this.fireTimeout = setTimeout(() => {
                this._startFiring(buttonId);
            }, 100);
        }
    },
    _buttonUp (data) {
        let buttonId = data['button-id'];
        if (this.isJoystick(buttonId)) {
            // The released button is not the current pushed, ignore
            if (this.currentButtonDown !== buttonId) {
                return;
            }
            this.currentButtonDown = null;
            this._stopFiring();
        }
    },
    _startFiring (buttonId) {
        this._stopFiring(buttonId);
        this.fireInterval = setInterval(() => {
            this._propagateButtonEvent(buttonId);
        }, 100);
    },
    _stopFiring () {
        clearTimeout(this.fireTimeout);
        clearInterval(this.fireInterval);
    },
    _propagateButtonEvent (buttonId) {
        this.fire("lightboard-" + buttonId);
    },
    _updateShape (e) {
        let shape = e.detail;
        this.appModules.getModule('lightboard').updateOrCreateShape(shape.id, shape, this.render.bind(this));
    },
    _removeShape (e) {
        let shapeId = e.detail;
        this.appModules.getModule('lightboard').removeShape(shapeId, this.render.bind(this));
    }
};

/**
 * @polymerBehavior
 */
export const lightboard = Object.assign({}, Base, Lightboard);
