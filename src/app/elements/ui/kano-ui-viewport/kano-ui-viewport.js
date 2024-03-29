/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

/*

## kano-ui-viewport component usage

The component can work in three different modes:

  * responsive
  * scaled
  * stretched


### Responsive mode

In this mode, the view container will be forced into certain aspect ratio
where you can position your elements as you wish. You need to specify the
aspect ratio (defaults to the current ratio of the container).

    <kano-ui-viewport mode="responsive" aspect-ratio="16:9">
        ... your content ...
    </kano-ui-viewport>


### Scaled mode

This mode lets you to scale an arbitrary element of specific dimensions that
you know beforehand to fit any viewport while maintaining the original aspect
ratio. You'll need to pass the original size of your content using the
`view-width` and `view-height` arguments.

    <kano-ui-viewport mode="scaled" view-width="500" view-height="500">
        ... your content ...
    </kano-ui-viewport>

Behind the scenes, the container uses CSS transforms to make your content fit.


### Stretched

This mode works exactly the same way as the 'scaled' mode, except it stretches
the content out of proportions to make it fit inside the available space.

*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class KanoUIViewport extends PolymerElement {
    static get is() { return 'kano-ui-viewport'; }
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                width: 100%;
                overflow: hidden;
            }
            #view {
                position: absolute;
                top: 0;
                transform-origin: 0 0 0;
                background-color: transparent;
                @apply --kano-ui-viewport;
            }
            :host([no-overflow]) #view {
                overflow: hidden;
            }
        </style>
        <div id="view">
            <slot></slot>
        </div>
`;
    }
    static get properties() {
        return {
            viewWidth: {
                type: Number,
                value: 0,
            },
            viewHeight: {
                type: Number,
                value: 0,
            },
            mode: {
                type: String,
                value: 'responsive',
            },
            aspectRatio: {
                type: String,
                value: 'auto',
            },
            centered: {
                type: Boolean,
                value: false,
            },
        };
    }
    static get observers() {
        return [
            'resizeView(mode, viewWidth, viewHeight, aspectRatio, isAttached)',
        ];
    }
    resizeView() {
        if (!this.isVisible || !this.viewWidth || !this.viewHeight) {
            return;
        }
        let scale;
        window.requestAnimationFrame(() => {
            switch (this.mode) {
            case 'responsive':
                this.resize();
                break;
            case 'stretched':
            case 'scaled':
            case 'zoomed':
                scale = this.getScale();
                this.calculateView(this.viewWidth, this.viewHeight, scale);
                break;
            default:
                console.log(`Mode "${this.mode}" not supported.`);
            }
        });
    }
    resize() {
        let scale = this.parseAspectRatio(this.aspectRatio);
        let width = this.viewWidth;
        let height = this.viewHeight;

        if (scale >= 1) {
            width = this.offsetWidth;
            height = this.offsetWidth * (1 / scale);
        } else {
            width = this.offsetHeight * scale;
            height = this.offsetHeight;
        }

        const s = this.getScale();
        scale = Math.min(s.x, s.y);

        height *= scale;
        width *= scale;

        /* Resize the view without scaling it */
        this.calculateView(width, height);
    }
    getScale() {
        const xScale = this.offsetWidth / this.viewWidth;
        const yScale = this.offsetHeight / this.viewHeight;
        let s;
        switch (this.mode) {
        case 'responsive':
        case 'stretched':
            return { x: xScale, y: yScale };
        case 'scaled':
            s = Math.min(xScale, yScale);
            return { x: s, y: s };
        case 'zoomed':
            s = Math.max(xScale, yScale);
            return { x: s, y: s };
        default:
            console.log(`Mode "${this.mode}" not supported.`);
            return { x: 1, y: 1 };
        }
    }
    calculateView(width, height, scale) {
        scale = scale || {
            x: 1,
            y: 1,
        };
        const { style } = this.$.view;
        const realViewHeight = this.viewHeight * scale.y;

        /* Set the boundaries */
        style.width = `${width}px`;
        style.height = `${height}px`;

        /* Align the view to top center */
        style.left = `${(this.offsetWidth - (width * scale.x)) / 2}px`;

        /* Transform the element to the appropriate scale */
        style.transform = `scale(${scale.x}, ${scale.y})`;

        if (this.centered && this.offsetHeight > realViewHeight) {
            style.top = `${(this.offsetHeight - realViewHeight) / 2}px`;
        } else {
            style.top = null;
        }
        this.dispatchEvent(new CustomEvent('viewport-resize', {
            detail: this.$.view.getBoundingClientRect(),
            bubbles: true,
            composed: true,
        }));
    }
    parseAspectRatio(aspect) {
        if (aspect === 'auto') {
            return this.viewHeight / this.viewWidth;
        }
        const numbers = aspect.split(':');
        return parseInt(numbers[0], 10) / parseInt(numbers[1], 10);
    }
    get isVisible() {
        return !!( this.offsetWidth || this.offsetHeight || this.getClientRects().length )
    }
}

customElements.define(KanoUIViewport.is, KanoUIViewport);
