import '../../../../../@polymer/polymer/polymer-legacy.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import '../../scripts/kano/make-apps/actions/user.js';
import { Polymer } from '../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../@polymer/polymer/lib/utils/html-tag.js';
/* globals Polymer, Kano, Blockly */

Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            ul {
                margin: 0;
                padding-left: 0;
                color:  #292f35;
                max-width: 160px;
                min-width: 140px;
            }
            li {
                @apply --layout-vertical;
                @apply --layout-stretch;
            }
            li.user {
                @apply --layout-horizontal;
            }
            li.user iron-image {
                margin-top: 12px;
                margin-left: 16px;
                width: 24px;
                height: 24px;
            }
            li.user .info {
                @apply --layout-flex;
                @apply --layout-vertical;
                @apply --layout-start;
                margin: 0px 16px;
                /* W3C spec says to set the min-width to let the flex item shrink below their minimum size content */
                min-width: 0;
            }
            li.user .name {
                max-width: 100%;
                margin-top: 16px;
                font-size: 16px;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: left;
            }
            li.user .level {
                text-align: left;
                font-weight: bold;
                opacity: 0.4;
                font-size: 14px;
                margin: 8px 0px 16px;
            }
            .inline {
                @apply --layout-horizontal;
                @apply --layout-center;
                padding: 8px 14px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                height: 40px;
                opacity: 0.3;
            }
            .inline:hover {
                background: var(--color-porcelain);
                z-index: 0;
                opacity: 1;
            }
            .inline:hover iron-icon {
                fill: var(--color-kano-orange);
            }
            button.inline {
                background: transparent;
                border: 0;
                font-family: inherit;
            }
            button:focus {
                outline: none;
            }
            .inline iron-icon {
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                margin: 0px 18px 0px 6px;
            }
            [hidden] {
                display: none !important;
            }
            .login iron-icon {
                transform: rotate(180deg);
            }
            hr {
                height: 1px;
                margin: 0px;
                border: 0;
                background: rgba(0, 0, 0, 0.1);
            }
            kano-tooltip {
                --kano-tooltip: {
                    border-radius: 6px;
                };
            }
        </style>
         <ul>
            <li class="user" hidden\$="[[_isProfileHidden(user)]]">
                <div class="avatar">
                    <iron-image src="[[_computeAvatar(user)]]" sizing="contain" hidden\$="[[!user]]"></iron-image>
                </div>
                <div class="info">
                    <div class="name">[[user.username]]</div>
                    <div class="level">[[localize('LEVEL', 'Level')]] [[user.profile.levels.level]]</div>
                </div>
            </li>
            <hr hidden\$="[[_isLogoutHidden(logoutEnabled, user)]]">
            <li class="logout" hidden\$="[[_isLogoutHidden(logoutEnabled, user)]]">
                <button on-tap="_logoutTapped" class="inline">
                    <iron-icon icon="kano-icons:back"></iron-icon>
                    <div class="label">[[localize('LOGOUT', 'Log Out')]]</div>
                </button>
            </li>
            <li class="login" hidden\$="[[_isAuthenticated(user)]]">
                <button on-tap="_loginTapped" class="inline">
                    <iron-icon icon="kano-icons:back"></iron-icon>
                    <div class="label">[[localize('LOGIN', 'Login')]]</div>
                </button>
            </li>
        </ul>
`,

  is: 'kc-user-options',

  behaviors: [
      I18nBehavior,
      Store.ReceiverBehavior
      ],

  properties: {
      user: {
          type: Object,
          linkState: 'user'
      },
      logoutEnabled: {
          type: Boolean,
          linkState: 'editor.logoutEnabled'
      }
  },

  _logoutTapped () {
      this.fire('logout');
  },

  _loginTapped () {
      this.fire('login');
  },

  _isLogoutHidden (logoutEnabled, user) {
      return !logoutEnabled || !user;
  },

  _isProfileHidden (user) {
      return !user;
  },

  _isAuthenticated (user) {
      return !!user;
  },

  _computeAvatar (user) {
      if (!user || !user.avatar || !user.avatar.urls || !user.avatar.urls.circle) {
          return '/assets/avatar/judoka-face.svg';
      }
      return user.avatar.urls.circle;
  }
});
