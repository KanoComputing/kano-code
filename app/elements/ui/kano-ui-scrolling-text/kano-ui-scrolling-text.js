import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
import '@kano/kwc-style/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano */

Polymer({
  _template: html`
        <style is="custom-style" include="part-style"></style>
        <style>
            :host {
                display: inline-block;
            }
            :host .container {
                overflow: hidden;
                position: relative;
                border: 1px solid transparent;
            }
            :host #label {
                white-space: nowrap;
                position: absolute;
                top: -2%;
            }
        </style>
        <div id="container" class="container" style\$="[[computeContainerStyle(model.userStyle.*, isRunning)]]">
            <span id="label" style\$="[[computeLabelStyle(model.userStyle.*)]]">
                {{model.userProperties.text}}
            </span>
        </div>
`,

  is: 'kano-ui-scrolling-text',
  behaviors: [Base, UIBehavior],

  ready () {
      this.stack = [];
      this.scrolling = false;
  },

  stop () {
      Base.stop.apply(this, arguments);
      this.stack = [];
      clearTimeout(this.nextTimeout);
      this.scrolling = false;
  },

  computeLabelStyle () {
      let style = this.getPartialStyle(['color', 'font-family']);
      style += `font-size: ${this.model.userStyle.height};`;
      style +=  `line-height: calc(${this.model.userStyle.height} * 0.8);`;
      return style;
  },

  computeContainerStyle () {
      let style = this.getPartialStyle(['width', 'height']);
      style += this.isRunning ? '' : 'border: 1px dashed lightgrey';
      return style;
  },

  scroll (value) {
      this.stack.push(value);
      if (!this.scrolling) {
          this.scrollNext();
      }
  },

  scrollNext () {
      let value = this.stack.shift(),
          rect,
          left,
          duration;
      if (!value) {
          this.scrolling = false;
          return;
      }
      this.scrolling = true;
      this.set('model.userProperties.text', value);
      this.$.label.style.transition = 'none';
      this.$.label.style.left = '100%';
      // Get the bounding rect of the label, but also triggers a layout on the browser
      // that will update the transitions
      rect = this.$.label.getBoundingClientRect();
      duration = rect.width / rect.height * 300;
      left = rect.width + this.$.container.getBoundingClientRect().width;
      this.$.label.style.transition = `left linear ${duration}ms`;
      this.$.label.style.left = `-${left}px`;
      this.nextTimeout = setTimeout(() => {
          this.scrollNext();
      }, duration);
  },

  renderOnCanvas (ctx, util) {
      return UIBehavior.renderOnCanvas.apply(this, arguments).then(() => {
          let text = this.model.userProperties.text,
              color = this.model.userStyle.color,
              label = this.$.label;

          ctx.textAlign = 'start';
          ctx.textBaseline = 'top';
          ctx.font = `${util.getStyle(label, 'font-size')} ${util.getStyle(label, 'font-family')}`;
          ctx.fillStyle = color;
          ctx.fillText(text, 0, 0);
          ctx.stroke();
          ctx.restore();
      });
  }
});
