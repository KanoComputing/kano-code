import '../../../../../../../@kano/kwc-style/part.js';
import '../../../../../../../@kano/web-components/kano-sound-player-behavior/kano-sound-player-behavior.js';
import { Polymer } from '../../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../../../@polymer/polymer/lib/utils/html-tag.js';
import { Base } from '../../../../scripts/kano/make-apps/parts-api/base.js';
import { UIBehavior } from '../../kano-ui-behavior.js';
/* globals Polymer, Kano */
function particle (_x, _y, _r, _dx, _dy, _color) {
    this.x = _x;
    this.y = _y;
    this.r = _r;
    this.dx = _dx;
    this.dy = _dy;
    this.color = _color;
}
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
                border-radius: 5px;
                overflow: hidden;
            }
            #canvas {
                margin: auto;
                width: 100%;
                height: 100%;
                background-color: #ddd;
            }
        </style>
        <!-- TODO FIXME Remove hardcoded values -->
        <canvas id="canvas" width="502" height="264"></canvas>
`,

  is: 'kano-part-fireworks',
  behaviors: [Base, UIBehavior, Kano.Behaviors.SoundPlayerBehavior],

  properties: {
      ctx: {
          type: Object,
          value: null
      },
      particles: {
          type: Array,
          value: []
      }
  },

  attached () {
      this.clicks = 0;
      this.ctx = this.$.canvas.getContext("2d");
      this.frameTick();
      // load sound after initialisation
      this.async(() => {
          this.loadSound('/assets/audio/sounds/pop.wav');
      }, 500);
  },

  enable (flag) {
      this.enabled = flag;

  },

  randomFireTick (enabled) {
      if (enabled) {
          this.fireTimes = 0;
          let bounds = this.$.canvas.getBoundingClientRect();
          let loopFirework = setInterval(() => {
              let x = Math.random() * bounds.width * (this.$.canvas.width / bounds.width),
                  y = Math.random() * bounds.width * (this.$.canvas.height / bounds.width)
              this.playSound('/assets/audio/sounds/pop.wav');
              this.generateParticles(x, y);
          }, 200);

          let loopInSecond = setInterval(() => {
              this.fireTimes++;
              if (this.fireTimes > 1) {
                  this.fire('fireworks-triggered');
                  window.clearInterval(loopInSecond);
                  window.clearInterval(loopFirework);
              }
          }, 1000);
          this.generateParticles(Math.random() * bounds.width * (this.$.canvas.width / bounds.width),
          Math.random() * bounds.width * (this.$.canvas.height / bounds.width));
      }
  },

  generateParticles (x, y) {
      for (let i = 0; i < 15; i++) {
          this.particles.push(new particle(
              x,
              y,
              Math.random() * 20,
              (Math.random() * 10) - 5,
              (Math.random() * 10) - 5,
              '#'+Math.floor(Math.random()*1777215 + 15000000).toString(16)
          ));
      }
  },

  draw () {
      for(let i = 0; i < this.particles.length; i++) {
          let p = this.particles[i];
          this.drawCircle(p.x, p.y, p.r, p.color);
      }
  },

  drawCircle (x, y, r, color) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      this.ctx.fillStyle = color;
      this.ctx.fill();
  },

  frameTick () {
      let view = this;
      window.requestAnimationFrame(this.frameTick.bind(this));
      for(let i = 0; i < this.particles.length; i++){
          let p = this.particles[i];
          p.x += p.dx;
          p.y += p.dy;
          if (p.r > 0.5) {
              p.r -= 0.5;
          } else {
              this.particles.splice(i, 1);
          }
      }
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.draw();
  }
});
