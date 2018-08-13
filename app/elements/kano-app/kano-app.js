import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { SDK } from '../../scripts/kano/make-apps/sdk.js';
import { experiments } from '../../scripts/kano/make-apps/experiments.js';
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-toast/paper-toast.js';
import '../kano-style/themes/dark.js';
import '@kano/web-components/kano-auth/kano-auth.js';
import '../kano-routing/kano-routing.js';
import '../kano-ui-item/kano-ui-item.js';
import '../behaviors/kano-modal-animator-behavior.js';
import '../behaviors/kano-view-behavior.js';
import { GABehavior } from '../behaviors/kano-code-ga-tracking-behavior.js';
import { KanoCodeTrackingBehavior } from '../behaviors/kano-code-tracking-behavior.js';
import { GamificationBehavior } from '../behaviors/kano-gamification-behavior.js';
import '../kano-try-chrome/kano-try-chrome.js';
import { Progress } from '../../scripts/kano/make-apps/progress.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import { User } from '../../scripts/kano/make-apps/actions/user.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
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
const behaviors = [
    GABehavior,
    KanoCodeTrackingBehavior,
    GamificationBehavior,
];
class KanoApp extends Store.StateReceiver(
    mixinBehaviors(behaviors, PolymerElement)
) {
  static get template() {
    return html`
        <style>
            :host {
                font-family: var(--font-body);
                display: block;
                @apply(--layout-vertical);
                @apply(--layout-flex);
            }
            :host button {
                font-family: Bariol;
            }
            :host kano-routing {
                @apply(--layout-vertical);
                @apply(--layout-flex);
                overflow: auto;
            }
            :host button,
            :host .main header .link {
                @apply(--kano-button-small);
                text-decoration: none;
                background-color: var(--primary-color);
            }
            :host .main header {
                background-color: var(--color-header, black);
                color: white;
                @apply(--kano-header);
                @apply(--layout-horizontal);
                @apply(--layout-justified);
                @apply(--layout-center);
                height: 62px;
            }
            :host .main header div {
                @apply(--layout-flex);
            }
            :host .main header .logged {
                @apply(--layout-vertical);
            }
            :host .user-info {
                margin-left: 5px;
            }
            :host kano-routing {
                @apply(--layout-flex);
                position: relative;
            }
            :host .logged-out {
                background: white;
            }
            #toast {
                --paper-toast-background-color: var(--kano-app-editor-workspace-background);
            }
            #toast button {
                background-color: var(--color-green);
                margin-left: 16px;
            }
        </style>
        <kano-routing id="router" name="app" user="[[user]]" on-login="_login"></kano-routing>
        <kano-auth id="auth" on-login="_onLogin" world-url="[[worldUrl]]" api-url="[[apiUrl]]" assets-path="/assets" on-success="_authSuccess" on-cancel="_authCancelled" successful="[[authenticated]]"></kano-auth>
        <paper-toast id="toast" text="[[message.text]]" duration="[[message.duration]]">
            <button type="button" name="button" hidden\$="[[!message.closeWithButton]]" on-tap="_closeToast">[[message.buttonText]]</button>
        </paper-toast>
        <kano-try-chrome></kano-try-chrome>
`;
  }

  static get is() { return 'kano-app'; }
  static get properties() {
      return {
          user: {
              type: Object,
              linkState: 'user',
              observer: '_userChanged',
          },
          offline: {
              type: Boolean,
              value: false
          },
          authenticated: {
              type: Boolean,
              value: false
          }
      };
  }
  constructor() {
      super();
      this.listeners = {
          logout: '_logout',
          shutdown: '_shutdown',
          signup: '_signup',
          'kano-error': '_showErrorOnToast',
          'view-loaded': '_viewLoaded',
          'ga-tracking-event': '_trackGAEvent',
          'ga-page-tracking-event': '_trackGAPage',
          'update-user-progress': '_updateUserProgress'
      };
      const { config } = this.getState();
      this.sdk = new SDK(config);
      this.progress = new Progress(config);
      this.offline = config.TARGET === 'osonline' && ClientUtil.isPi();
      this.worldUrl = config.WORLD_URL;
      this.apiUrl = config.API_URL;
      this.bindListeners();
  }
  connectedCallback() {
      super.connectedCallback();
      this.attachListeners();
      if (this.offline) {
          fetch(config.TOKEN_ENDPOINT, {method: 'POST'})
              .then((response) => {
                  if (response.ok) {
                      // The API has responded, need to set the token
                      return response.json();
                  }
              })
              .then((retObj) => {
                  if (retObj.hasOwnProperty('token')) {
                      this.sdk.setToken(retObj.token);
                  }

                  this.initialiseSDK();
              })
              .catch((error) => {
                  // Server responded with 401 or some other error occurred
                  // still need to initialise the SDK
                  this.initialiseSDK();
              });
      } else {
          this.initialiseSDK();
      }
      experiments.addExperiments('ui', ['gamification_modal']);
  }
  disconnectedCallback() {
      super.disconnectedCallback();
      this.removeListeners();
  }
  bindListeners() {
      Object.keys(this.listeners).forEach((eventName) => {
          const funcName = this.listeners[eventName];
          this[funcName] = this[funcName].bind(this);
      });
  }
  attachListeners() {
      Object.keys(this.listeners).forEach((eventName) => {
          this.addEventListener(eventName, this[this.listeners[eventName]]);
      });
  }
  removeListeners() {
      Object.keys(this.listeners).forEach((eventName) => {
          this.removeEventListener(eventName, this[this.listeners[eventName]]);
      });
  }
  initialiseSDK() {
      // TODO: Can't get cross storage to work unless 1s timeout
      setTimeout(() => {
          this.sdk.initSession().then((user) => {
              /**
               * Set the token to allow this to be used by the tracking
               * behavior
               */
              this.token = this.sdk.getToken();
              if (user) {
                  User.authenticate(user);
                  this._populateUser();
              } else {
                  this.trackVisitType('Logged out');
              }
              /**
               * Initialize the tracking only after initializing the sdk
               * to ensure that the token is used when starting the
               * session, if applicable
               */
              this._initializeTracking({
                  detail: {
                      token: this.token,
                      path: window.location.pathname
                  }
              });
          })
          .catch(() => {
              this.trackVisitType('Logged out');
          });
      }, 1000);
  }
  _showErrorOnToast(e) {
      this.message = e.detail;
      if (this.message.text) {
          this.$.toast.open();
          // The content changed, need to refit
          this.$.toast.refit();
      }
  }
  _closeToast() {
      this.$.toast.close();
  }
  _shutdown(e) {
      if (!this.offline) {
          console.log("Can't shutdown outside of offline mode.");
          return;
      }

      const state = this.getState();

      fetch(state.config.SHUTDOWN_ENDPOINT)
      .then((response) => {
          if (!response.ok) {
              console.log("Failed to shutdown.");
          }
      })
      .catch((error) => {
          console.log(error);
      });
  }
  _logout(e) {
      e.preventDefault();
      this.sdk.logout();
      User.logout();
      this.$.auth.reset();
      this.progress.reset();
      clearInterval(this._pollingIntervalId);
      /**
       * Attach the token to the event to allow this to be associated with
       * the user, and then clear the token
       */
      this.fire('tracking-event', {
          name: 'logged_out',
          token: this.token
      });
      this.token = null;
  }
  _login(e) {
      if (e && e.detail) {
          this.authCallbacks = e.detail;
      }

      this.authCallbacks = this.authCallbacks || {};
      this.$.auth.open('login');
  }
  _signup(e) {
      if (e && e.detail) {
          this.authCallbacks = e.detail;
      }

      this.authCallbacks = this.authCallbacks || {};
      this.$.auth.open('signup');
  }
  _authSuccess() {
      if (this.authCallbacks && this.authCallbacks.onSuccess) {
          this.authCallbacks.onSuccess.call();
          this.set('authCallbacks', null);
      }
  }
  _authCancelled() {
      if (this.authCallbacks && this.authCallbacks.onCancel) {
          this.authCallbacks.onCancel.call();
          this.set('authCallbacks', null);
      }
  }
  _fetchUserProgress() {
      this.sdk.getProgress()
          .then((res) => {
              User.updateLevels(res.progress.levels);
              this.set('user.profile.levels', res.progress.levels);
          });
  }
  _onLogin(e) {
      const data = e.detail;
      this.sdk.setToken(data.token);
      this.token = data.token;
      User.authenticate(data.user);
      this._populateUser();
      this.authenticated = true;
      this.fire('tracking-event', {
          name: 'logged_in'
      });

      this.syncCachedProgress();
  }
  _populateUser() {
      this._updateProfile();
  }
  _updateProfile() {
      this.sdk.getUserByUsername(this.user.username)
          .then((res) => {
              User.updateProfile(res.user.profile);
              this.set('user.profile', res.user.profile);
              this._fetchUserProgress();
          });
  }
  _updateUserProgress(e) {
      const progress = e.detail
                  && e.detail.levels
                  && e.detail.levels.progress;
      if (!progress) {
          return;
      }
      this.set('user.profile.levels', progress);
  }
  _userChanged(user) {
      this.debounce('userChanged', () => {
          if (user) {
              this.trackVisitType('Logged in');
          } else {
              this.trackVisitType('Logged out');
          }
      });
  }
  _viewLoaded() {
      window.prerenderReady = true;
  }
  _trackGAEvent(e) {
      const payload = e.detail;
      this.dispatchTrackingEvent(payload);
  }
  _trackGAPage(e) {
      const { title, path } = e.detail;
      this.dispatchVirtualPageView(title, path);
  }
}

customElements.define(KanoApp.is, KanoApp);
