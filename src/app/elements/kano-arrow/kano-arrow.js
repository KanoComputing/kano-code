import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
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
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                position: fixed;
                top: 0px;
                right: 0px;
                left: 0px;
                bottom: 0px;
                pointer-events: none;
                visibility: hidden;
            }

            :host .line {
                stroke: black;
                stroke-width: 3;
                fill: transparent;
            }
        </style>
        <slot id="content" name="arrow-image"></slot>
`,

  is: 'kano-arrow',

  properties: {
      source: {
          type: Object,
      },
      target: {
          type: Object,
      },
      angle: {
          type: Number,
          value: 0,
      },
      offset: {
          type: Number,
          value: 0,
      },
      leftAlign: {
          type: Boolean,
      },
      bounce: {
          type: Number,
          value: 40,
      }
  },

  observers: [
      'updatePosition(target.*)',
      'updatePosition(source.*)',
      'updatePosition(angle)',
      'updatePosition(bounce)'
  ],

  attached() {
      this.animationSupported = 'animate' in HTMLElement.prototype;
  },

  ready() {
      this.arrowImage = dom(this.$.content).getDistributedNodes()[0];
      window.addEventListener('resize', this.updatePosition.bind(this));
  },

  detached() {
      window.removeEventListener('resize', this.updatePosition.bind(this));
  },

  hide() {
      this.style.display = 'none';
      this.transform(``, this.arrowImage);
  },

  updatePosition() {
      if (!this.arrowImage) {
          return;
      }
      this.debounce('updatePosition', () => {
          if (!this.target) {
              return this.hide();
          }
          this.style.display = 'block';
          if (this.source) {
              this._showWithSource();
          } else {
              this._showWithoutSource();
          }
      }, 10);
  },

  _showWithSource() {
      let target = this.target,
          source = this.source,
          arrowStyle = this.arrowImage.style,
          angle,
          dist,
          offsetX, offsetY,
          x1, x2, y1, y2, x, y;
      x1 = source.left + source.width / 2;
      y1 = source.top + source.height / 2;
      x2 = target.left + target.width / 2;
      y2 = target.top + target.height / 2;

      x = x1 + ((x2 - x1) / 2);
      y = y1 + ((y2 - y1) / 2);

      x -= this.arrowImage.offsetWidth / 2;
      y -= this.arrowImage.offsetHeight / 2;

      angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI;

      dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + this.offset;

      offsetX = Math.cos(angle) * (dist * 0.2);
      offsetY = Math.sin(angle) * (dist * 0.2);

      arrowStyle.position = 'fixed';

      DOMUtil.addVendorProperty(this.arrowImage, 'transform-origin', `50% 50%`);
      this.style.visibility = 'visible';

      if (this.noAnimations || this.alreadyAnimated || !this.animationSupported) {
          return;
      }
      this.arrowImage.animate([{
          transform: `translate(${x + offsetX}px, ${y + offsetY}px) rotate(${angle}rad)`,
          opacity: 0
      }, {
          transform: `translate(${x}px, ${y}px) rotate(${angle}rad)`,
          opacity: 1
      }], {
              duration: 700 / dist * (dist * 0.2),
              easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)',
              fill: 'forwards'
          });
      this.alreadyAnimated = true;
  },

  _showWithoutSource() {
      let target = this.target,
          arrowStyle = this.arrowImage.style,
          arrowRect = this.arrowImage.getBoundingClientRect(),
          a = (this.angle / 180) * Math.PI,
          h = target.height - this.offset * 2,
          w = target.width - this.offset * 2,
          t = target.top + this.offset,
          l = target.left + this.offset,
          r = Math.sqrt(Math.pow(h / 2, 2) + Math.pow(w / 2, 2)),
          vx = Math.cos(a) * r,
          vy = Math.sin(a) * r,
          x, y, offsetX, offsetY;

          
        if (this.leftAlign) {
            x = target.left - arrowRect.width / 2;
            y = target.top - arrowRect.height / 2;
        } else {
            x = Math.min(vx * r, w / 2);
            y = Math.min(vy * r, h / 2);
        
            x += l;
            y += t;
        
            x += w / 2;
            y += h / 2;
        
            y -= this.arrowImage.offsetHeight / 2;
            y = Math.max(y, t - arrowRect.height / 2);
            x = Math.max(x, l - arrowRect.width / 2);
        }

      offsetX = Math.cos(a) * this.bounce;
      offsetY = Math.sin(a) * this.bounce;

      arrowStyle.position = 'fixed';
      arrowStyle.visibility = 'visible';

      DOMUtil.addVendorProperty(this.arrowImage, 'transform-origin', `0% 50%`);


      if (!this.bounce) {
          this.transform(`translate(${x}px, ${y}px) rotate(${a}rad)`, this.arrowImage);
      } else {
          this.arrowImage.animate([{
              transform: `translate(${x + offsetX}px, ${y + offsetY}px) rotate(${a}rad)`
          }, {
              transform: `translate(${x}px, ${y}px) rotate(${a}rad)`
          }, {
              transform: `translate(${x + offsetX}px, ${y + offsetY}px) rotate(${a}rad)`
          }], {
              duration: this.bounce * 25,
              easing: 'ease-in-out',
              iterations: Infinity
          });
      }

  },

  _tickBounce() { }
});
