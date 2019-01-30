import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                visibility: hidden;
                border: 2px solid #a6fbff;
                border-radius: 4px;
                @apply(--shadow-elevation-4dp);
                position: fixed;
                top: 0px;
                left: 0px;
                padding: 7px;
                box-sizing: border-box;
                pointer-events: none;
            }
        </style>
`,

  is: 'kano-highlight',

  properties: {
      x: {
          type: Number,
          value: 0
      },
      y: {
          type: Number,
          value: 0
      },
      width: {
          type: Number,
          value: 50
      },
      height: {
          type: Number,
          value: 50
      }
  },

  observers: [
      '_update(x, y, width, height)'
  ],

  attached() {
      this.animationSupported = 'animate' in HTMLElement.prototype;
  },

  ready () {
      this.hidden = true;
  },

  _update () {
      this.style.width = `${this.width + 14}px`;
      this.style.height = `${this.height + 14}px`;
  },

  show () {
      this.style.visibility = 'visible';
      this._pause();
      if (this.animationSupported) {
          this.animation = this.animate([{
              transform: `translate(${this.x - 7}px, ${this.y - 7}px) scale(4)`,
              opacity: 0
            },{
                transform: `translate(${this.x - 7}px, ${this.y - 7}px)`,
                opacity: 1
            }], {
                duration: 200,
                fill: 'forwards',
                easing: 'ease-in-out'
            });
        } else {
            this.style.opacity = 1;
            this.style.transform = `translate(${this.x - 7}px, ${this.y - 7}px)`;
        }
      this.hidden = false;
  },

  hide () {
      if (this.hidden) {
          return;
      }
      if (this.animationSupported) {
      this._pause();
        this.animation = this.animate([{
            transform: `translate(${(this.x - 5) || 0}px, ${(this.y - 5) || 0}px)`,
            opacity: 1
        },{
            transform: `translate(${(this.x - 5) || 0}px, ${(this.y - 5) || 0}px) scale(4)`,
            opacity: 0
        }], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-in-out'
        });

        this.animation.finished.then(() => {
            this.style.visibility = 'hidden';
        });
    } else {
        this.style.opacity = 0;
        this.style.transform = `translate(${(this.x - 5) || 0}px, ${(this.y - 5) || 0}px) scale(4)`;
        this.style.visibility = 'hidden';
      }
      this.hidden = true;
  },

  _pause () {
      if (this.animation) {
          this.animation.pause();
      }
  }
});
