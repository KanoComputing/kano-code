import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer */
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            :host .wrapper {
                position: relative;
                overflow: hidden;
                border-radius: inherit;
                z-index: 0;
            }
            :host .glint {
                transform: translateX(-125%) rotate(-45deg);
                top: 0;
                left: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.3);
                animation-delay: 0s;
                animation-duration: 4s;
                animation-timing-function: ease-in;
                animation-iteration-count: infinite;
                transform-origin: center;
                pointer-events: none;
            }
            :host([running]) .glint {
                animation-name: glint;
            }
            @keyframes glint {
                0% { transform: translateX(-125%) rotate(-45deg); }
                20% { transform: translateX(125%) rotate(-45deg); }
                100% { transform: translateX(125%) rotate(-45deg); }
            }
        </style>
        <div class="wrapper">
            <slot></slot>
            <div class="glint"></div>
        </div>
`,

  is: 'kano-glint-animation',

  properties: {
      running: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      }
  }
});