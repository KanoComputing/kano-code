/**

  `kano-challenge-completed-modal` is a confirmation dialog shown at the end of
  each challenge.

@group Kano Elements
@demo demo.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/neon-animation/animations/transform-animation.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;

                --paper-dialog-title: {
                    font-family: 'Bariol', sans-serif;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
            }
            :host paper-dialog {
                display: flex;
                flex-direction: row;

                border-radius: 3px;
                overflow: hidden;
                background: white;
            }
            :host .image {
                margin-top: 0px !important;
                width: 100px;

                display: flex;
                flex-direction: row;

                align-items: center;
                justify-content: center;

                font-family: 'Bariol', sans-serif;
                font-weight: bold;
            }
            :host .xp-num {
                background-color: var(--color-yellow);
            }
            :host .star {
                background-color: var(--color-grey-mid);
            }
            :host .star img {
                max-width: 80px;
            }
            :host .image .plus {
                font-size: 20px;
                margin-top: -5px;
                margin-right: -2px;
            }
            :host .image .amount {
                font-size: 50px;
            }
            :host .image .xp {
                font-size: 20px;
                margin-top: -5px;
            }
            :host .content {
                margin: 20px 40px 20px 0px !important;

                flex: 1;

                font-family: 'Bariol', sans-serif;
            }
            :host .content button {
                background-color: var(--color-green, green);
                @apply --kano-button;
                padding: 12px 50px;
                font-size: 14px;
                border-radius: 3px;
            }
            :host .content button:hover {
                background-color: var(--color-lighter-green);
            }
            :host .content h2:first-child {
                margin: 0;
            }
            :host .content .small-text {
                font-size: 16px;
                margin-bottom: 10px;
                line-height: 22px;
            }
        </style>
        <paper-dialog id="modal" opened="{{opened}}">
            <div class\$="image {{computeImageClass(xp)}}">
                <template is="dom-if" if="{{xp}}">
                    <div class="plus">+</div>
                    <div class="amount">{{xp}}</div>
                    <div class="xp">XP</div>
                </template>
                <template is="dom-if" if="{{!xp}}">
                    <img src="/assets/challenge-completed-star.svg" alt="Star">
                </template>
            </div>
            <div class="content">
                <h2>[[localize('CHALLENGE_COMPLETED','Challenge Completed')]]</h2>
                <div class="small-text">
                    [[compliment]] <span hidden\$="{{!xp}}">[[localize('XP_EARNED', "You've just earned")]] {{xp}} [[localize('XP','XP')]].</span>
                </div>
                <button class="next" on-tap="close">[[localize('GOT_IT','GOT IT')]]</button>
            </div>
        </paper-dialog>
`,

  is: 'kano-challenge-completed-modal',

  behaviors: [
      I18nBehavior
  ],

  properties: {
      xp: {
          type: Number,
          value: null
      },
      opened: {
          type: Boolean,
          observer: 'openedChanged',
          notify: true
      },
      compliment: {
          type: String,
          value: 'Nice work!'
      }
  },

  ready () {
      this.compliment = this.localize('COMPLIMENT','Nice work!');
      this.$.modal.animationConfig = {
          entry: {
              'name': 'transform-animation',
              node: this.$.modal,
              transofmOrigin: 'top',
              transformFrom: `translateY(${window.screen.height}px)`,
              transformTo: `none`,
              timing: {
                  duration: 400,
                  easing: 'cubic-bezier(0.245, 0.125, 0.280, 1)'
              }
          },
          exit: {
              'name': 'transform-animation',
              node: this.$.modal,
              transofmOrigin: 'top',
              transformFrom: `none`,
              transformTo: `translateY(${window.screen.height}px)`,
              timing: {
                  duration: 400,
                  easing: 'cubic-bezier(0.245, 0.125, 0.280, 1)'
              }
          }
      };
  },

  open () {
      this.$.modal.open();
      this.previouslyOpened = true;
  },

  close () {
      this.$.modal.close();
  },

  openedChanged (opened) {
      if (this.previouslyOpened && !opened) {
          this.previouslyOpened = false;
          this.fire('close');
      }
  },

  computeImageClass (xp) {
      return xp ? 'xp-num' : 'star';
  }
});
