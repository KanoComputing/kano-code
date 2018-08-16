import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '../kano-animated-svg/kano-animated-svg.js';
import '../kano-tooltip/kano-tooltip.js';
import '../kano-icons/kc-ui.js';
import '../inline-controls/kano-value-rendering/kano-value-rendering.js';
import { I18nMixin } from '../../lib/i18n/index.js';

import { button } from './style.js';
import { ToolbarEntry, ToolbarSettingsEntry, ToolbarEntryPosition } from './entry.js';

class KCWorkspaceToolbar extends I18nMixin(PolymerElement) {
    static get is() { return 'kc-workspace-toolbar'; }
    static get template() {
        return html`
        ${button}
        <style>
            :host {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
            :host([show-settings]) {
                @apply --layout-end-justified;
            }
            :host>div {
                display: flex;
                flex-direction: row;
            }
            .fullscreen,
            .pause {
                border-right: 2px solid #eee;
            }
            .mouse-position {
                display: flex;
                flex-direction: row;
                @apply --layout-end-justified;
                width: 100px;
                font-family: var(--font-body);
                font-size: 14px;
                line-height: 14px;
                font-weight: bold;
                color: #fff;
                margin-right: 12px;
            }
            .spacer {
                flex: 1;
            }
            kano-animated-svg {
                min-width: 17px;
                min-height: 17px;

                --kano-animated-path: {
                    fill: white;
                    stroke: white;
                    stroke-width: 2px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    transition: all ease-in-out 200ms;
                }
            }
            kano-tooltip {
                box-sizing: border-box;
                --kano-tooltip-caret-width: 12px;
            }
            kano-tooltip.fly {
                --kano-tooltip-caret-width: 7px;
            }
            button#entry-play {
                margin: 0;
            }
            iron-icon {
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
                opacity: 0.75;
            }
            button:hover iron-icon,
            button:focus iron-icon {
                opacity: 1;
            }
            button#save iron-icon {
                --iron-icon-fill-color: #fff;
            }
            ul {
                min-width: 188px;
                margin: 0px;
                padding: 10px 0 8px;
                color: black;
            }
            li {
                @apply --layout-vertical;
                @apply --layout-stretch;
            }
            .inline {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-start-justified;
                cursor: pointer;
                opacity: 0.9;
                background: transparent;
                margin: 0;
                transition: none;
                border-radius: 0px;
            }
            .text {
                color: var(--color-chateau);
                text-transform: initial;
                font-size: 14px;
                font-family: var(--font-body);
                text-decoration: none;
                padding: 6px 12px;
            }
            ul li button {
                border: 0;
            }
            ul li button:focus {
                outline: none;
            }
            ul li .inline:hover,
            ul li .inline:focus {
                opacity: 1;
                background: rgba(0, 0, 0, 0.10);
            }
            ul li .inline iron-icon {
                --iron-icon-width: 20px;
                --iron-icon-height: 20px;
                margin-right: 14px;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <button id="settings" type="button" class="tool settings" hidden\$="[[!showSettings]]" on-tap="_openSettings">
            <iron-icon icon="kc-ui:settings"></iron-icon>
        </button>
        <template is="dom-repeat" items="[[entries]]" filter="_isLeft">
            <kano-tooltip id\$="tooltip-{{item.id}}" class="fly" position="top" offset="16"><div class="text">[[item.title]]</div></kano-tooltip>
            <button id\$="entry-{{item.id}}" type="button" class="tool" on-click="_entryClicked" on-mouseenter="_startEntryTimer" on-mouseleave="_stopEntryTimer">
                <iron-icon icon="[[item.ironIcon]]" src="[[item.icon]]"></iron-icon>
            </button>
        </template>
        <div class="spacer" hidden\$="[[!showSettings]]"></div>
        <div class="mouse-position" hidden\$="[[mousePositionHidden(showMousePosition)]]">
            <span>x:</span>
            <kano-value-rendering font="bold 24px Bariol" width="32" height="16" value="{{mouseX}}" text-align="end" offset-x="25"></kano-value-rendering>
            <span>, y:</span>
            <kano-value-rendering font="bold 24px Bariol" width="32" height="16" value="{{mouseY}}" text-align="end" offset-x="25"></kano-value-rendering>
        </div>
        <template is="dom-repeat" items="[[entries]]" filter="_isRight">
            <kano-tooltip id\$="tooltip-{{item.id}}" class="fly" position="top" offset="16"><div class="text">[[item.title]]</div></kano-tooltip>
            <button id\$="entry-{{item.id}}" type="button" class="tool" on-click="_entryClicked" on-mouseenter="_startEntryTimer" on-mouseleave="_stopEntryTimer">
                <iron-icon icon="[[item.ironIcon]]" src="[[item.icon]]"></iron-icon>
            </button>
        </template>
        <kano-tooltip id="tooltip-play" class="fly" position="top" offset="16"><div class="text">[[_computePlayTitle(running)]]</div></kano-tooltip>
        <button id="entry-play" class="tool" type="button" on-tap="_playClicked" on-mouseenter="_startPlayTimer" on-mouseleave="_stopPlayTimer">
            <kano-animated-svg width="19" height="21" paths="[[makeButtonIconPaths]]" selected="[[_getRunningStatus(running)]]" hidden\$="[[noPlayerBar]]"></kano-animated-svg>
        </button>
        <kano-tooltip id="settings-tooltip" position="bottom" offset="16" auto-close>
            <ul id="settings-list">
                <template is="dom-repeat" items="[[settingsEntries]]">
                    <li>
                        <button type="button" class="inline text" on-tap="_settingsItemTapped">
                            <iron-icon icon="[[item.ironIcon]]" src="[[item.icon]]"></iron-icon>
                            <div>[[item.title]]</div>
                        </button>
                    </li>
                </template>
            </ul>
        </kano-tooltip>
`;
    }
    static get properties() {
        return {
            mouseX: {
                type: Number,
            },
            mouseY: {
                type: Number,
            },
            showMousePosition: {
                type: Boolean,
                value: false,
            },
            running: {
                type: Boolean,
                value: false,
            },
            noPlayerBar: {
                type: Boolean,
                value: false,
            },
            showSettings: {
                type: Boolean,
                value: true,
            },
            playPauseLabel: {
                typs: String,
                value: 'Pause',
            },
            fullscreen: {
                type: Boolean,
                value: false,
                observer: '_fullscreenChanged',
            },
            settingsEntries: {
                type: Array,
                value: () => [],
            },
            entries: {
                type: Array,
                value: () => [],
            },
        };
    }
    constructor() {
        super();
        this.makeButtonIconPaths = {
            stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
            running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z',
        };
        this.addSettingsEntry({
            title: this.localize('RESET_WORKSPACE', 'Reset Workspace'),
            ironIcon: 'kc-ui:reset',
        }).on('activate', () => this._reset());
        this.addSettingsEntry({
            title: this.localize('EXPORT', 'Export'),
            ironIcon: 'kc-ui:export',
        }).on('activate', () => this._export());
        this.addSettingsEntry({
            title: this.localize('IMPORT', 'Import'),
            ironIcon: 'kc-ui:import',
        }).on('activate', () => this._load());
        this.addEntry({
            id: 'save',
            position: ToolbarEntryPosition.LEFT,
            title: 'Save',
            ironIcon: 'kc-ui:save',
        }).on('activate', () => this._save());
        this.addEntry({
            id: 'restart',
            position: ToolbarEntryPosition.RIGHT,
            title: 'Restart',
            ironIcon: 'kc-ui:reset',
        }).on('activate', () => this.restartClicked());
        this.fullscreenEntry = this.addEntry({
            id: 'fullscreen',
            position: ToolbarEntryPosition.RIGHT,
            title: 'Fullscreen',
            ironIcon: 'kc-ui:maximize',
        }).on('activate', () => this.fullscreenClicked());
        this.timers = new Map();
    }
    addEntry(opts = {}) {
        const DEFAULTS = {
            position: ToolbarEntryPosition.LEFT,
        };
        const options = Object.assign({}, DEFAULTS, opts);
        if (!options.id) {
            throw new Error('Could not add toolbar entry: Missing id');
        }
        if (this.entries.find(entry => entry.id === options.id)) {
            throw new Error(`Could not add toolbar entry: id '${options.id}' already used`);
        }
        const entry = new ToolbarEntry(this, options);
        entry._inject();
        return entry;
    }
    addSettingsEntry(opts = {}) {
        const entry = new ToolbarSettingsEntry(this, opts);
        entry._inject();
        return entry;
    }
    _entryClicked(e) {
        const item = e.model.get('item');
        this._clicked(item.id);
        item.callback();
    }
    _clicked(id) {
        this._stopTimer(id);
        this._closeTooltip(id);
    }
    _playClicked() {
        this._clicked('play');
        this.dispatchEvent(new CustomEvent('run-clicked'));
    }
    _computePlayTitle(running) {
        return running ? 'Pause' : 'Play';
    }
    _isLeft(item) {
        return item.position === ToolbarEntryPosition.LEFT;
    }
    _isRight(item) {
        return item.position === ToolbarEntryPosition.RIGHT;
    }
    _startTimer(id) {
        const timer = setTimeout(() => {
            this._openTooltip(id);
        }, 800);
        this.timers.set(id, timer);
    }
    _stopTimer(id) {
        clearTimeout(this.timers.get(id));
        this._closeTooltip(id);
    }
    _startEntryTimer(e) {
        const item = e.model.get('item');
        this._startTimer(item.id);
    }
    _stopEntryTimer(e) {
        const item = e.model.get('item');
        this._stopTimer(item.id);
    }
    _startPlayTimer() {
        this._startTimer('play');
    }
    _stopPlayTimer() {
        this._stopTimer('play');
    }
    _settingsItemTapped(e) {
        const item = e.model.get('item');
        item.callback(e);
        this.$['settings-tooltip'].close();
    }
    mousePositionHidden(show) {
        return !show;
    }
    fullscreenClicked() {
        this.dispatchEvent(new CustomEvent('fullscreen-clicked'));
    }
    restartClicked() {
        this.dispatchEvent(new CustomEvent('restart-clicked'));
    }
    _getRunningStatus(running) {
        return running ? 'running' : 'stopped';
    }
    _openTooltip(id) {
        const tooltip = this.shadowRoot.querySelector(`#tooltip-${id}`);
        const target = this.shadowRoot.querySelector(`#entry-${id}`);
        tooltip.target = target;
        tooltip.open();
    }
    _closeTooltip(id) {
        const tooltip = this.shadowRoot.querySelector(`#tooltip-${id}`);
        tooltip.close();
    }
    _openSettings(e) {
        const target = e.composedPath()[0];
        const tooltip = this.$['settings-tooltip'];
        tooltip.target = target.getBoundingClientRect();
        tooltip.open();

        e.preventDefault();
        e.stopPropagation();
    }
    _reset() {
        this.dispatchEvent(new CustomEvent('reset-clicked'));
    }
    _export() {
        this.dispatchEvent(new CustomEvent('export-clicked'));
    }
    _load() {
        this.dispatchEvent(new CustomEvent('import-clicked'));
    }
    _save() {
        this.dispatchEvent(new CustomEvent('save-clicked'));
    }
    _fullscreenChanged(fullscreen) {
        this.fullscreenEntry.updateIronIcon(`kc-ui:${fullscreen ? 'minimize' : 'maximize'}`);
    }
}

customElements.define(KCWorkspaceToolbar.is, KCWorkspaceToolbar);
