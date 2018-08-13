import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
 * DOM utility module
 *
 * A small module containing utilities to work with the DOM
 */
var VENDOR_PREFIXES = [ '', '-ms-', '-webkit-', '-moz-', '-o-' ];

/*
 * Set inline CSS property to element with all vendor prefixes
 *
 * @param {HTMLElement} element
 * @param {String} property
 * @param {String} value
 */
function addVendorProperty(element, property, value) {
    var prefix;

    for (prefix in VENDOR_PREFIXES) {
        element.style[VENDOR_PREFIXES[prefix] + property] = value;
    }
}

/*
 * Unset inline CSS property of element with all vendor prefixes
 *
 * @param {HTMLElement} element
 * @param {String} property
 * @param {String} value
 */
function removeVendorProperty(element, property) {
    var prefix;

    for (prefix in VENDOR_PREFIXES) {
        element.style[VENDOR_PREFIXES[prefix] + property] = null;
    }
}

window.DOMUtil = window.DOMUtil || { addVendorProperty: addVendorProperty, removeVendorProperty: removeVendorProperty };
/* globals Polymer, DOMUtil */

const ANIMATION_DURATION = 1000;
Polymer({
  _template: html`
        <style>
            :host {
                display: inline-block;
                position: fixed;
                top: 0px;
                right: 0px;
                left: 0px;
                bottom: 0px;
                pointer-events: none;
            }
            :host .line {
                stroke: black;
                stroke-width: 3;
                fill: transparent;
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" id="svg">
            <defs>
                <marker id="arrow" orient="auto" viewBox="0 0 10 10" markerWidth="3" markerHeight="4" markerUnits="strokeWidth" refX="1" refY="5">
                    <polyline points="0,0 10,5 0,10 1,5" fill="black"></polyline>
                </marker>
            </defs>
            <path id="path" class="line" d\$="[[path]]" marker-end="url(#arrow)"></path>
        </svg>
`,

  is: 'kano-svg-arrow',

  properties: {
      source: {
          type: Object
      },
      target: {
          type: Object
      },
      path: {
          type: String,
          value: ''
      }
  },

  observers: [
      'updatePosition(target.*, source.*)'
  ],

  ready () {
      window.addEventListener('resize', this.updatePosition.bind(this));
  },

  detached () {
      window.removeEventListener('resize', this.updatePosition.bind(this));
  },

  updatePosition () {
      this.debounce('updatePosition', () => {
          let target = this.target,
              source = this.source,
              svg = this.$.svg,
              rect = this.getBoundingClientRect(),
              path,
              pathStyle,
              length,
              x1, x2, y1, y2, x, y;

          if (!target || !source) {
              return this.set('path', '');
          }
          svg.setAttribute('width', rect.width);
          svg.setAttribute('height', rect.height);
          svg.setAttribute('viewBox', `0 0 ${svg.width} ${svg.height}`);
          x1 = source.left + source.width / 2;
          y1 = source.top + source.height / 2;
          x2 = target.left + target.width / 2;
          y2 = target.top + target.height / 2;

          x = x1 + ((x2 - x1) / 2) - 40;
          y = y1 + ((y2 - y1) / 2) - 40;

          this.set('path', `M ${x1} ${y1} Q ${x} ${y}, ${x2} ${y2}`);
          path = svg.querySelector('#path');
          length = path.getTotalLength();
          pathStyle = path.style;

          DOMUtil.addVendorProperty(path, 'transition', 'none');

          pathStyle.strokeDasharray = `${length} ${length}`;
          pathStyle.strokeDashoffset = length;

          // Trigger a layout in the browser to pick up the new transition;
          path.getBoundingClientRect();
          DOMUtil.addVendorProperty(path, 'transition', `stroke-dashoffset ${ANIMATION_DURATION}ms ease-in-out`);

          pathStyle.strokeDashoffset = '0';
      }, 10);
  }
});
