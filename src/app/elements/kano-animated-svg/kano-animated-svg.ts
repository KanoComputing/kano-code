/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

/**

`kano-animated-svg` controls changes of path descriptors of a path SVG element.
It allows you to define a set of SVG paths and switch between them.

Example:
    <kano-animated-svg paths="[[paths]]"
                       selected="start"></kano-animated-svg>

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------
 `--kano-animated-path` | Mixin applied to the path SVG element | `{}`

@group Kano Elements
@hero hero.svg
@demo ./demo.html
*/
import { LitElement, customElement, css, html, property, query } from 'lit-element/lit-element.js';

@customElement('kano-animated-svg')
export class KanoAnimatedSvg extends LitElement {
    @property({ type: Object })
    paths : { [K : string] : string } = {};
    @property({ type: String })
    selected? : string;
    @property({ type: Number })
    width : number = 16;
    @property({ type: Number })
    height : number = 16;

    @query('svg')
    svgEl? : SVGElement;
    @query('path')
    pathEl? : SVGPathElement;
    static get styles() {
        return [css`
            :host {
                display: block;
                position: relative;
            }
            svg {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
            }
            path {
                transition: all ease-in-out 200ms;
            }
        `];
    }
    render() {
        const pathData = (this.paths && this.selected) ? this.paths[this.selected] : "";
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" id="svg">
                <path id="path" class="animatable" d=${pathData}></path>
            </svg>
        `;
    }
    updated(changes : Map<string, unknown>) {
        if (changes.has('width') || changes.has('height')) {
            this.updateViewBox();
        }
    }
    updateViewBox() {
        if (!this.svgEl) {
            return;
        }
        this.svgEl.setAttribute('width', this.width.toString());
        this.svgEl.setAttribute('height', this.height.toString());
        this.svgEl.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    }
}
