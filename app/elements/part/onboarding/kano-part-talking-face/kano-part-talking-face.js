import '../../../../../../../@kano/kwc-style/part.js';
import '../../../../../../../@kano/web-components/kano-sound-player-behavior/kano-sound-player-behavior.js';
import { Polymer } from '../../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../../../@polymer/polymer/lib/utils/html-tag.js';
import { Base } from '../../../../scripts/kano/make-apps/parts-api/base.js';
import { UIBehavior } from '../../kano-ui-behavior.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style is="custom-style" include="part-style"></style>
        <style>
            :host {
                display: flex;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-content: center;
            }
            .container {
                margin: auto;
            }
        </style>
        <div class="container">
            <kano-bitmap-renderer width="16" height="8" bitmap="[[bitmap]]" pixel-size="25" spacing="1" fps="30" loop=""></kano-bitmap-renderer>
        </div>
`,

  is: 'kano-part-talking-face',
  behaviors: [Base, UIBehavior, Kano.Behaviors.SoundPlayerBehavior],

  properties: {
      bitmap: {
          type: Array,
          value: () => {
              return [];
          }
      },
      maxVol: {
          type: Number,
          //a reasonable start value
          value: 25
      },
      frames: {
          type: Array,
          value: () => {
              return [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72",0,0,0,0,"#addf72",0,0,0,0,0,0,0,0,0,"#addf72",0,"#addf72",0,0,"#addf72",0,"#addf72",0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#addf72","#addf72","#addf72",0,0,"#addf72","#addf72","#addf72",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,0,0,"#6fb3eb",0,0,0,0,0,0,"#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb","#6fb3eb",0,0,0]]
        }
      }
  },

  listeners: {
      'frequency-data': 'triggerFrame',
      'sound-ended': 'endAnimation'
  },

  ready () {
      this.fill('#000');
  },

  attached () {
      // load sounds after initialisation
      this.async(() => {
          ['english', 'french', 'italian', 'scottish', 'us'].forEach((accent) => {
              this.loadSound(`/assets/audio/onboarding/${accent}.m4a`);
          })
      }, 500);
  },

  fill (c) {
      this.bitmap = new Array(18 * 13);
      this.bitmap.fill(c);
  },

  say (flag, accent) {
      if (flag) {
          accent = accent || 'english';
          this.playSound(`/assets/audio/onboarding/${accent}.m4a`, true);
      }
  },

  triggerFrame (e) {
      //calculating average volume from frequency data
      let volumeArray = e.detail.data,
          sum = 0,
          masterVolume,
          triggeredFrame;
      for (let i = 0, len = volumeArray.length; i < len; i++) {
          sum += volumeArray[i];
      }
      masterVolume = sum / volumeArray.length;
      //updating maxVolume
      this.maxVol = masterVolume > this.maxVol ? masterVolume : this.maxVol;
      //assigning one from the 10 hard-coded frames
      triggeredFrame = Math.round(masterVolume / this.maxVol * 10) - 1;
      if (triggeredFrame > -1) {
          this.runAnimation(triggeredFrame);
      }
  },

  endAnimation () {
      this.fire('talking-face-animation-stopped');
  },

  runAnimation (choice) {
      this.bitmap.fill('#000');
      this.frames[choice].forEach((value, index) => {
        if (value) {
            this.bitmap[index] = value;
        }
      });
  }
});
