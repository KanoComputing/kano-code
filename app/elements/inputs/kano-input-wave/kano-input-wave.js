import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-image/iron-image.js';
import { Input } from '../behaviors.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            iron-image {
                height: 48px;
                width: 48px;
                margin-right: 16px;
            }
        </style>
        <paper-dropdown-menu id="dropdown" noink="" no-animations="" label="[[label]]">
            <paper-listbox class="dropdown-content" selected="{{value}}" attr-for-selected="key" fallback-selection="linear">
                <paper-item role="menuitem" key="sine">
                    <iron-image src="/assets/part/oscillator/sine.svg" sizing="contain"></iron-image>
                    Sine
                </paper-item>
                <paper-item role="menuitem" key="square">
                    <iron-image src="/assets/part/oscillator/square.svg" sizing="contain"></iron-image>
                    Square
                </paper-item>
                <paper-item role="menuitem" key="sawtooth">
                    <iron-image src="/assets/part/oscillator/sawtooth.svg" sizing="contain"></iron-image>
                    Sawtooth
                </paper-item>
                <paper-item role="menuitem" key="triangle">
                    <iron-image src="/assets/part/oscillator/triangle.svg" sizing="contain"></iron-image>
                    Triangle
                </paper-item>
            </paper-listbox>
        </paper-dropdown-menu>
`,

  is: 'kano-input-wave',
  behaviors: [Input],

  observers: [
      'valueChanged(value)'
  ],

  valueChanged () {
      this.fire('change');
  }
});
