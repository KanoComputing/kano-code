/**
@group Kano Elements
@hero hero.svg
@demo demo/kano-editor-topbar.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import '@kano/kwc-icons/kwc-icons.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import '../kano-tooltip/kano-tooltip.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
            :host {
                @apply --layout-horizontal;
                @apply --layout-justified;
                background: #394148;
                color: rgba(255, 255, 255, 0.5);
                height: 32px;
                padding: 0px 8px;
                border-bottom: 1px solid var(--kano-app-editor-workspace-border, #22272d);
            }
            .title {
                height: 100%;
                width: 44px;
            }
            a.back {
                @apply --layout-horizontal;
                @apply --layout-center;
                text-decoration: none;
                cursor: pointer;
                opacity: 0.5;
                transition: opacity 150ms ease-in;
            }
            a.back:hover {
                opacity: 1;
            }
            a.back span {
                font-size: 12px;
                line-height: 12px;
                font-weight: bold;
                text-transform: uppercase;
                color: #fff;
                margin: 0 8px;
            }
            .user-profile {
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            .user-profile button {
                background: transparent;
                border: 0;
                cursor: pointer;
                padding: 0;
            }
            .user-profile button iron-image {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                box-sizing: border-box;
                border: 1px solid transparent;
            }
            .user-profile button:focus,
            .user-profile button:active {
                outline: none;
                border: none;
            }
            .user-profile button .login {
                color: #fff;
                font-weight: bold;
                font-family: var(--font-body);
                text-transform: uppercase;
                opacity: 0.5;
                transition: opacity 150ms ease-in;
            }
            .user-profile button .login:hover {
                opacity: 1;
            }
            kano-tooltip {
                box-sizing: border-box;
            }
            ul {
                margin: 0;
                padding-left: 0;
                color: black;
                min-width: 200px;
            }
            li {
                @apply --layout-vertical;
                @apply --layout-stretch;
            }
            li.user {
                @apply --layout-horizontal;
                @apply --layout-center;
                padding: 16px 14px;
            }
            li.user iron-image {
                width: 30px;
                height: 30px;
            }
            li.user .info {
                @apply --layout-vertical;
                @apply --layout-start;
                margin-left: 14px;
            }
            li.user .info .name {
                font-size: 14px;
                font-weight: bold;
            }
            li.user .info .level {
                font-size: 12px;
                opacity: 0.6;
            }
            li.logout {
                padding-bottom: 16px;
            }
            .inline {
                @apply --layout-horizontal;
                @apply --layout-center;
                padding: 8px 14px;
                cursor: pointer;
                opacity: 0.6;
            }
            .inline:hover {
                opacity: 0.9;
                background: rgba(0, 0, 0, 0.2);
            }
            .inline iron-icon {
                --iron-icon-width: 14px;
                --iron-icon-height: 14px;
                margin-right: 14px;
            }
            .back iron-icon {
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                --iron-icon-fill-color: #fff;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <a class="back" on-tap="_exitButtonTapped">
            <iron-icon id="back-icon" icon="kano-icons:back"></iron-icon>
            <span>[[localize('BACK', 'Back')]]</span>
        </a>
        <iron-image class="title" src="/assets/kano-logo-simple.svg" sizing="contain"></iron-image>
        <div class="user-profile" id="profile-container">
            <button id="user-button" type="button" on-tap="_userOptionsTapped">
                <iron-image src="[[avatar]]" sizing="contain" hidden\$="[[!user]]"></iron-image>
                <div class="login" hidden\$="[[loggedIn]]">[[localize('LOGIN', 'login')]]</div>
            </button>
            <kano-tooltip id="tooltip" position="bottom" auto-close="">
                <ul>
                    <li class="user">
                        <iron-image src="[[avatar]]" sizing="contain" hidden\$="[[!user]]"></iron-image>
                        <div class="info">
                            <div class="name">[[user.username]]</div>
                            <div class="level">[[localize('LEVEL', 'Level')]] [[profile.levels.level]]</div>
                        </div>
                    </li>
                    <li class="logout" hidden\$="[[!disableLogout]]">
                        <a on-tap="_logoutTapped" class="inline">
                            <iron-icon src="/assets/icons/logout.svg"></iron-icon>
                            <div class="label">[[localize('LOGOUT', 'Log Out')]]</div>
                        </a>
                    </li>
                </ul>
            </kano-tooltip>
        </div>
`,

  is: 'kano-editor-topbar',

  behaviors: [
      I18nBehavior,
      Store.ReceiverBehavior,
  ],

  properties: {
      profile: Object,
      user: {
          type: Object,
          value: null
      },
      loggedIn: {
          type: Boolean,
          computed: '_computeLoggedIn(user)'
      },
      avatar: {
          type: String,
          computed: '_computeAvatar(user)'
      },
      disableLogout: {
          type: Boolean,
          linkState: 'editor.logoutEnabled'
      }
  },

  _computeLoggedIn (user) {
      return !!user;
  },

  _computeAvatar (user) {
      if (user && user.avatar && user.avatar.urls) {
          return user.avatar.urls.circle || '/assets/avatar/judoka-face.svg';
      }
      return '/assets/avatar/judoka-face.svg';
  },

  _exitButtonTapped () {
      this.fire('tracking-event', {
          name: 'ide_exited'
      });
      this.fire('exit');
  },

  _closeTooltip () {
      this.$.tooltip.close();
  },

  _openTooltip () {
      this.$.tooltip.target = this.$['user-button'].getBoundingClientRect();
      this.$.tooltip.open();
  },

  _userOptionsTapped () {
      if (!!this.user) {
          if (!this.$.tooltip.opened) {
              this._openTooltip();
          }
      } else {
          this.fire('login');
      }
  },

  _logoutTapped () {
      this.fire('logout');
      this._closeTooltip();
  }
});
