import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: flex;
flex-direction: row;
                @apply --layout-end-justified;
                color: #fff;
            }
            .visuals {
                display: flex;
flex-direction: row;
                margin-right: 8px;
                font-size: 12px;
            }
            .data {
                width: 18px;
                display: flex;
flex-direction: row;
                @apply --layout-center-justified;
            }
            span {
                width: 10px;
                font-size: 11px;
            }
        </style>
        <div class="visuals" id="visuals">
            <div class="data">[[h]]</div>
            <span>&nbsp;:&nbsp;</span>
            <div class="data">[[m]]</div>
            <span>&nbsp;:&nbsp;</span>
            <div class="data">[[s]]</div>
        </div>
`,

  is:'kano-ic-clock',

  properties: {
      model: Object
  },

  attached () {
      this.interval = setInterval(this._updateClock.bind(this), 1000);
      this._updateClock();
  },

  detached () {
      clearInterval(this.interval);
  },

  _updateClock () {
      let d = new Date(),
          h = this._leftPadTime(d.getHours()),
          m = this._leftPadTime(d.getMinutes()),
          s = this._leftPadTime(d.getSeconds());
      this.set('h', h);
      this.set('m', m);
      this.set('s', s);
  },

  _leftPadTime (n) {
      return n < 10 ? '0' + n : n;
  }
});
