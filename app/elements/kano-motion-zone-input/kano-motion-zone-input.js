import '../../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../../../../@kano/kwc-style/typography.js';
import '../../../../../polymer-filters/filters/compare.js';
import { Polymer } from '../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --shadow-elevation-8dp;
                padding: 6px 12px 6px 0px;
                overflow: hidden;
            }
            .options {
                @apply --layout-vertical;
                margin-right: 12px;
            }
            .options>button {
                position: relative;
                background: transparent;
                border: 0px;
                cursor: pointer;
                font-family: var(--font-body);
                font-size: 20px;
                padding: 0px 26px 0px 42px;
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
                height: 33px;
            }
            .options>button:hover,
            .options>button:focus {
                outline: none;
                background: #DCDCDC;
            }
            .options>button[selected]::before {
                content: '';
                position: absolute;
                left: 12px;
                top: 12px;
                width: 16px;
                height: 16px;
                background: url(/assets/icons/tick.svg) no-repeat 0px 0px;
                opacity: 0.6;
            }
            svg {
                width: 34px;
            }
            .background {
                fill: #BABABA;
            }
            .filler {
                fill: #199DD8;
            }
        </style>
        <div class="options" on-tap="_optionTapped">
            <button data-value="1" selected\$="[[isEq(value, 1)]]">1</button>
            <button data-value="2" selected\$="[[isEq(value, 2)]]">2</button>
            <button data-value="3" selected\$="[[isEq(value, 3)]]">3</button>
            <button data-value="4" selected\$="[[isEq(value, 4)]]">4</button>
            <button data-value="5" selected\$="[[isEq(value, 5)]]">5</button>
        </div>
        <svg viewBox="0 0 34 200">
            <defs>
                <clipPath id="funnel">
                <path d="M 0,0 m 0, 4 a 4, 4, 0, 0, 1, 4, -4 l 26, 0 a 4, 4, 0, 0, 1, 4, 4 l -14 192 a 2, 2, 0, 0, 1, -6, 0"></path>
                </clipPath>
                <clipPath id="steps">
                    <rect x="0" y="0" height="38" width="34"></rect>
                    <rect x="0" y="40" height="38" width="34"></rect>
                    <rect x="0" y="80" height="38" width="34"></rect>
                    <rect x="0" y="120" height="38" width="34"></rect>
                    <rect x="0" y="160" height="40" width="34"></rect>
                </clipPath>
            </defs>
            <g clip-path="url(#steps)">
                <g clip-path="url(#funnel)">
                    <rect class="background" x="0" y="0" width="34" height="200"></rect>
                    <rect id="filler" class="filler" x="0" y="0" width="34" height="200"></rect>
                </g>
            </g>
        </svg>
`,

  is:'kano-motion-zone-input',
  behaviors: [PolymerFilters.FilterBehavior],

  properties: {
      value: {
          type: Number,
          value: 1,
          notify: true
      },
      gauge: {
          type: Number,
          value: 0,
          observer: '_transformFiller'
      }
  },

  _optionTapped (e) {
      let target = e.path ? e.path[0] : e.target,
          value = target.dataset.value;
      this.value = parseInt(value);
  },

  _transformFiller (gauge) {
      let gaugeHeight = Math.max(0, Math.min(200, gauge / 100 * 200));
      this.transform(`translate(0, ${gaugeHeight}px)`, this.$.filler);
  }
});
