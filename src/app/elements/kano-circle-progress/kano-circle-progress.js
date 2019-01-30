/**
`kano-circle-progress` displays a circular progress bar from a value using SVG.

Example:

    <kano-circle-progress value="0.4"></kano-circle-progress>

Custom property | Description | Default
----------------|-------------|----------
`--kano-circle-progress` | Mixin applied to the circle SVG element | `{}`
`--kano-circle-progress-back` | Mixin applied to the circle SVG element use as a background | `{}`


@group Kano Elements
@demo ./kano-circle-progress/demo/kano-circle-progress.html

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            #circle-full {
                fill: transparent;
                stroke-linecap: round;
                @apply --kano-circle-progress-back;
            }
            #circle {
                fill: transparent;
                stroke: white;
                transition: stroke-dashoffset linear 200ms;
                stroke-linecap: round;
                @apply --kano-circle-progress;
                display: none;
            }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" id="svg">
            <circle id="circle-full"></circle>
            <circle id="circle"></circle>
        </svg>
`,

  is: 'kano-circle-progress',

  properties: {
      /**
       * Radius of the circle
       */
      radius: {
          type: Number
      },
      /**
       * Defines the stroke width of the circle.
       */
      strokeWidth: {
          type: Number,
          value: 4,
          observer: '_update'
      },
      /**
       * Current value of the progress circle. Between 0 and 1.
       */
      value: {
          type: Number,
          value: 0,
          observer: '_computeDashoffset'
      }
  },

  attached () {
      this.radius = this.radius || this.offsetWidth;
      this._update();
      this._computeDashoffset(0);
  },

  _computeDashoffset (value) {
      var circle = this.$.circle,
          r = circle.getAttribute('r'),
          c = Math.PI * (r * 2),
          val = Math.max(0, Math.min(1, this.value));

      circle.setAttributeNS(null, 'stroke-dashoffset', (1 - val) * c);
  },

  _update () {
      var svg = this.$.svg,
          circle = this.$.circle,
          circleFull = this.$$('#circle-full'),
          width = this.radius,
          r = width / 2 - this.strokeWidth / 2,
          c = Math.PI * (r * 2);
      if (!this.radius) {
          return;
      }
      svg.setAttribute('width', width);
      svg.setAttribute('height', width);
      svg.setAttribute('viewBox', `0 0 ${width} ${width}`);
      circle.setAttributeNS(null, 'cx', width / 2);
      circle.setAttributeNS(null, 'cy', width / 2);
      circle.setAttributeNS(null, 'r', r);
      circle.setAttributeNS(null, 'stroke-width', `${this.strokeWidth}px`);
      circle.setAttributeNS(null, 'stroke-dasharray', c);
      circle.setAttributeNS(null, 'stroke-dashoffset', c);
      circle.setAttributeNS(null, 'transform', `rotate(270, ${width / 2}, ${width / 2})`);
      circle.style.display = 'block';
      circleFull.setAttributeNS(null, 'cx', width / 2);
      circleFull.setAttributeNS(null, 'cy', width / 2);
      circleFull.setAttributeNS(null, 'r', r);
      circleFull.setAttributeNS(null, 'stroke-width', `${this.strokeWidth}px`);
      circleFull.setAttributeNS(null, 'stroke-dasharray', c);
  }
});