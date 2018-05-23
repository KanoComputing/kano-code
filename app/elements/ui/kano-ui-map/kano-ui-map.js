import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { WebCollidable } from '../../../scripts/kano/make-apps/parts-api/web-collidable.js';
import { Store } from '../../../scripts/kano/make-apps/store.js';
import '../../../../../../google-map/google-map.js';
import '../../../../../../@kano/kwc-style/part.js';
import { Polymer } from '../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../../@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano, google */

Polymer({
  _template: html`
        <style is="custom-style" include="part-style"></style>
        <style>
            :host {
                display: inline-block;
            }
            :host iron-image {
                border: 2px solid var(--color-primary);
            }
        </style>
        <!-- Add the map only when the Api Key is set -->
        <template is="dom-if" if="[[apiKey]]" restamp="">
            <google-map id="map" zoom="4" additional-map-options="[[mapOptions]]" latitude="[[position.latitude]]" longitude="[[position.longitude]]" api-key="[[apiKey]]" map="[[map]]" disable-default-ui="" disable-zoom="">
                <google-map-marker slot="markers" latitude="[[position.latitude]]" longitude="[[position.longitude]]" draggable="true"></google-map-marker>
            </google-map>
        </template>
`,

  is: 'kano-ui-map',
  behaviors: [WebCollidable, UIBehavior],

  properties: {
      coordinates: {
          type: Array,
          value: () => {
              return [];
          }
      }
  },

  observers: [
      'resizeMap(model.userStyle.*, apiKey)'
  ],

  ready () {
      const { config } = Store.getState();
      this.apiKey = config.GOOGLE_API_KEY;
      this.mapOptions = {
          draggable: false,
          scrollWheel: false
      };
  },

  showMarker (latitude, longitude) {
      let pos = { latitude, longitude },
          path;
      if (!this.poly) {
          this.poly = new google.maps.Polyline({
              path: [],
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
          });
          this.poly.setMap(this.map);
      }

      path = this.poly.getPath();
      path.push(new google.maps.LatLng(pos.latitude, pos.longitude));

      this.push('coordinates', pos);
      this.set('position', pos);
  },

  moveToRandom () {
      //random longitude between -180.00000 and 180.00000
      this.$$('#map').longitude = (-18000000 + Math.floor(Math.random() * (36000001))) / 100000;
      //random latitiude between -85.05115 and 85.00000
      this.$$('#map').latitiude = (-85.05115 + Math.floor(Math.random() * (179.94885))) / 100000;
  },

  setMapType (type) {
      this.$$('#map').mapType = type;
  },

  setMapZoom (zoom) {
      zoom = Math.max(1, Math.min(zoom, 100));
      //translate 1 - 100 to 1 - 20
      zoom = Math.max(1, Math.round(zoom / 5));
      this.$$('#map').zoom = zoom;
  },

  resizeMap () {
      this.async(() => {
          this.$$('#map').style = this.getPartialStyle(['width', 'height']);
          this.$$('#map').resize();
          this._updateCollisionSize();
      }, 10);
  },

  renderOnCanvas (ctx) {
      return UIBehavior.renderOnCanvas.apply(this, arguments).then(() => {
          let img,
              map = this.$$('#map'),
              width = map.offsetWidth,
              height = map.offsetHeight,
              x = 0,
              y = 0;
          
          ctx.fillStyle = '#dfdfdf';
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
          return;

          img = new Image();
          img.src = '/assets/part/map-icon.svg';

          return new Promise((resolve) => {
              img.onload = () => {
                  let aspectW = img.width / width,
                      aspectH = img.height / height;
                  if (aspectW > aspectH) {
                      y = height / 2;
                      height = img.height / aspectW;
                      y -= height / 2;
                  } else {
                      x = width / 2;
                      width = img.width / aspectH;
                      x -= width / 2;
                  }
                  ctx.drawImage(img, x, y, width, height);
                  ctx.stroke();
                  ctx.restore();
                  resolve();
              };
              img.onerror = () => {
                  resolve(UIBehavior.renderFallback.apply(this, arguments));
              };
          });
      });
  }
});
