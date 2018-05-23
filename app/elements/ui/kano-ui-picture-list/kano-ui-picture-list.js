import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
import '../../../../../../@kano/kwc-style/part.js';
import '../../kano-gif-creator/kano-gif-creator.js';
import { Polymer } from '../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style is="custom-style" include="part-style"></style>
        <style>
            :host {
                display: inline-block;
            }
            .container {
                overflow-x: auto;
                position: relative;
                max-width: 379px;
                @apply(--layout-horizontal);
                border-radius: 3px;
                background-color: rgba(0, 0, 0, 0.22);
                padding: 12px;
                box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
            }
            .picture {
                @apply(--layout-vertical);
                @apply(--layout-center);
                @apply(--layout-center-jusitfied);
                box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
                border-radius: 3px;
                border: 1px solid white;
                background-color: #f3f3f3;
                padding: 5px;
                transition: all linear 1000ms;
            }
            .picture:not(:first-of-type) {
                margin-left: -7px;
            }
            iron-image {
                width: 66px;
                height: 36px;
            }
        </style>
        <div class="container">
            <template is="dom-repeat" items="[[_computePictureArray(pictures.splices)]]" as="picture">
                <div class="picture" style\$="[[_computeTilt(index)]]">
                    <iron-image src="[[picture]]" preload="" fade="" sizing="cover"></iron-image>
                </div>
            </template>
        </div>
`,

  is: 'kano-ui-picture-list',
  behaviors: [Base, UIBehavior],

  ready () {
      this.pictures = [];
  },

  stop () {
      Base.stop.apply(this, arguments);
      this.pictures = [];
      this.pause();
  },

  _computeTilt (index) {
      return `transform: rotate(${((index % 2) * 4) - 2}deg)`;
  },

  _computePictureArray () {
      let internalPictures = [],
          index = 0;
      if (this.pictures.length >= 5) {
          return this.pictures.slice(0);
      }
      while (internalPictures.length < 5) {
          internalPictures.push(this.pictures[index] || '/assets/part/picture-list-placeholder.svg');
          index++;
      }
      return internalPictures;
  },

  play () {
      this.playing = true;
      this._playOnModeCanvas();
  },

  _playOnModeCanvas () {
      this.fire('play-picture-list', {
          pictures: this.pictures,
          speed: this.get('model.userProperties.speed')
      });
  },

  _pauseOnModeCanvas () {
      this.fire('pause-picture-list');
  },

  pause () {
      this.playing = false;
      this._pauseOnModeCanvas();
  },

  setSpeed (speed) {
      this.set('model.userProperties.speed', Math.max(0, Math.min(15, speed)));
  },

  addPicture(src) {
      this._slidePictures()
          .then(_ => {
              this.unshift('pictures', src);
              this._animateNewPictureIn();
              if (this.playing) {
                  this._playOnModeCanvas();
              }
          });
  },

  saveGif () {
      if (!this.pictures.length) {
          return;
      }
      this.throttle('saveGif', () => {
          this.fire('save-gif', {
              pictures: this.pictures,
              speed: this.get('model.userProperties.speed')
          });
      }, 1000);
  },

  _slidePictures () {
      let pictures = dom(this.root).querySelectorAll('.picture'),
          count = Math.min(6, pictures.length),
          animation,
          lastAnimation;
      // Do not animate if there is less than 5 pictures
      if (this.pictures.length <= 4) {
          return Promise.resolve();
      }
      // Only animate the visible pictures
      for (let i = 0; i < count; i++) {
          animation = pictures[i].animate([
              { transform: 'translateX(0px)' },
              { transform: 'translateX(100%)' }
          ], {
              duration: 200,
              delay: (count - i) * 40,
              easing: 'ease-in-out'
          });
          if (i === 0) {
              lastAnimation = animation;
          }
      }
      return lastAnimation.finished;
  },

  _animateNewPictureIn () {
      let picture = this.$$('.picture');
      // Do not animate if there is less than 5 pictures
      if (this.pictures.length <= 4) {
          return;
      }
      picture.animate([
          { transform: 'scale(0)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 }
      ], {
          duration: 200,
          easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
      });
  }
});
