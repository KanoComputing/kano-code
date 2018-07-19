import { Plugin } from '../editor/plugin.js';
import KanoCodeChallenge from './kano-code.js';
import Store from '../store.js';
import ChallengeActions from '../actions/challenge.js';
import { Challenge as ChallengeGeneratorPlugin } from './generator/index.js';

import '../../elements/kano-app-challenge/kano-app-challenge.js';

const EDITOR_EVENTS = [
    'open-parts',
    'add-part',
];

const DEFAULT_OPTS = {};

/* eslint no-underscore-dangle: "off" */
class Challenge extends Plugin {
    constructor(opts = {}) {
        super();
        this.options = Object.assign({}, DEFAULT_OPTS, opts);
        this.rootEl = document.createElement('kano-app-challenge');
        this.rootEl.addEventListener('next-step', this._nextStep.bind(this));
        this.rootEl.addEventListener('save', this._save.bind(this));
        this.rootEl.challengeClass = this;
        this.store = Store.create({
            banner: null,
            history: {
                backBuffer: [],
                forwardBuffer: [],
                ignoreNextStepChange: false,
            },
            hints: {
                enabled: true,
            },
            idle: false,
        });

        this.challengeActions = ChallengeActions(this.store);

        this._onDone = this._onDone.bind(this);
        this._onStepChanged = this._onStepChanged.bind(this);
        this._historyBack = this._historyBack.bind(this);
        this._historyForward = this._historyForward.bind(this);
        this._displayBanner = this._displayBanner.bind(this);
        this._hideBanner = this._hideBanner.bind(this);
        this._displayBeacon = this._displayBeacon.bind(this);
        this._hideBeacon = this._hideBeacon.bind(this);
        this._displayTooltips = this._displayTooltips.bind(this);
        this._hideTooltips = this._hideTooltips.bind(this);

        this._onFlyoutStateChanged = this.rootEl._onFlyoutStateChanged.bind(this.rootEl);

        this.rootEl.storeId = this.store.id;
    }
    setParts(parts) {
        this.partsList = parts;
    }
    onInstall(editor) {
        this.setEditor(editor);
    }
    onInject() {
        const { sourceEditor } = this.editor;
        const blocklyWorkspace = this.editor.getBlocklyWorkspace();
        this.engine = new KanoCodeChallenge(blocklyWorkspace);
        this.engine.addEventListener('done', this._onDone);
        this.engine.addEventListener('step-changed', this._onStepChanged);
        this.engine.addEventListener('history-back', this._historyBack);
        this.engine.addEventListener('history-forward', this._historyForward);
        this.editor.on('change', this._editorChanged.bind(this));
        this.editorListeners = [];
        // TODO: Remove these listeners when challenge done
        EDITOR_EVENTS.forEach((eventName) => {
            const callback = (e) => {
                this.editor.logger.debug('[CHALLENGE]', `Editor fired: ${eventName}`, e);
                this.engine.triggerEvent(eventName, e);
            };
            this.editor.on(eventName, callback);
            this.editorListeners.push(callback);
            this.editor.logger.debug('[CHALLENGE]', `Listening to ${eventName} for challenge`);
        });
        blocklyWorkspace.addChangeListener(this._onFlyoutStateChanged);
        this.rootEl._fitBanner();

        this.engine.defineBehavior('banner', this._displayBanner, this._hideBanner);
        this.engine.defineBehavior('beacon', this._displayBeacon, this._hideBeacon);
        this.engine.defineBehavior('tooltips', this._displayTooltips, this._hideTooltips);

        this.engine.definePropertyProcessor([
            'beacon.target.flyout_block',
            'beacon.target.block',
            'tooltips.*.location.block',
            'tooltips.*.location.flyout_block',
        ], this.engine._processBlock.bind(this.engine));
        this.engine.definePropertyProcessor([
            'beacon.target.category',
            'beacon.target.flyout_block',
            'tooltips.*.location.category',
            'validation.blockly.open-flyout',
            'validation.blockly.create',
        ], this.engine._processPart.bind(this.engine));
        this.engine.definePropertyProcessor([
            'banner.head',
            'banner.text',
        ], this.rootEl._processMarkdown.bind(this));
    }
    localize(...args) {
        return this.rootEl.localize(...args);
    }
    setEditor(editor) {
        this.editor = editor;
    }
    initializeChallenge() {
        const { config } = this.editor;
        const challenge = this.store.getState();

        const { steps } = (challenge.scene || challenge);

        if (steps) {
            setTimeout(() => {
                this.engine.setSteps(steps);
                this.engine.start();
                this.challengeActions.updateSteps(this.engine.steps);
            }, config.CHALLENGE_START_DELAY || 500);
        }
    }
    _nextStep() {
        if (!this.engine) {
            return;
        }
        const isLastStep = this.isLastStep();
        const { hints } = this.store.getState();
        if (isLastStep) {
            this.emit('next-challenge');
        } else if (hints.enabled) {
            this.engine.nextStep();
        } else {
            this.challengeActions.enableHints();
        }
    }
    _save() {
        this.editor.share();
    }
    _editorChanged(e) {
        if (!this.engine) {
            return;
        }
        this.editor.logger.debug('[CHALLENGE]', `Editor fired: ${e.type}`, e);
        this.engine.triggerEvent(e.type, e);
    }
    _onStepChanged() {
        this.challengeActions.updateStepIndex(this.engine.stepIndex);
        const { history } = this.store.getState();
        if (history.ignoreNextStepChange) {
            // this.set('history.ignoreNextStepChange', false);
        } else if (this._shouldSaveStep()) {
            const { stepIndex } = this.engine;
            this.challengeActions.addHistoryRecord(stepIndex, Object.assign(this.editor.save()));
        }
        this.challengeActions.updateHistoryOptions(this.canGoBack(), this.canGoForward());
    }
    _onDone() {
        this.challengeActions.completeChallenge();
        this.trigger('completed');
    }
    _shouldSaveStep() {
        const { step } = this.engine;
        if (step && step.validation) {
            if (step.validation.blockly) {
                const { blockly } = step.validation;
                if (blockly['open-flyout'] || blockly.value) {
                    return true;
                }
            }
            if (step.validation['open-parts']) {
                return true;
            }
        }
        if (step && step.banner && step.banner['open-parts']) {
            return true;
        }

        return this.engine.stepIndex === this.engine.steps.length - 1;
    }
    _historyBack() {
        if (!this.canGoBack()) {
            return;
        }
        this.challengeActions.historyBack();
    }
    _historyForward() {
        if (!this.canGoForward()) {
            return;
        }
        this.challengeActions.historyForward();
    }
    canGoBack() {
        const { history } = this.store.getState();
        return history.backBuffer && history.backBuffer.length > 1;
    }
    canGoForward() {
        const { history } = this.store.getState();
        return history.forwardBuffer && history.forwardBuffer.length > 0;
    }
    _displayBanner(data) {
        clearTimeout(this.showButtonTimeout);
        let banner;
        const { hints } = this.store.getState();
        if (hints.enabled) {
            banner = Object.assign({}, data);
            banner.buttonLabel = data.buttonLabel || this.localize('NEXT', 'Next');
        } else {
            banner = {};
            const bannerProps = hints['disabled-banner'];
            if (bannerProps) {
                banner.head = bannerProps.head;
                banner.text = this.localize('HINTS', 'Hints');
                banner.buttonLabel = bannerProps.text;
                // Show hint button with delay
                banner.buttonState = 'hidden';
                this.showButtonTimeout = setTimeout(() => {
                    banner.buttonState = 'active';
                    this.challengeActions.updateBannerState(banner);
                }, 6000);
            }
        }
        const isLastStep = this.isLastStep();
        banner.showSaveButton = isLastStep;

        if (isLastStep) {
            banner.icon = null;
            banner.imgPage = 'star';
            const challenge = this.store.getState();
            banner.buttonLabel = challenge.next ? this.localize('NEXT_CHALLENGE', 'Next Challenge') : this.localize('BACK_TO_CHALLENGES', 'Back to Challenges');
        }
        this.challengeActions.updateBannerState(Object.assign({}, banner));
        if (data.lockdown) {
            this.challengeActions.enableLockdown();
        } else {
            this.challengeActions.disableLockdown();
        }
        // No animation or sound if the challenge has finished
        if (isLastStep) {
            return;
        }
        this.rootEl.animateBannerIn();
    }
    _hideBanner() {
        this.challengeActions.updateBannerState({});
        this.challengeActions.disableLockdown();
    }
    _displayBeacon(beacon) {
        this.challengeActions.updateBeacon(beacon);
    }
    _hideBeacon() {
        this.challengeActions.updateBeacon(null);
    }
    _displayTooltips(tooltips) {
        this.challengeActions.updateTooltips(tooltips);
    }
    _hideTooltips() {
        this.challengeActions.updateTooltips(null);
    }
    isLastStep() {
        return this.engine.stepIndex === this.engine.steps.length - 1;
    }
    setDefaultApp(defaultApp) {
        this.defaultApp = defaultApp;
    }
    registerProfile(profile) {
        this.profile = profile;
    }
    load(challenge) {
        const { toolbox } = this.profile;
        const { flyoutMode, variables, defaultApp } = (challenge.scene || challenge);
        // Filter Catergories to get the categories view of their features
        Challenge.enableToolboxWhitelist(challenge, toolbox);
        this.editor.registerProfile(this.profile);
        this.editor.editorActions.setFlyoutMode(flyoutMode);
        this.setSceneVariables(Challenge.getSceneVariables(toolbox));
        this.editor.loadVariables(variables);
        if (defaultApp) {
            this.editor.load(JSON.parse(defaultApp));
        } else {
            this.editor.load({});
        }
        this.challengeActions.load(challenge);
    }
    static getSceneVariables(toolbox) {
        const sceneVariables = {};
        Object.keys(toolbox).forEach((key) => {
            sceneVariables[`${key}_color`] = toolbox[key].colour;
        });
        return sceneVariables;
    }
    static filterToToolbox(filter) {
        return Object.keys(filter).reduce((acc, key) => {
            return acc.concat(filter[key].map(block => `${key}.${block}`));
        }, []);
    }
    static enableToolboxWhitelist(challenge, entries) {
        const {
            blocks,
            modules,
            filterBlocks,
            filterToolbox,
            toolbox,
        } = (challenge.scene || challenge);
        if (blocks) {
            return;
        }
        if (!modules) {
            return;
        }
        const filter = filterBlocks || filterToolbox;
        let toolboxWhitelist;
        if (filter) {
            toolboxWhitelist = Challenge.filterToToolbox(filter);
        } else {
            toolboxWhitelist = toolbox;
        }
        const whitelistMap = toolboxWhitelist.reduce((acc, path) => {
            const parts = path.split('.');
            const root = parts.shift();
            if (!acc[root]) {
                acc[root] = [];
            }
            acc[root].push(parts.join('.'));
            return acc;
        }, {});
        entries.forEach((entry) => {
            const id = entry.id || entry.name;
            if (whitelistMap[id]) {
                entry.whitelist = whitelistMap[id];
            } else {
                entry.whitelist = [];
            }
        });
    }
    setSceneVariables(variables) {
        this.challengeActions.loadVariables(variables);
    }
    inject(element = document.body, before = null) {
        if (this.injected) {
            return;
        }
        this.injected = true;
        element.appendChild(this.store.providerElement);
        if (before) {
            element.insertBefore(this.rootEl, before);
        } else {
            element.appendChild(this.rootEl);
        }
        this.editor.rootEl.setAttribute('slot', 'editor');
        this.editor.inject(this.rootEl);
    }
}

export default KanoCodeChallenge;

export { KanoCodeChallenge, Store, Challenge, ChallengeGeneratorPlugin };
