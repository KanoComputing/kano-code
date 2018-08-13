import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                @apply --layout-horizontal;
                @apply --layout-end-justified;
                color: white;
            }
            button {
                width: 32px;
                height: 32px;
                background: transparent;
                border: 0px;
                cursor: pointer;
                padding: 0;
            }
            button:focus {
                outline: none;
            }
            button iron-icon {
                opacity: 0.8;
                --iron-icon-fill-color: white;
                --iron-icon-stroke-color: white;
                --iron-icon-width: 18px;
                --iron-icon-height: 18px;
            }
            button:hover iron-icon {
                opacity: 1;
            }
        </style>
        <button type="button" on-tap="_toggleMuted" on-mouseenter="_mouseEnter" on-mouseleave="_mouseLeave">
            <iron-icon id="icon" icon="av:volume-up"></iron-icon>
        </button>
`,

  is:'kano-ic-speaker',

  properties: {
      muted: {
          type: Boolean,
          value: false,
          notify: true,
          observer: '_mutedChanged'
      }
  },

  _mutedChanged (muted, oldValue) {
      let icon = 'volume-up';
      // Simulate a mouse leave if we just unmuted
      if (muted && !oldValue) {
          this.isMouseOver = false;
      }
      // Muted shows off
      if (muted || this.isMouseOver) {
          icon = 'volume-off';
      }
      this.setIcon(`av:${icon}`);
  },

  setIcon (icon) {
      this.$.icon.setAttribute('icon', icon);
  },

  _mouseEnter () {
      this.isMouseOver = true;
      this._mutedChanged(this.muted);
  },

  _mouseLeave () {
      this.isMouseOver = false;
      this._mutedChanged(this.muted);
  },

  _toggleMuted (e) {
      this.set('muted', !this.muted);
      e.stopPropagation();
      e.preventDefault();
  }
});
