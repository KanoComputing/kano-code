import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-image/iron-image.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/input.js';
import { I18nMixin } from '../../i18n/index.js';
import { BlockAnimation } from '../../../scripts/splash.js';

import { img } from '../../icon/index.js';
import { success } from '../assets/index.js';

class KCCreationForm extends I18nMixin(PolymerElement) {
    static get is() { return 'kc-creation-form'; }
    static get properties() {
        return {
            page: {
                type: String,
                value: 'sharing-form',
            },
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            link: {
                type: String,
                value: null,
            },
            recording: {
                type: Boolean,
                value: true,
            },
        };
    }
    static get template() {
        return html`
        <style include="input-text">
            :host {
                position: relative;
                display: flex;
flex-direction: row;
                font-family: var(--font-body);
                background: var(--color-black);
                color: white;
                --section-padding: 32px;
                width: 100%;
                max-width: 1000px;
                height: 500px;
                max-height: 90vh;
            }
            .header {
                position: absolute;
                display: flex;
flex-direction: row;
                align-items: center;
                color: white;
                top: 32px;
                left: 32px;
                font-size: 14px;
                letter-spacing: 0.3px;
            }
            .header iron-icon {
                --iron-icon-fill-color: var(--color-chateau);
                --iron-icon-width: 32px;
                --iron-icon-height: 32px;
                transform: scale(-1, 1);
            }
            .dismiss {
                position: absolute;
                display: flex;
flex-direction: row;
                align-items: center;
                top: 47px;
                right: 31px;
                background: transparent;
                color: var(--color-chateau);
                font-size: 14px;
                z-index: 1;
                padding: 0;
                transition: all 300ms ease-in-out;
            }
            .dismiss:hover {
                opacity: 0.8;
            }
            .dismiss iron-icon {
                background: var(--color-chateau);
                border-radius: 4px;
                --iron-icon-fill-color: white;
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                margin-left: 12px;
                padding: 10px;
            }
            .options {
                display: flex;
flex-direction: column;
                background: var(--color-abbey);
                padding: var(--section-padding);
                width: 40%;
            }
            .options>iron-pages {
                flex: 1;
flex-basis: 0.000000001px;
                display: flex;
flex-direction: column;
            }
            .options>iron-pages>* {
                flex: 1;
flex-basis: 0.000000001px;
            }
            .gif-creation-header {
                flex: 1;
flex-basis: 0.000000001px;
                display: flex;
flex-direction: column;
                align-items: center;
                @apply --layout-center-justified;
            }
            .gif-creation-header span,
            .saving span {
                margin: 16px 0px;
                font-size: 20px;
            }
            .preview {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                background: var(--color-black);
                width: 60%;
                padding: 32px 16px;
            }
            .preview iron-pages,
            .preview iron-pages>* {
                height: 100%;
                display: flex;
flex-direction: column;
                align-items: center;
                @apply --layout-center-justified;
            }
            .preview iron-pages>* {
                height: 100%;
                width: 100%;
            }
            .app-preview {
                margin: var(--section-padding);
                width: 420px;
                height: 280px;
            }
            button {
                border: none;
                outline: none;
                font-weight: bold;
                cursor: pointer;
                text-transform: uppercase;
                color: white;
                font-family: var(--font-body);
                font-size: 16px;
            }
            button[disabled],
            button:hover[disabled] {
                opacity: 0.7;
                background: transparent;
                cursor: default;
            }
            button.change-gif {
                color: white;
                padding: 12px;
                border-radius: 24px;
                margin-bottom: 12px;
                background: var(--color-abbey);
            }

            form {
                display: flex;
flex-direction: column;
                @apply --layout-center-justified;
                padding-top: 64px;
            }

            #title_input {
                margin-bottom: 20px;
            }

            form textarea {
                flex: 1;
flex-basis: 0.000000001px;
                margin-bottom: 32px;
                resize: none;
            }

            form input[type="text"],
            form textarea {
                color: white;
                border: 1px solid transparent;
                background: var(--color-chateau);
                box-shadow: none;
                width: 100%;
                font-family: var(--font-body);
            }

            form textarea:focus {
                text-transform: none;
            }

            form input[type="text"]::-webkit-input-placeholder { text-transform: none; }
            form input[type="text"]::-moz-placeholder { text-transform: none; }
            form input[type="text"]:-ms-input-placeholder { text-transform: none; }
            form input[type="text"]:-moz-placeholder { text-transform: none; }

            .share-button {
                width: 100%;
                text-transform: uppercase;
                border-radius: 4px;
                padding: 9px;
                background: var(--color-chateau);
            }

            button.round {
                border-radius: 50px;
                padding: 9px 25px;
                margin-bottom: 24px;
            }

            .save-button,
            .close {
                background: var(--color-grassland);
                @apply --layout-self-center;
                transition: background 150ms;
            }

            .save-button:hover,
            .close:hover {
                background: var(--color-apple);
            }

            form hr {
                width: 100%;
                border: 0px;
                height: 1px;
                background: var(--color-black);
                margin: 14px 0px 14px;
            }

            .composed-button {
                display: flex;
flex-direction: row;
            }

            .composed-button button {
                border: 0px;
                border-radius: 4px;
                border-bottom-left-radius: 0px;
                border-top-left-radius: 0px;
                background: var(--color-black);
                text-transform: none;
                padding: 7px 20px;
            }

            .composed-button input[type="text"] {
                flex: 1;
flex-basis: 0.000000001px;
                border: 0px;
                border-radius: 4px;
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
                margin-bottom: 0px;
                color: white;
                background: var(--color-black);
                padding-right: 0px;
                font-family: var(--font-body);
            }

            .saving {
                display: flex;
flex-direction: column;
                align-items: center;
                @apply --layout-center-justified;
            }

            .blocks {
                width: 80px;
                height: 80px;

                display: flex;
                flex-direction: column;

                animation: fade-in .3s;
                transition-timing-function: ease-in;
            }

            .line {
                width: 100%;

                transform-origin: center;

                display: flex;
            }

            .block {
                opacity: 1;
                border-radius: 1px;

                background-color: rgba(0,0,0,0.5);

                margin: 2px;
                width: 10px;
                height: 8px;
            }

            @keyframes splash-block-pop-in {
                0% { transform: scale(0, 1); opacity: 0.5; }
                90% { transform: scale(1.1, 1); opacity: 1.0; }
                100% { transform: scale(1, 1); }
            }

            .last {
                animation: splash-block-pop-in .2s;
                transform-origin: left;
                transition-timing-function: ease-in;
            }

            .dialog button {
                @apply --kano-button;
            }
            button {
                cursor: pointer;
            }
            button.share {
                text-transform: none;
                background-color: #ff842a;
                border: none;
                outline: none;
                color: white;
                padding: 12px;
                cursor: pointer;
                border-radius: 24px;
                margin-bottom: 12px;
            }
            .social-share-container {
                display: flex;
flex-direction: row;
                align-items: center;
                @apply --layout-center-justified;
                margin-right: 8px;
            }
            .social-share-container a,
            .social-share-container iron-image {
                width: 25px;
                height: 25px;
                border-radius: 2px;
            }
            .social-share-container a {
                margin-left: 6px;
            }
            :host button .button-img {
                width: 25px;
                vertical-align: middle;
                margin-right: 10px;
                text-shadow: 0px 1.5px rgba(0, 0, 0, 0.25);
            }
            .preview iron-image.cover {
                width: 420px;
                height: 100%;
            }
            .success,
            .success .actions {
                display: flex;
flex-direction: column;
                align-items: center;
            }
            .success {
                @apply --layout-around-justified;
            }
            .success .title, .fail .title {
                font-size: 20px;
                margin-bottom: 4px;
            }
            .instructions span {
                color: var(--color-stone);
                font-size: 16px;
                line-height: 21px;
            }
            .success .composed-button {
                @apply --layout-self-stretch;
            }
            .fail {
                display: flex;
flex-direction: column;
                align-items: center;
                @apply --layout-center-justified;
            }
            .fail .title {
                text-transform: uppercase;
            }
            .fail button {
                background: var(--color-cinnabar);
                border-radius: 50px;
                padding: 9px 32px;
                font-weight: bold;
                transition: background 150ms;
            }
            .fail button:hover {
                background: var(--color-flamingo);
            }
            .instructions {
                display: flex;
flex-direction: column;
                align-items: center;
                font-size: 14px;
                margin-bottom: 24px;
            }
            .success .instructions {
                margin: 0px;
            }
            .success img {
                width: 62px;
                height: 62px;
            }
            label {
                font-size: 20px;
                display: block;
                margin-bottom: 2px;
                color: #6e6e6e;
            }
            .gif-creation {
                display: flex;
flex-direction: column;
                align-items: center;
                position: relative;
            }
            *[hidden] {
                display: none !important;
            }
            .generate-url button {
                padding: 12px;
                background-color: var(--color-blue, blue);
                text-transform: none;
                border-radius: 24px;
            }
            :host .loading-overlay {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 100%;
                height: 100%;
                display: flex;
flex-direction: column;
                align-items: center;
                @apply --layout-center-justified;
            }
            paper-spinner-lite {
                --paper-spinner-color: white;
            }
            .change-gif-container {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
flex-direction: column;
                align-items: center;
                @apply --layout-center-justified;
                opacity: 0;
                transition: opacity ease-in-out 70ms;
                cursor: pointer;
            }
            .change-gif-container:hover {
                opacity: 1;
            }
            .social-share-container button.social {
                background-color: transparent;
                padding: 0px;
                border-radius: 0px;
                margin: 4px;
                border: 0px;
            }
            .generate-url-container[hidden] {
                display: block !important;
                visibility: hidden;
            }

            @keyframes fade {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .fade-in, .fade-out {
                animation-name: fade;
                animation-duration: 300ms;
                animation-iteration-count: 1;
                animation-direction: normal;
                animation-timing-function: 'ease-out';
            }

            .fade-out {
                animation-direction: reverse;
            }
        </style>
        <div class="header" hidden\$="[[_isHeaderHidden(_page)]]">
            <iron-icon icon="reply"></iron-icon>
            <span>[[localize('SAVING', 'Saving')]]</span>
        </div>
        <section class="options">
            <iron-pages id="options-pager" selected="[[_page]]" attr-for-selected="name">
                <form class="form" name="sharing-form" id="sharing-form">
                    <input type="text" name="title" id="title_input" value="{{title::change}}" placeholder="Title" autofocus on-keydown="_dialogKeydown">
                    <textarea name="description" rows="4" cols="40" value="{{description::change}}" placeholder="Description"></textarea>
                    <button type="button" name="button" class="save-button round" on-tap="_shareOnKW" disabled\$="[[_computeSaveButtonDisabled(_saving, recording)]]">[[_computeSaveButtonLabel(recording, _saving)]]</button>
                </form>
                <div id="saving-process" class="saving" name="saving">
                    <div class="blocks" id="gif-creation-blocks"></div>
                    <span>[[localize('Saving', 'Saving')]]…</span>
                </div>
                <div class="fail" name="failure">
                    <div class="title">[[localize('SAVING_FAILED', 'Saving failed')]]</div>
                    <div class="instructions">
                        <span>[[localize('TRY_LATER', 'Please try again later.')]]</span>
                    </div>
                    <button on-tap="dismiss" type="button">[[localize('UNFORTUNATE', 'This is unfortunate')]]</button>
                </div>
                <div name="success" class="success">
                    ${img`${success}`}
                    <div class="instructions">
                        <h2>[[localize('SAVED', 'Saved')]]</h2>
                        <span>[[localize('APP_IS_STORED', 'Safely stored in your profile')]]</span>
                    </div>
                    <div class="composed-button" hidden\$="[[!link]]">
                        <input type="text" id="shareurl" value="[[link]]">
                        <button on-tap="copyToClipboard" type="button">[[localize('COPY', 'copy')]]</button>
                    </div>
                    <div class="actions">
                        <button class="close round" type="button" on-tap="dismiss">[[localize('OK', 'Ok')]]</button>
                    </div>
                </div>
            </iron-pages>
        </section>
        <section class="preview">
            <button class="dismiss" on-tap="dismiss">
                <span>[[localize('CLOSE', 'Close')]]</span>
                <iron-icon icon="clear"></iron-icon>
            </button>
            <slot name="preview"></slot>
        </section>
`;
    }
    static get observers() {
        return [
            '_pageChanged(page)',
        ];
    }
    _isHeaderHidden(page) {
        return page === 'success';
    }
    _computeSaveButtonDisabled(recording, saving) {
        return recording || saving;
    }
    _computeSaveButtonLabel(recording, saving) {
	if (saving) {
            return `${this.localize('SAVING', 'Saving')}...`;
        } else if (recording) {
            return `${this.localize('RECORDING', 'Recording')}...`;
        }
        return this.localize('SAVE', 'Save');
    }
    _pageChanged(page, prevPage) {
        const oldPageEl = this.$['options-pager'].querySelector('.iron-selected');
        let animationPromise;
        if (oldPageEl) {
            animationPromise = new Promise((resolve, reject) => {
                const onFadeOut = () => {
                    resolve();
                    oldPageEl.classList.remove('fade-out');
                    oldPageEl.removeEventListener('animationend', onFadeOut);
                };
                oldPageEl.addEventListener('animationend', onFadeOut);
                oldPageEl.classList.add('fade-out');
            });
        } else {
            this._page = page;
            return;
        }
        animationPromise.then(() => {
            this._page = page;
            if (this.splash) {
                this.splash.cancel();
            }
            if (page === 'saving') {
                const container = this.$['options-pager'].querySelector('.iron-selected #gif-creation-blocks');
                this.splash = new BlockAnimation(container);
                this.splash.init();
                this._saving = false;
            }
            const newPageEl = this.$['options-pager'].querySelector('.iron-selected');
            if (newPageEl) {
                animationPromise = new Promise((resolve, reject) => {
                    const onFadeIn = () => {
                        resolve();
                        newPageEl.classList.remove('fade-in');
                        newPageEl.removeEventListener('animationend', onFadeIn);
                    };
                    newPageEl.addEventListener('animationend', onFadeIn);
                    newPageEl.classList.add('fade-in');
                });
            } else {
                animationPromise = Promise.resolve();
            }
            return animationPromise;
        });
    }
    _checkTitleInput() {
        if (!this.title || this.title.length < 1) {
            this.$.title_input.placeholder = 'Please add a title';
            this.$.title_input.select();
            return false;
        }
        return true;
    }
    dismiss() {
        this.dispatchEvent(new CustomEvent('dismiss'));
    }
    _shareOnKW() {
        if (this._checkTitleInput() && !this._saving) {
            this._saving = true;
            this.dispatchEvent(new CustomEvent('submit', {
                detail: {
                    title: this.title,
                    description: this.description,
                },
            }));
        }
    }
    _dialogKeydown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this._shareOnKW();
        } else if (e.keyCode === 8) {
            e.stopPropagation();
        }
    }
    copyToClipboard(e) {
        const target = e.path ? e.path[0] : e.target,
            parent = target.parentNode,
            input = parent.querySelector('input');
        if (!input) {
            return;
        }
        input.select();
        document.execCommand('copy');
    }
}

customElements.define(KCCreationForm.is, KCCreationForm);
