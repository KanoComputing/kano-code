import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { StickerMixin } from '../sticker/sticker.js';

class KanoPartMouse extends StickerMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-mouse'; }
    connectedCallback() {
        super.connectedCallback();
        const parent = this.parentNode;
        // The parent if a workspace, use it
        if (parent.tagName.toLowerCase().indexOf('kano-workspace') === 0) {
            this.workspace = this.parentNode;
        } else {
            this.workspace = this.parentNode.getWorkspace();
        }
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onResize = this._onResize.bind(this);
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.listeners = [];
        this._imageCache = {};
        this._lastRefresh = Date.now();
        window.addEventListener('resize', this._onResize);
        setTimeout(this._onResize, 250);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this._onResize);
        this._removeMouseListeners();
    }
    _removeMouseListeners() {
        this.listeners.forEach((listener) => {
            this.removeEventListener(listener.eventName, listener.cb);
        });
        this.listeners = [];
        this.workspace.style.cursor = 'initial';
    }
    _onResize() {
        this._debounceJob = Debouncer.debounce(this._debounceJob, timeOut.after(100), () => {
            this.workspaceRect = this.workspace.getBoundingClientRect();
        });
    }
    start() {
        this.workspace.addEventListener('mousemove', this._onMouseMove);
        this.workspace.addEventListener('mousedown', this._onMouseDown);
        this.workspace.addEventListener('mouseup', this._onMouseUp);
    }
    stop(...args) {
        super.stop(...args);
        this.workspace.removeEventListener('mousemove', this._onMouseMove);
        this.workspace.removeEventListener('mousedown', this._onMouseDown);
        this.workspace.removeEventListener('mouseup', this._onMouseUp);

        this._removeMouseListeners();
    }
    on(type, cb) {
        const eventName = `mouse-${type}`;
        this.addEventListener(eventName, cb);
        this.listeners.push({ eventName, cb });
    }
    _onMouseMove(e) {
        let rect = this.workspaceRect,
            scalingFactor = rect.width / this.workspace.width,
            x, 
y,
            now = Date.now();

        x = Math.max(0, Math.min(this.workspace.width, parseInt(e.x - rect.left) / scalingFactor));
        y = Math.max(0, Math.min(this.workspace.height, parseInt(e.y - rect.top) / scalingFactor));

        /* Reset mouse speed when off the canvas for more than 100ms */
        if (now - this._lastRefresh > 100) {
            this.mouseDeltaX = 0;
            this.mouseDeltaY = 0;
        } else {
            this.mouseDeltaX = x - this.mouseX;
            this.mouseDeltaY = y - this.mouseY;
        }
        this._lastRefresh = now;

        this.mouseX = x;
        this.mouseY = y;

        this.dispatchEvent(new CustomEvent('mouse-move', { bubbles: true }));
    }
    _onMouseDown() {
        this.dispatchEvent(new CustomEvent('mouse-down', { bubbles: true }));
    }
    _onMouseUp() {
        this.dispatchEvent(new CustomEvent('mouse-up', { bubbles: true }));
    }
    setCursor(cursor) {
        if (!cursor) {
            return;
        }
        this.loadImage(cursor)
            .then((url) => {
                this.workspace.style.cursor = `url('${url}'), auto`;
            });
    }
    loadImage(url) {
        if (this._imageCache[url]) {
            return Promise.resolve(this._imageCache[url]);
        }
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                let canvas = document.createElement('canvas'),
                    ctx;
                canvas.width = 30;
                canvas.height = 30;
                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 30, 30);
                this._imageCache[url] = canvas.toDataURL();
                resolve(this._imageCache[url]);
            };
            img.onerror = reject;
            img.src = url;
        });
    }
    getX() {
        return this.mouseX;
    }
    getY() {
        return this.mouseY;
    }
    getXSpeed() {
        return this.mouseDeltaX;
    }
    getYSpeed() {
        return this.mouseDeltaY;
    }
}

customElements.define(KanoPartMouse.is, KanoPartMouse);
