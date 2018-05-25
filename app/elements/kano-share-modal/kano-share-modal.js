import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/web-components/kano-lightboard-preview/kano-lightboard-preview.js';
import '@kano/kwc-style/input.js';
import { CoverGeneratorBehavior } from '../behaviors/kano-cover-generator-behavior.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import '../kano-app-player/kano-app-player.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { BlockAnimation } from '../../scripts/splash.js';

/* globals Polymer, Kano */
Polymer({
  _template: html`
        <style include="input-text">
            :host {
                position: relative;
                @apply --layout-horizontal;
                font-family: var(--font-body);
                background: var(--color-black);
                color: white;
                --section-padding: 32px;
                width: 1000px;
                height: 500px;
            }
            .header {
                position: absolute;
                @apply --layout-horizontal;
                @apply --layout-center;
                color: white;
                top: 32px;
                left: 32px;
                font-size: 14px;
                letter-spacing: 0.3px;
            }
            .header iron-icon {
                --iron-icon-fill-color: var(--color-chateau);
                --iron-icon-width: 32px;
                --iron-icon-height: 32px;
                transform: scale(-1, 1);
            }
            .dismiss {
                position: absolute;
                @apply --layout-horizontal;
                @apply --layout-center;
                top: 28px;
                right: 28px;
                background: transparent;
                color: var(--color-chateau);
                font-size: 14px;
                z-index: 1;
            }
            .dismiss iron-icon {
                background: var(--color-chateau);
                border-radius: 4px;
                --iron-icon-fill-color: white;
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                margin-left: 12px;
                padding: 10px;
            }
            .options {
                @apply --layout-vertical;
                background: var(--color-abbey);
                padding: var(--section-padding);
                width: 40%;
            }
            .options>iron-pages {
                @apply --layout-flex;
                @apply --layout-vertical;
            }
            .options>iron-pages>* {
                @apply --layout-flex;
            }
            .gif-creation-header {
                @apply --layout-flex;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .gif-creation-header span,
            .saving span {
                margin: 16px 0px;
                font-size: 20px;
            }
            .preview {
                position: relative;
                background: var(--color-black);
                width: 60%;
            }
            .preview iron-pages,
            .preview iron-pages>* {
                height: 100%;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .preview iron-pages>* {
                height: 100%;
                width: 100%;
            }
            .app-preview {
                margin: var(--section-padding);
                width: 420px;
                height: 280px;
            }
            button {
                border: none;
                outline: none;
                font-weight: bold;
                cursor: pointer;
                text-transform: uppercase;
                color: white;
                font-family: var(--font-body);
                font-size: 16px;
            }
            button[disabled],
            button:hover[disabled] {
                opacity: 0.7;
                background: transparent;
                cursor: default;
            }
            button.change-gif {
                color: white;
                padding: 12px;
                border-radius: 24px;
                margin-bottom: 12px;
                background: var(--color-abbey);
            }

            form {
                @apply --layout-vertical;
                @apply --layout-center-justified;
                padding-top: 64px;
            }

            #title_input {
                margin-bottom: 20px;
            }

            form textarea {
                @apply --layout-flex;
                margin-bottom: 8px;
                resize: none;
            }

            form input[type="text"],
            form textarea {
                color: white;
                border: 1px solid transparent;
                background: var(--color-chateau);
                box-shadow: none;
                width: 100%;
            }

            form input[type="text"]::-webkit-input-placeholder { text-transform: none; }
            form input[type="text"]::-moz-placeholder { text-transform: none; }
            form input[type="text"]:-ms-input-placeholder { text-transform: none; }
            form input[type="text"]:-moz-placeholder { text-transform: none; }

            .share-button {
                width: 100%;
                text-transform: uppercase;
                border-radius: 4px;
                padding: 9px;
                background: var(--color-chateau);
            }

            button.round {
                border-radius: 50px;
                padding: 9px 25px;
                margin-bottom: 24px;
            }

            .save-button,
            .next,
            .close {
                background: var(--color-grassland);
                @apply --layout-self-center;
                transition: background 150ms;
            }

            .save-button:hover,
            .next:hover,
            .close:hover {
                background: var(--color-apple);
            }

            form hr {
                width: 100%;
                border: 0px;
                height: 1px;
                background: var(--color-black);
                margin: 14px 0px 14px;
            }

            .composed-button {
                @apply --layout-horizontal;
            }

            .composed-button button {
                border: 0px;
                border-radius: 4px;
                border-bottom-left-radius: 0px;
                border-top-left-radius: 0px;
                background: var(--color-black);
                text-transform: none;
                padding: 7px 20px;
            }

            .composed-button input[type="text"] {
                @apply --layout-flex;
                border: 0px;
                border-radius: 4px;
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
                margin-bottom: 0px;
                color: white;
                background: var(--color-black);
                padding-right: 0px;
                font-family: var(--font-body);
            }

            .saving {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }

            .blocks {
                width: 80px;
                height: 80px;

                display: flex;
                flex-direction: column;

                animation: fade-in .3s;
                transition-timing-function: ease-in;
            }

            .line {
                width: 100%;

                transform-origin: center;

                display: flex;
            }

            .block {
                opacity: 1;
                border-radius: 1px;

                background-color: rgba(0,0,0,0.5);

                margin: 2px;
                width: 10px;
                height: 8px;
            }

            @keyframes splash-block-pop-in {
                0% { transform: scale(0, 1); opacity: 0.5; }
                90% { transform: scale(1.1, 1); opacity: 1.0; }
                100% { transform: scale(1, 1); }
            }

            .last {
                animation: splash-block-pop-in .2s;
                transform-origin: left;
                transition-timing-function: ease-in;
            }

            .dialog button {
                @apply --kano-button;
            }
            button {
                cursor: pointer;
            }
            button.share {
                text-transform: none;
                background-color: #ff842a;
                border: none;
                outline: none;
                color: white;
                padding: 12px;
                cursor: pointer;
                border-radius: 24px;
                margin-bottom: 12px;
            }
            .social-share-container {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                margin-right: 8px;
            }
            .social-share-container a,
            .social-share-container iron-image {
                width: 25px;
                height: 25px;
                border-radius: 2px;
            }
            .social-share-container a {
                margin-left: 6px;
            }
            :host button .button-img {
                width: 25px;
                vertical-align: middle;
                margin-right: 10px;
                text-shadow: 0px 1.5px rgba(0, 0, 0, 0.25);
            }
            .preview iron-image.cover {
                width: 420px;
                height: 100%;
            }
            .success,
            .success .actions {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            .success {
                @apply --layout-around-justified;
            }
            .success iron-icon {
                --iron-icon-width: 62px;
                --iron-icon-height: 62px;
            }
            .success .title, .fail .title {
                font-size: 20px;
                margin-bottom: 4px;
            }
            .instructions span {
                color: var(--color-stone);
                font-size: 16px;
                line-height: 21px;
            }
            .success .composed-button {
                @apply --layout-self-stretch;
            }
            .fail {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .fail .title {
                text-transform: uppercase;
            }
            .fail button {
                background: var(--color-cinnabar);
                border-radius: 50px;
                padding: 9px 32px;
                font-weight: bold;
                transition: background 150ms;
            }
            .fail button:hover {
                background: var(--color-flamingo);
            }
            .instructions {
                @apply --layout-vertical;
                @apply --layout-center;
                font-size: 14px;
                margin-bottom: 24px;
            }
            .success .instructions {
                margin: 0px;
            }
            label {
                font-size: 20px;
                display: block;
                margin-bottom: 2px;
                color: #6e6e6e;
            }
            .gif-creation {
                @apply --layout-vertical;
                @apply --layout-center;
                position: relative;
            }
            *[hidden] {
                display: none !important;
            }
            .cover-preview {
                @apply --layout-vertical;
                @apply --layout-start;
            }
            .generate-url button {
                padding: 12px;
                background-color: var(--color-blue, blue);
                text-transform: none;
                border-radius: 24px;
            }
            :host .loading-overlay {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 100%;
                height: 100%;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            paper-spinner-lite {
                --paper-spinner-color: white;
            }
            .preview-wrapper {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
                margin: auto;
                position: relative;
                height: 100%;
            }
            .change-gif-container {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
                opacity: 0;
                transition: opacity ease-in-out 70ms;
                cursor: pointer;
            }
            .change-gif-container:hover {
                opacity: 1;
            }
            .social-share-container button.social {
                background-color: transparent;
                padding: 0px;
                border-radius: 0px;
                margin: 4px;
                border: 0px;
            }
            .generate-url-container[hidden] {
                display: block !important;
                visibility: hidden;
            }
            .app-player-container {
                height: 100%;
            }
        </style>
        <button class="dismiss" on-tap="dismiss">
            <span>[[localize('CLOSE', 'Close')]]</span>
            <iron-icon icon="clear"></iron-icon>
        </button>
        <div class="header" hidden\$="[[_isHeaderHidden(_page)]]">
            <iron-icon icon="reply"></iron-icon>
            <span>[[localize('SAVING', 'Saving')]]</span>
        </div>
        <section class="options">
            <iron-pages id="options-pager" selected="[[_page]]" attr-for-selected="name">
                <form class="form" name="sharing-form">
                    <input type="text" id="title_input" value="{{shareInfo.title::change}}" placeholder="Title" disabled\$="[[autosharing]]" autofocus="">
                    <textarea rows="4" cols="40" value="{{shareInfo.description::change}}" placeholder="Description" disabled\$="[[autosharing]]"></textarea>

                    <hr>

                    <div class="generate-url-container" hidden\$="[[recording]]">
                        <button hidden\$="[[shareInfo.slug]]" disabled\$="[[loading]]" on-tap="_socialShareLink" class="share-button" type="button">
                            <img src="/assets/get-share-link.svg">
                            <span>[[localize('GET_SHARE_LINK', 'Get share link')]]</span>
                        </button>
                        <div class="loading-overlay" hidden\$="[[!loading]]">
                            <paper-spinner-lite active="[[loading]]"></paper-spinner-lite>
                        </div>
                    </div>

                    <div class="composed-button" hidden\$="[[!shareInfo.slug]]">
                        <input type="text" id="shareurl" value="[[playUrl(shareInfo.slug)]]">
                        <button on-tap="copyToClipboard" type="button">[[localize('COPY', 'copy')]]</button>
                    </div>

                    <hr>

                    <button type="button" name="button" class="save-button round" on-tap="_shareOnKW" disabled\$="[[recording]]">[[_computeSaveButtonLabel(recording)]]</button>

                    <div class="generate-url">
                        <div class="social-share-container" hidden="">
                            <button type="button" class="social" on-tap="_socialShareFacebook">
                                <iron-image src="/assets/social-icons/facebook.png" sizing="contain"></iron-image>
                            </button>
                            <button type="button" class="social" on-tap="_socialShareTwitter">
                                <iron-image src="/assets/social-icons/twitter.png" sizing="contain"></iron-image>
                            </button>
                        </div>
                    </div>
                </form>
                <div id="saving-process" class="saving" name="saving">
                    <div class="blocks" id="gif-creation-blocks"></div>
                    <span>[[localize('Saving', 'Saving')]]…</span>
                </div>
                <div class="fail" name="failure">
                    <div class="title">[[localize('SAVING_FAILED', 'Saving failed')]]</div>
                    <div class="instructions">
                        <span>[[localize('TRY_LATER', 'Please try again later.')]]</span>
                    </div>
                    <button on-tap="dismiss" type="button">[[localize('UNFORTUNATE', 'This is unfortunate')]]</button>
                </div>
                <div name="success" class="success">
                    <iron-icon src="/assets/icons/success.svg"></iron-icon>
                    <div class="instructions">
                        <h2>[[localize('SAVED', 'Saved')]]</h2>
                        <span>[[localize('APP_IS_STORED', 'Your app is safely stored in \\'My Creations\\'.')]]</span>
                        <span>[[localize('WANT_TO_SHARE', 'Want to share it with your friends?')]]</span>
                    </div>
                    <div class="composed-button" hidden\$="[[!shareInfo.slug]]">
                        <input type="text" id="shareurl" value="[[playUrl(shareInfo.slug)]]">
                        <button on-tap="copyToClipboard" type="button">[[localize('COPY', 'copy')]]</button>
                    </div>
                    <div class="actions">
                        <button hidden\$="[[nextHidden]]" type="button" class="next round" on-tap="_nextStory">[[nextButtonLabel]]</button>
                        <button hidden\$="[[shareInfo.autoshare]]" class="close round" type="button" on-tap="dismiss">[[localize('CLOSE', 'Close')]]</button>
                        <div class="social-share-container" hidden="">
                            <button type="button" class="social" on-tap="_socialShareFacebook">
                                <iron-image src="/assets/social-icons/facebook.png" sizing="contain"></iron-image>
                            </button>
                            <button type="button" class="social" on-tap="_socialShareTwitter">
                                <iron-image src="/assets/social-icons/twitter.png" sizing="contain"></iron-image>
                            </button>
                        </div>
                    </div>
                </div>
            </iron-pages>
        </section>
        <section class="preview">
            <iron-pages selected="[[previewPage]]" attr-for-selected="name">
                <div class="gif-creation" name="app-preview">
                    <kano-app-player id="app-preview" class="app-preview" component-content="[[shareInfo.app.component]]" slug="[[shareInfo.app.slug]]"></kano-app-player>
                </div>
                <div name="cover">
                    <div class="app-player-container">
                        <div class="preview-wrapper">
                            <iron-image class="cover" src="[[gifSrc]]" preload="" fade="" sizing="contain" hidden\$="[[spriteSrc]]"></iron-image>
                            <kano-lightboard-preview class="cover" width="420" src="[[spriteSrc]]" hidden\$="[[!spriteSrc]]"></kano-lightboard-preview>
                            <div class="change-gif-container" on-tap="_changeGif">
                                <button class="change-gif" type="button">← [[localize('MAKE_ANOTHER', 'Make another gif')]]</button>
                            </div>
                        </div>
                    </div>
                </div>
            </iron-pages>
        </section>
`,

  is: 'kano-share-modal',
  behaviors: [CoverGeneratorBehavior, I18nBehavior],

  properties: {
      shareInfo: {
          type: Object,
          value: function () {
              return {};
          },
          notify: true
      },
      appData: {
          type: String,
          value: ''
      },
      appSlug: {
          type: String,
          value: ''
      },
      loading: {
          type: Boolean,
          value: false,
          observer: 'loadingChanged'
      },
      worldUrl: {
          type: String,
          value: 'https://world.kano.me'
      },
      isAuthenticated: {
          type: Boolean,
          value: false
      },
      inChallenge: {
          type: Boolean,
          value: false
      },
      nextButtonLabel: {
          type: String,
          value: 'Next Challenge'
      },
      opened: {
          type: Boolean,
          observer: '_openChanged'
      },
      previewPage: {
          type: String,
          computed: '_computePreviewPage(gifSrc, spriteSrc)'
      },
      gifSrc: {
          type: String,
          value: null
      },
      spriteSrc: {
          type: String,
          value: null
      },
      recording: {
          type: Boolean,
          value: true
      }
  },

  observers: [
      '_shareSlugChanged(shareInfo.slug)',
      '_pageChanged(shareInfo.page)',
      '_updateUI(shareInfo.*, inChallenge)',
      '_shareAttributesChanged(shareInfo.*)'
  ],

  _isHeaderHidden (page) {
      return page === 'success';
  },

  _computePreviewPage (gif, sprite) {
      if (!!gif || !!sprite) {
          return 'cover';
      }
      return 'app-preview';
  },

  _computeSaveButtonLabel (recording) {
      if (recording) {
          return this.localize('RECORDING', 'Recording') + '...';
      }
      return this.localize('SAVE', 'Save');
  },

  _pageChanged (page, prevPage) {
      let oldPageEl = this.$['options-pager'].querySelector('.iron-selected'),
          animationPromise;
      if (oldPageEl) {
          animationPromise = new Promise((resolve, reject) => {
              oldPageEl.animate({
                  opacity: [1, 0]
              }, {
                  duration: 300,
                  easing: 'ease-out'
              }).onfinish = resolve;
          });
      } else {
          this._page = page;
          return;
      }
      animationPromise.then(() => {
          let newPageEl;
          this._page = page;
          if (this.splash) {
              this.splash.cancel();
          }
          if (page === 'saving') {
              let container = this.$['options-pager'].querySelector(`.iron-selected #gif-creation-blocks`);
              this.splash = new BlockAnimation(container);
              this.splash.init();
          }
          newPageEl = this.$['options-pager'].querySelector('.iron-selected');
          if (newPageEl) {
              animationPromise = new Promise((resolve, reject) => {
                  newPageEl.animate({
                      opacity: [0, 1]
                  }, {
                      duration: 300,
                      easing: 'ease-out'
                  }).onfinish = resolve;
              });
          } else {
              animationPromise = Promise.resolve();
          }
          return animationPromise;
      });
  },

  _shareSlugChanged (newValue, oldValue) {
      if (newValue && !oldValue) {
          this.loading = false;
          if (this.socialTarget && this.socialTarget !== 'link') {
              this._externalShare();
          }
      }
  },

  _externalShare () {
      let socialConfig = this.socialConfigs[this.socialTarget];
      this.popup.location.href = socialConfig.generateUrl(this.playUrl(), this.shareInfo.title);
      this.fire('ga-tracking-event', {
          event: 'worldExternalShare'
      });
      this.fire('tracking-event', {
          name: 'shared_external',
          data: {
              medium: this.socialTarget
          }
      });
  },

  _checkTitleInput () {
      if (!this.shareInfo.title || this.shareInfo.title.length < 1) {
          this.$.title_input.placeholder = "Please add a title";
          this.$.title_input.select();
      } else {
          return true;
      }
  },

  socialConfigs: {
      'facebook': {
          width: 550,
          height: 269,
          generateUrl (url, title) {
              return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(url)}`;
          }
      },
      'twitter': {
          width: 550,
          height: 285,
          generateUrl (url, title) {
              let text = `I just coded ${title} with @TeamKano – check it out: ${url}`;
              return `https://twitter.com/intent/tweet?source=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
          }
      }
  },

  attached() {
      //FIXME social share buttons are hidden
      //TODO implement social sharing in a way that would work in an Electron environment
      this.addEventListener('app-ready', this._onAppReady);
  },

  dismiss() {
      this.fire('dismiss');
      this.fire('tracking-event', {
          name: 'share_dialog_closed'
      });
  },

  loadingChanged() {
      this.toggleClass('loading', this.loading);
  },

  playUrl() {
      return `${this.worldUrl}/shared/${this.shareInfo.slug}`;
  },

  _changeGif() {
      let appPreview = this.$['app-preview'];
      this.gifSrc = null;
      this.spriteSrc = null;
      // Force a change on the src to reload the app from the beginning
      appPreview.componentContent = null;
      appPreview.componentContent = this.shareInfo.app.component;
  },

  _resetCoverGenerator() {
      this.$['app-preview'].stop();
      this.gifProgress = this.gifRenderProgress = this.waitingFrame = 0;
      this.recording = false;
  },

  _onAppReady() {
       /* setTimeout required on Safari */
      setTimeout(this._generateAppGif.bind(this), 0);
  },

  _generateAppGif() {
      let workspace = this.$['app-preview'].getWorkspace(),
          parts = Object.keys(this.$['app-preview'].component.parts).map(key => {
              return this.$['app-preview'].component.parts[key];
          }),
          sharingConfig = this.shareInfo.mode.sharing,
          FPS = 9,
          LENGTH = 30;

      this.recording = true;

      this.spriteSrc = null;

      if (sharingConfig.cover === 'still') {
          if (sharingConfig.spritesheet) {
              if (this.shareInfo.animation) {
                  p = this.generateAnimationSpriteSheet(this.shareInfo.animation);
              } else {
                  p = this.generateAppSpriteSheet(workspace, FPS, 4)
              }
              p.then((url) => {
                  let data = url.split(',').pop(),
                      spriteSheetBlob = this.base64toBlob(data, 'image/png');

                  this.shareInfo.spriteSheetBlob = spriteSheetBlob;
                  this.spriteSrc = URL.createObjectURL(spriteSheetBlob);

                  return this.generateCover(workspace,
                              parts,
                              workspace.width,
                              workspace.height,
                              1,
                              sharingConfig.padding,
                              sharingConfig.color);
              })
              .then(canvas => {
                  let image = new Image(),
                      base64Data,
                      blob;
                  image.src = canvas.toDataURL();
                  base64Data = image.src.split(',').pop(),
                  blob = this.base64toBlob(base64Data, 'image/png');
                  this.gifSrc = image.src;
                  this.shareInfo.coverBlob = blob;
                  this.fire('cover-generated');
                  // Reset for potential future gif-creation
                  this._resetCoverGenerator();
              });
          } else {
              this.waitingFrame = 0;
              this.gifRenderProgress = 0;
              // Simulate gif recording
              this.gifLoop = setInterval(_ => {
                  // Fake frame increment
                  this.waitingFrame++;
                  // Let the user know the progress state
                  this.gifRenderProgress += (100 / LENGTH);
                  // Clear interval if interrupted
                  if (this.interrupted) {
                      clearInterval(this.gifLoop);
                  }
                  // The number of fake frames hit the limit
                  if (this.waitingFrame > LENGTH) {
                      clearInterval(this.gifLoop);
                      // Generate the still cover
                      this.generateCover(workspace,
                                  parts,
                                  workspace.width,
                                  workspace.height,
                                  1,
                                  sharingConfig.padding,
                                  sharingConfig.color)
                          .then(canvas => {
                              let image = new Image(),
                                  base64Data,
                                  blob;
                              image.src = canvas.toDataURL();
                              base64Data = image.src.split(',').pop(),
                              blob = this.base64toBlob(base64Data, 'image/png');
                              this.gifSrc = image.src;
                              this.shareInfo.coverBlob = blob;
                              this.fire('cover-generated');
                              // Reset for potential future gif-creation
                              this._resetCoverGenerator();
                          });
                  }
              }, 1000 / FPS);
          }
      } else {
          this._generateGifCover(workspace, parts, 0.75, sharingConfig.padding, sharingConfig.color, FPS, LENGTH).then(blob => {
              let url = URL.createObjectURL(blob);
              this.gifSrc = url;
              this.shareInfo.coverBlob = blob;
              this.$['app-preview'].stop();
              this.fire('cover-generated');
              // Reset for potential future gif-creation
              this._resetCoverGenerator();
          });
      }
  },

  _generateUrl () {
      if (this.isAuthenticated) {
          this.loading = true;
      }
      this.shareInfo.is_private = true;
      this.fire('confirm');
  },

  _shareOnKW () {
      if (this._checkTitleInput()) {
          this.shareInfo.is_private = false;
          this.fire('confirm', {
              share: true
          });
          this.fire('ga-tracking-event', {
              event: 'worldInternalShare'
          });
      }
  },

  copyToClipboard (e) {
      const target = e.path ? e.path[0] : e.target,
            parent = target.parentNode,
            input = parent.querySelector('input');
      if (!input) {
          return;
      }
      input.select();
      document.execCommand('copy');
      this.fire('tracking-event', {
          name: 'share_link_copied'
      });
  },

  _socialShareTwitter () {
      this._socialShare('twitter');
  },

  _socialShareFacebook () {
      this._socialShare('facebook');
  },

  _socialShareLink () {
      this._socialShare('link');
      this.fire('tracking-event', {
          name: 'share_link_clicked'
      });
  },

  _socialShare (socialTarget) {
      if (!this._checkTitleInput()) {
          return;
      }
      this.socialTarget = socialTarget;
      if (this.shareInfo.slug) {
          this._preparePopup(false);
          this._externalShare();
      } else {
          if (socialTarget !== 'link' && this.isAuthenticated) {
              this._preparePopup(true);
          }
          this._generateUrl();
      }
  },

  _preparePopup (loading) {
      let socialConfig = this.socialConfigs[this.socialTarget],
          //split screen scenario
          dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
          dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top,

          width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
          height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,

          winLeft = ((width / 2) - (socialConfig.width / 2)) + dualScreenLeft,
          winTop = ((height / 2) - (socialConfig.height / 2)) + dualScreenTop,

          url = loading ? `${location.protocol}//${location.host}/loading-share.html` : '';

      this.popup = window.open("", 'sharer', `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${socialConfig.width},height=${socialConfig.height}`);
      this.popup.document.write("<p>Fetching your link...</p>")
  },

  _updateUI () {
      this.autosharing = this.shareInfo && this.shareInfo.autoshare;
      this.nextHidden = !this.autosharing || !this.inChallenge;
  },

  _nextStory () {
      this.fire('next-story');
  },

  _openChanged(opened, wasOpened) {
      if (opened) {
          // Force a change on the src to reload the app from the beginning
          this.$['app-preview'].componentContent = null;
          this.$['app-preview'].componentContent = this.shareInfo.app.component;
          this.fire('tracking-event', {
              name: 'share_dialog_opened'
          });
      } else if (!opened && wasOpened) {
          this.interrupted = true;
          this.gifSrc = null;
          this.spriteSrc = null;
          this.loading = false;
          this._resetCoverGenerator();
      }
  },

  _shareAttributesChanged (shareInfo) {
      let changesToTrack = {
          'shareInfo.title': 'share_title_changed',
          'shareInfo.description': 'share_description_changed'
      }
      if (shareInfo && shareInfo.path && changesToTrack[shareInfo.path]) {
          this.fire('tracking-event', {
                name: changesToTrack[shareInfo.path]
          });
      }
  }
});