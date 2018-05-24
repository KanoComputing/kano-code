/**
@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@kano/kwc-icons/kwc-icons.js';
import '../kano-app-player-toolbar/kano-app-player-toolbar.js';
import { Utils } from '../../scripts/kano/make-apps/utils.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style>
            :host([layout="vertical"]) {
                @apply --layout-vertical-reverse;
                @apply --layout-center;
            }
            :host([layout="horizontal"]) {
                padding: 16px 60px;
                position: relative;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            :host .user-app {
                @apply --layout-flex;
                @apply --layout-self-stretch;
                height: 100%;
                width: 100%;
            }
            :host(.fullscreen) {
                padding: 5vh 16px;
                position: fixed;
                top: 0px;
                left: 0px;
                max-width: 100%;
                width: 100%;
                height: 100%;
                z-index: 100;
                background-color: var(--color-chateau);
            }
            :host([layout="horizontal"].fullscreen) {
                @apply --layout-vertical-reverse;
                @apply --layout-justified;
                @apply --layout-center;
            }
            :host(.fullscreen) .user-app {
                width: 60%;
                height: 40%;
                margin: auto;
            }
            :host(.fullscreen) kano-app-player-toolbar {
                margin: 0 auto 40px auto;
                width: 40%;
            }
            :host(.fullscreen) .close {
                cursor: pointer;
                color: var(--color-porcelain);
                height: 16px;
                position: absolute;
                right: 20px;
                top: 20px;
                width: 16px;
            }
            #container {
                @apply(--layout-vertical);
                @apply(--layout-flex);
                @apply(--layout-center);
                @apply(--layout-center-justified);
                position: relative;
                height: calc(100% - 40px);
            }
            h1.error {
                color: var(--color-red, red);
            }
            :host([layout="vertical"]) kano-app-player-toolbar {
                width: 100%;
            }
            :host([layout="horizontal"]) kano-app-player-toolbar {
                position: absolute;
                right: 0;
                top: 8%;
                z-index: 10;
            }
            :host([layout="horizontal"].fullscreen) kano-app-player-toolbar {
                position: relative;
            }
            :host *[hidden] {
                display: none !important;
            }
        </style>
        <div id="container">
            <template is="dom-if" if="{{failed}}">
                <h1 class="error">Something went wrong :(</h1>
                <div>The app just won't run, will it?</div>
            </template>
        </div>
        <template is="dom-if" if="{{showToolbar}}">
            <iron-icon class="icon close" hidden\$="[[!fullscreen]]" icon="kano-icons:close" on-tap="_toggleFullscreen"></iron-icon>
            <kano-app-player-toolbar layout="[[toolbarLayout]]" running="[[running]]" on-run-button-clicked="_toggleRunning" on-reset-button-clicked="_reset" on-fullscreen-button-clicked="_toggleFullscreen"></kano-app-player-toolbar>
        </template>
        <template is="dom-if" if="{{showHardware}}">
            Hardware
        </template>
`,

  is: 'kano-app-player',

  properties: {
      src: {
          type: String,
          observer: '_srcChanged'
      },
      componentContent: {
          type: String,
          observer: '_componentContentChanged'
      },
      slug: {
          type: String
      },
      failed: {
          type: Boolean,
          value:false
      },
      fullscreen: {
          type: Boolean,
          value: false
      },
      layout: {
          type: String,
          value: 'vertical',
          reflectToAttribute: true
      },
      showToolbar: {
          type: Boolean,
          value: false
      },
      running: {
          type: Boolean,
          value: false
      },
      toolbarLayout: {
          type: String,
          computed: '_toolbarLayout(layout, fullscreen)'
      }
  },

  _srcChanged() {
      // Check that we are loading an html file. Inspecting the extension is not the best solution
      // as any server could return html content. This prevents loading of late setups bindings. For
      // example, Vue.js will set the property to {{item.attachment_url}} a few times before applying the binding
      if (!this.src || !/(.*\.html)|(data:text\/html;base64,.*)/.test(this.src)) {
          return;
      }
      this.debounce('importApp', () => {
          this.importHref(this.src, this._onAppFileLoad.bind(this), this._onAppFileError.bind(this));
      });
  },

  _componentContentChanged() {
      const content = this.componentContent;
      this.debounce('appendApp', () => {
          if (!this.componentContent) {
              return;
          }
          const parser = new DOMParser();
          const doc = parser.parseFromString(this.componentContent, 'text/html');

          // The script is copied and attached separately to make sure it runs
          const script = doc.getElementsByTagName('script')[0];
          const scriptCopy = document.createElement('script');
          scriptCopy.innerHTML = script.innerHTML;
          document.head.appendChild(doc.body.firstChild);
          document.head.appendChild(scriptCopy);
          this._onAppFileLoad();
      });
  },

  _onAppFileLoad() {
      let root = dom(this.root),
          c, styleElm;
      // Create the component. Older shares were generated with the tagName `kano-user-component`
      try {
          c = this.create(`kano-${this.slug}`);
          if (c.constructor === HTMLElement) {
              throw new Error('Element not registered');
          }
      } catch (e) {
          c = this.create('kano-user-component');
      }
      c.className = 'user-app kano-app-player';
      // Support apps exported with error
      c.$$ = function (id) {
          if (['#light', '#camera', '#normal', '#dropzone'].indexOf(id) !== -1 && this.$.screen) {
              return this.$.screen;
          }
          return dom(this.root).querySelector(id);
      };
      /** Inject app styles on old shares */
      root.appendChild(c);
      styleElm = c.$$('style');
      if (!styleElm) {
          let styleElm = document.createElement('style');
          styleElm.innerHTML = c.appModules.componentStyles;
          c.root.appendChild(styleElm);
      }
      if (this.$.container) {
          root.removeChild(this.$.container);
          this.$.container = null;
      }
      if (this.component) {
          root.removeChild(this.component);
      }
      this.component = c;
      this.component.addEventListener('restart-code', this._reset.bind(this));
      this.fire('app-ready');
      this.async(() => {
          this.component.$$('kano-ui-viewport').resizeView();
      });
      this.running = true;
      this.fullscreen = false;
  },

  _onAppFileError (e) {
      this.failed = true;
  },

  start () {
      if (this.component.start) {
          this.component.start();
      } else {
          // For compatibility with old shares
          this.component.attached();
      }
      this.running = true;
  },

  stop () {
      this.running = false;
      if (this.component) {
          this.component.stop();
      }
  },

  detached () {
      this.stop();
      if (!this.component) {
          return;
      }
      // Previous versions of the shares, didn't tear down the hardware once detached
      // This detects these old versions and manually tears down thei hardware api
      if (!this.component.hwAPI
          && this.component.appModules
          && this.component.appModules.modules.lightboard) {
          this.component.appModules.modules.lightboard.api.tearDown();
      }
  },

  getWorkspace () {
      return this.component.workspace;
  },

  _toggleRunning () {
      if (this.running) {
          this.stop();
      } else {
          this.start();
      }
  },

  _reset () {
      this.stop();

      setTimeout(this.start.bind(this), 0);
  },

  _toggleFullscreen () {
      this.toggleClass('fullscreen');
      this.component.$$('kano-ui-viewport').resizeView();
      this.fullscreen = !this.fullscreen;

      Utils.triggerResize();
  },

  _toolbarLayout  (layout, fullscreen) {
      return layout === 'vertical' || fullscreen ? 'horizontal' : 'vertical';
  }
});
