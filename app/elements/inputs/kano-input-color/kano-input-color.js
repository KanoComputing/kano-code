/**
`kano-input-color` Display a color palette and allows selection by clicking on one of them
Example:
    <kano-input-color value="{{value}}"></kano-input-color>
### Styling
The following custom properties and mixins are available for styling:
Custom property | Description | Default
----------------|-------------|----------
`--kano-color-input-field` | Mixin for the input field | {}
`--kano-input-color-size` | Size of a single color field | 29px
`--kano-input-color-margin` | Size of margin around a color field | 2px
`--kano-input-color-background` | Background color on host | 'transparent'

@group Kano Elements
@hero hero.svg
@demo demo/kano-input-color.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@kano/kwc-color-picker/kwc-color-picker.js';
import { Input } from '../behaviors.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            label {
                @apply --kano-part-editor-label;
            }
            kwc-color-picker {
                width: 100%;
                height: 100%;
                @apply --kano-color-input-field;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <label hidden\$="[[!label]]">[[label]]</label>
        <kwc-color-picker id="picker" value="{{value}}" colors="[[colors]]" idle="[[idle]]" row-size="[[rowSize]]"></kwc-color-picker>
`,

  is: 'kano-input-color',

  behaviors: [
      Input
  ],

  properties: {
      colors: {
          type: Array
      },
      value: {
          type: String,
          notify: true,
          observer: '_onValueChanged'
      },
      rowSize: {
          type: Number,
          value: 12
      },
      idle: {
          type: Boolean,
          value: false
      },
      visible: {
          type: Boolean,
          value: false
      }
  },

  attached () {
      this.colors = this.$.picker.colors;
  },

  _onValueChanged (value) {
      this.fire('tracking-event', {
          name: 'color_selected'
      });
  },

  addColor (c) {
      this.$.picker.addColor(c);
  },

  // Returns the color palette for outside access
  getColorField () {
      return this.$.picker.getColorField();
  }
});
