import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class KCFileUploadOverlay extends PolymerElement {
  static get template() {
    return html`
        <style>
            :host {
                @apply(--layout-vertical);
                @apply(--layout-center);
                @apply(--layout-center-justified);
                position: fixed;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: none;
                background-color: rgba(255, 255, 255, 0.75);
                box-sizing: border-box;
                overflow: hidden;
                text-align: center;
            }
            * {
                pointer-events: none;
            }
            #overlay-character {
                transform-origin: center bottom;
            }
            #overlay-text {
                opacity: 0;
                font-size: 32px;
                font-weight: 400;
            }
        </style>
        <p id="overlay-text">Drop a file here to load the app</p>
        <iron-image id="overlay-character" src="/assets/stories/locales/en-US/background_color/color-character.png" preload="" sizing="contain" width="300" height="400"></iron-image>
`;
  }

  static get is() { return 'kc-file-upload-overlay'; }
  animateDragEnter() {
      let overlay = this,
          character = this.$['overlay-character'],
          text = this.$['overlay-text'];

      overlay.style.display = 'flex';
      overlay.animate([{
          opacity: 0
      }, {
          opacity: 1
      }], {
          duration: 300,
          fill: 'forwards',
          easing: 'ease-in-out'
      });

      character.style.transformOrigin = 'center bottom';

      character.animate([{
          transform: 'translateY(100%) rotate(4deg)'
      },{
          transform: 'translateY(0%) rotate(0deg)'
      }], {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      });

      text.animate([{
          transform: 'translateY(100%)',
          opacity: 0
      },{
          transform: 'translateY(0%)',
          opacity: 1
      }], {
          duration: 400,
          delay: 600,
          easing: 'ease-out',
          fill: 'forwards'
      });
  }
  animateDragLeave() {
      let overlay = this,
          character = this.$['overlay-character'],
          text = this.$['overlay-text'],
          fadeOutConfig;

      fadeOutConfig = [[{
          opacity: 1
      },{
          opacity: 0
      }], {
          duration: 400,
          easing: 'ease-out',
          fill: 'forwards'
      }];

      text.animate.apply(text, fadeOutConfig);
      overlay.animate.apply(overlay, fadeOutConfig).onfinish = () => {
          overlay.style.display = 'none';
      };

      return character.animate([{
          transform: 'translateY(0%)'
      },{
          transform: 'translateY(100%)'
      }], {
          duration: 400,
          easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }).finished;

  }
  animateDrop() {
      let overlay = this,
          character = this.$['overlay-character'],
          text = this.$['overlay-text'],
          fadeOutConfig;

      fadeOutConfig = [[{
          opacity: 1
      },{
          opacity: 0
      }], {
          duration: 400,
          fill: 'forwards',
          easing: 'ease-out'
      }];

      text.animate.apply(text, fadeOutConfig);
      overlay.animate.apply(overlay, fadeOutConfig).onfinish = () => {
          overlay.style.display = 'none';
      };

      character.style.transformOrigin = 'center center';

      return character.animate([{
          transform: 'scale(1, 1)'
      },{
          transform: 'scale(0, 0)'
      }], {
          duration: 400,
          easing: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'
      }).finished;
  }
}

customElements.define(KCFileUploadOverlay.is, KCFileUploadOverlay);
