/**

`kano-app-challenge`

Example:
    <kano-app-challenge steps="[[steps]]" step="1"></kano-app-challenge>

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------

@group Kano Elements
@hero hero.svg
@demo demo/kano-app-challenge.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { SoundPlayerBehavior } from '@kano/web-components/kano-sound-player-behavior/kano-sound-player-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'twemoji-min/2/twemoji.min.js';
import './kano-challenge-ui.js';
import { Store } from '../../scripts/legacy/store.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import '../kano-editor-banner/kano-editor-banner.js';

const BANNER_SOUND = '/assets/audio/sounds/card_set.wav';

class KanoAppChallenge extends Store.StateReceiver(mixinBehaviors([
    SoundPlayerBehavior,
    I18nBehavior,
], PolymerElement)) {
    static get template() {
        return html`
        <style>
            :host {
                display: flex;
                --kano-value-preview-input-background: rgba(0, 0, 0, 0.2);
            }
            #content {
                flex: 1;
            }
            .banner-container {
                @apply --layout-vertical;
                @apply --layout-stretch;
                @apply --layout-center-justified;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                max-height: 220px;
                pointer-events: none;
                padding: 24px;
                box-sizing: border-box;
                z-index: 1;
            }
            kano-editor-banner {
                @apply --shadow-elevation-2dp;
                border-radius: 6px;
                background: white;
                color: black;
                font-family: var(--font-body);
                pointer-events: all;
            }
            #overlay {
                position: absolute;
                top: 0;
                right: 0;
                width: calc(100% - 50px);
                height: 100%;
            }
            :host([lockdown]) #overlay {
                display: block;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <kano-challenge-ui id="ui" beacon="[[beacon]]" tooltips="[[tooltips]]" on-next-step="nextStep" idle="[[idle]]">
            <slot name="editor" slot="editor" id="content"></slot>
        </kano-challenge-ui>
        <div id="overlay" hidden\$="[[!lockedUi]]" on-tap="_onLockdownClick"></div>
        <div class="banner-container" id="banner-container">
            <kano-editor-banner id="banner" head="[[banner.head]]" text="[[banner.text]]" img-src="[[banner.icon]]" img-page="[[banner.imgPage]]" button-label="[[banner.buttonLabel]]" button-state="[[banner.buttonState]]" show-save-button="[[banner.showSaveButton]]" progress="[[progress]]" on-button-tapped="_bannerButtonTapped" on-save-button-clicked="_transmitRequestShare" hidden\$="[[_isBannerHidden(banner)]]" can-go-back="[[history.canGoBack]]" can-go-forward="[[history.canGoForward]]"></kano-editor-banner>
        </div>
`;
    }

    static get is() { return 'kano-app-challenge'; }
    static get properties() {
        return {
            progress: {
                type: Number,
                linkState: 'userProgress',
            },
            banner: {
                type: Object,
                linkState: 'banner',
                observer: '_fitBanner',
            },
            beacon: {
                type: Object,
                linkState: 'beacon',
            },
            idle: {
                type: Boolean,
                linkState: 'idle',
            },
            lockdown: {
                type: Boolean,
                reflectToAttribute: true,
                linkState: 'lockdown',
            },
            history: {
                type: Object,
                linkState: 'history',
            },
            challengeId: {
                linkState: 'id',
                observer: '_challengeChanged',
            },
            tooltips: {
                linkState: 'tooltips',
            },
        };
    }
    constructor() {
        super();
        this.changeCounts = {};
        this._onLockdownClick = this._onLockdownClick.bind(this);
        this._onResize = this._onResize.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this._processMarkdown = this._processMarkdown.bind(this);
        this.loadSound(BANNER_SOUND);
        this._observer = new FlattenedNodesObserver(this.$.content, (info) => {
            this._processNewNodes(info.addedNodes);
        });
        window.addEventListener('resize', this._onResize);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._observer.disconnect();
        window.removeEventListener('resize', this._onResize);
    }
    _onResize() {
        this._resizeDebouncer = Debouncer.debounce(
            this._resizeDebouncer,
            timeOut.after(300),
            () => {
                this._fitBanner();
            },
        );
    }
    _challengeChanged() {
        this.initializeChallenge();
    }
    _processNewNodes(nodes) {
        let editorEl;
        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i].assignedSlot === this.$.content) {
                editorEl = nodes[i];
            }
        }
        if (!editorEl) {
            return;
        }
        this.editor = editorEl.editor;
        this.$.ui.workspace = editorEl.getBlocklyWorkspace();
        this._fitBanner();
    }
    animateBannerIn() {
        this.playSound(BANNER_SOUND);
        if ('animate' in HTMLElement.prototype) {
            this.$.banner.animate({
                opacity: [0, 1],
                transform: ['scale(0.5, 0.5)', 'scale(1, 1)'],
            }, {
                duration: 150,
                easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)',
            });
        }
    }
    _isBannerHidden(banner) {
        return !banner;
    }
    _processMarkdown(text) {
        const { variables } = this.getState();
        let processedText = text,
            blockReg = /<kano-blockly-block(.*)type="(.+)"(.*)><\/kano-blockly-block>/g;

        processedText = processedText.replace(blockReg, (match, before, type, after) => {
            const pieces = type.split('#');
            if (pieces.length > 1) {
                pieces[0] = this.challengeClass.engine._processPart(pieces[0]);
            }
            type = pieces.join('#');
            return `<kano-blockly-block${before}type="${type}"${after}></kano-blockly-block>`;
        });

        // Inject variables to markdown syntax
        processedText = Object.keys(variables).reduce((acc, key) => acc.replace(new RegExp(`\\$\\{${  key  }\\}`, 'g'), variables[key] || ''), processedText);


        /* Replace native emoji and return */
        return twemoji.parse(processedText);
    }
    _bannerButtonTapped() {
        this.nextStep();
    }
    _onLockdownClick() {
        this.$.banner.shakeButton();
    }
    initializeChallenge() {
        this.challengeClass.initializeChallenge();
    }
    historyBack() {
        this.dispatchEvent(new CustomEvent('history-back'));
    }
    historyForward() {
        this.dispatchEvent(new CustomEvent('history-forward'));
    }
    _onFlyoutStateChanged(e) {
        if ([Blockly.Events.OPEN_FLYOUT, Blockly.Events.CLOSE_FLYOUT].indexOf(e.type) === -1) {
            return;
        }
        this.async(() => {
            this._fitBanner();
        });
    }
    _fitBanner() {
        if (!this.editor) {
            return;
        }
        const workspace = this.editor.getBlocklyWorkspace();
        if (!workspace) {
            return;
        }
        this.lockedUi = this.banner.lockUi || false;
        const metrics = workspace.getMetrics();
        const flyout = workspace.getFlyout_();
        const width = workspace.toolbox_ && !workspace.toolbox_.opened ?
            metrics.toolboxWidth : flyout.getWidth();
        const bannerWidth = (metrics.viewWidth + metrics.toolboxWidth + 12) - width;
        this.$['banner-container'].style.left = `${width + 44}px`;
        this.$['banner-container'].style.top = '0px';
        this.$['banner-container'].style.width = `${bannerWidth}px`;
    }
    nextStep() {
        this.dispatchEvent(new CustomEvent('next-step'));
    }
    _transmitRequestShare() {
        this.dispatchEvent(new CustomEvent('save'));
        if (this.editor && this.editor.creation) {
            this.editor.creation.init();
        }
    }
}

customElements.define(KanoAppChallenge.is, KanoAppChallenge);
