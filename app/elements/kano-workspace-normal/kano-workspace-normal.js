import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { WorkspaceBehavior } from '../behaviors/kano-workspace-behavior.js';
import { Canvas } from '../../lib/kano-canvas-api/kano-canvas-api.js';

class KanoWorkspaceNormal extends mixinBehaviors(
    [WorkspaceBehavior],
    PolymerElement,
) {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
                background: var(--canvas-background, #ffffff);
            }
            .content ::slotted(*) {
                position: absolute;
                top: 0px;
                left: 0px
            }
        </style>
        <canvas id="canvas" width\$="[[width]]" height\$="[[height]]"></canvas>
        <div class="content">
            <slot name="part"></slot>
        </div>
`;
    }

    static get is() { return 'kano-workspace-normal'; }
    static get properties() {
        return {
            autoStart: Boolean,
            mousePositionX: {
                type: Number,
                value: 250,
                notify: true,
            },
            mousePositionY: {
                type: Number,
                value: 250,
                notify: true,
            },
            backgroundCache: {
                type: String,
            },
        };
    }
    get partsRoot() {
        return this;
    }
    constructor() {
        super();
        this.mousePositionX = 250;
        this.mousePositionY = 250;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.autoStart) {
            this.start();
        }
        this.ctx = this.$.canvas;
    }
    get api() {
        return {
            setBackgroundColor: this.setBackgroundColor.bind(this),
            setTransparency: this.setTransparency.bind(this),
            reset: this.reset.bind(this),
            lineTo: this.modules.paths.lineTo.bind(this.modules.paths),
            line: this.modules.paths.line.bind(this.modules.paths),
            color: this.modules.setters.color.bind(this.modules.setters),
            stroke: this.modules.setters.stroke.bind(this.modules.setters),
            circle: this.modules.shapes.circle.bind(this.modules.shapes),
            ellipse: this.modules.shapes.ellipse.bind(this.modules.shapes),
            square: this.modules.shapes.square.bind(this.modules.shapes),
            rectangle: this.modules.shapes.rectangle.bind(this.modules.shapes),
            arc: this.modules.shapes.arc.bind(this.modules.shapes),
            polygon: this.modules.shapes.polygon.bind(this.modules.shapes),
            pixel: this.modules.shapes.pixel.bind(this.modules.shapes),
            moveTo: this.modules.space.moveTo.bind(this.modules.space),
            moveToRandom: this.modules.space.moveToRandom.bind(this.modules.space),
            move: this.modules.space.move.bind(this.modules.space),
        };
    }
    /**
   * Apply background and store the value
   * to be reapplied when workspace is reset
   * (For imperative use - i.e user code will not call this)
   */
    setBackground(bg) {
        this.backgroundCache = bg;
        this.style.background = bg;
        let bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg),
            ctx,
            img;
        bg_url = bg_url ? bg_url[2] : '';
        if (bg_url && bg_url !== '') {
            ctx = this.$.canvas.getContext('2d');
            img = new Image();
            img.src = bg_url;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, this.$.canvas.width, this.$.canvas.height);
            };
        }
    }
    /**
   * Method called by Canvas part (i.e. user code setting the background)
  */
    setBackgroundColor(color) {
        this.backgroundColorSet = true;
        this.style.backgroundColor = color;
    }
    getBackgroundColor() {
        return this.style.backgroundColor;
    }
    setTransparency(value) {
        const alpha = Math.min(Math.max(0, value), 100) / 100;
        this.ctx.globalAlpha = alpha;
    }
    start() {
        this.reset();
    }
    reset() {
        this.clear();
        this.ctx = this.$.canvas.getContext('2d');
        this.ctx.globalAlpha = 1;
        this.modules = new Canvas({
            ctx: this.ctx,
            width: this.ctx.canvas.width,
            height: this.ctx.canvas.height,
        });
    }
    clear() {
        this.backgroundColorSet = false;
        if (this.backgroundCache) {
            // To avoid a brief flash on the canvas, reset background only if Canvas part
            // would otherwise not set any value and there is effective change
            setTimeout(() => {
                if (!this.backgroundColorSet && this.style.background !== this.backgroundCache) {
                    this.setBackground(this.backgroundCache);
                }
            }, 50);
        }
    }
    renderOnCanvas(ctx, util, scaleFactor) {
        ctx.fillStyle = this.style.background || '#ffffff';
        ctx.fillRect(0, 0, this.$.canvas.width, this.$.canvas.height);
        ctx.drawImage(this.$.canvas, 0, 0);
        return Promise.resolve();
    }
}

customElements.define(KanoWorkspaceNormal.is, KanoWorkspaceNormal);
