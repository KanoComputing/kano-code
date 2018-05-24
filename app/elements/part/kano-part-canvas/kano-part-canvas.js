import { UIBehavior } from '../kano-ui-behavior.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
import { Canvas } from './kano-canvas-api/kano-canvas-api.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: inline-block;
            }
            canvas {
                border: 1px solid lightgrey;
            }
            canvas[running] {
                border-color: transparent;
            }
        </style>
        <canvas id="canvas" style\$="[[_computeCanvasStyle(model.userStyle.width, model.userStyle.height)]]" running\$="[[isRunning]]"></canvas>
    `,
    is: 'kano-part-canvas',
    behaviors: [Base, UIBehavior],
    ready () {
        this.ctx = this.$.canvas.getContext('2d');
        this.prevSize = {};
        this.resetSession();
    },
    _computeCanvasStyle () {
        let style;
        this._updateCanvasSize();
        style = this.getPartialStyle(['width', 'height']);
        style += `background: ${this.background};`;
        return style;
    },
    _updateCanvasSize () {
        if (!this.model) {
            return;
        }
        if (this.prevSize.width !== this.model.userStyle.width || this.prevSize.height !== this.model.userStyle.height) {
            this.$.canvas.setAttribute('width', parseInt(this.model.userStyle.width));
            this.$.canvas.setAttribute('height', parseInt(this.model.userStyle.height));
            this.prevSize.width = this.model.userStyle.width;
            this.prevSize.height = this.model.userStyle.height;
        }
    },
    setBackgroundColor (color) {
        this.$.canvas.style.background = color;
        this.background = color;
    },
    polygon (points, close) {
        return this.modules.shapes.polygon.apply(this.modules.shapes.polygon, points.concat(close));
    },
    resetSession () {
        if (!this.model) {
            return;
        }
        this.$.canvas.style.background = 'transparent';
        this.background = 'transparent';
        this.modules = new Canvas({
            ctx: this.ctx,
            width: parseInt(this.model.userStyle.width),
            height: parseInt(this.model.userStyle.height)
        });
    },
    start () {
        Base.start.apply(this, arguments);
        this.resetSession();
    },
    renderOnCanvas (ctx, util, scaleFactor) {
        var image = new Image();
        image.src = this.$.canvas.toDataURL();
        ctx.drawImage(image, 0, 0);
        return Promise.resolve();
    }
});
