import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
 * Returns true iff client is a Pi. Please be aware that it is not a foolproof
 * method at the moment
 */
function isPi() {
    let userAgent = window.navigator.userAgent;

    return userAgent.indexOf('armv6l') !== -1 ||
           userAgent.indexOf('armv7l') !== -1;
}

/*
 * True when the Kano Code IDE runs embedded inside the Kano Electron App.
 */
function runningInKanoApp() {
    return window.navigator.userAgent.indexOf("Electron") > -1;
}

window.ClientUtil = window.ClientUtil || { isPi, runningInKanoApp };
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
            }
            paper-toast {
                @apply(--layout-horizontal);
                @apply(--layout-center);
            }
            .actions {
                @apply(--layout-flex);
                @apply(--layout-horizontal);
                @apply(--layout-end-justified);
            }
            button {
                @apply(--kano-button);
                padding: 12px 22px 12px 22px;
                margin-left: 12px;
            }
            .confirm {
                background-color: var(--color-green);
            }
        </style>
        <paper-toast id="toast" text="[[tryChrome]]" class="fit-bottom">
            <div class="actions">
                <button type="button" class="confirm" name="button" on-tap="_tryChrome">Yes!</button>
                <button type="button" name="button" on-tap="_closeChromeToast">No, I'm OK</button>
            </div>
        </paper-toast>
`,

  is: 'kano-try-chrome',

  attached () {
      if (!localStorage.getItem('no-chrome')) {
          let isChromium = window.chrome,
              winNav = window.navigator,
              vendorName = winNav.vendor,
              isOpera = winNav.userAgent.indexOf("OPR") > -1,
              isIEedge = winNav.userAgent.indexOf("Edge") > -1,
              isIOSChrome = winNav.userAgent.match("CriOS");

          if ((isChromium !== null &&
               isChromium !== undefined &&
               vendorName === "Google Inc." &&
               isOpera == false &&
               isIEedge == false) ||
              ClientUtil.isPi() ||
              ClientUtil.runningInKanoApp()) {
              // Do not show
          } else if(isIOSChrome){
              this._promptToTryChrome();
          } else {
              this._promptToTryChrome();
          }
      }
  },

  _promptToTryChrome () {
      this.$.toast.show({
          text: 'Uh oh. It seems like you are using a browser that might not support all the features of Kano Code. The fun things might not work. Why not try Kano Code with Google Chrome?',
          duration: Infinity
      });
  },

  _tryChrome () {
      let win = window.open('https://www.google.com/chrome/browser/desktop/index.html', '_blank');
      win.focus();
      this.$.toast.close();
  },

  _closeChromeToast () {
      this.$.toast.close();
      localStorage.setItem('no-chrome', Date.now());
  }
});
