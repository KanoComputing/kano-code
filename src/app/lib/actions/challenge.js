import Store from '../store.js';

const CONSTANTS = [
    'LOAD_CHALLENGE',
    'LOAD_VARIABLES',
    'UPDATE_STEP_INDEX',
    'UPDATE_STEPS',
    'DISABLE_BANNER_BUTTON',
    'ENABLE_BANNER_BUTTON',
    'UPDATE_BANNER_STATE',
    'ENABLE_LOCKDOWN',
    'DISABLE_LOCKDOWN',
    'ADD_HISTORY_RECORD',
    'HISTORY_BACK',
    'HISTORY_FORWARD',
    'UPDATE_HISTORY_OPTIONS',
    'COMPLETE_CHALLENGE',
    'UPDATE_BEACON',
    'UPDATE_TOOLTIPS',
    'ENABLE_HINTS',
];
const CHALLENGE_TYPES = Store.types(CONSTANTS);

const BANNER_ICONS = {
    default: '/assets/avatar/judoka-face.svg',
};
const ChallengeActions = (store) => {
    function getProgress() {
        const state = store.getState();
        if (!state.steps) {
            return 0;
        }
        return state.stepIndex / (state.steps.length - 1);
    }
    store.addMutator(function challengeActions(action) {
        switch (action.type) {
        case CHALLENGE_TYPES.LOAD_CHALLENGE: {
            const challenge = this.get('state');
            this.set('state', Object.assign({}, challenge, action.challenge));
            break;
        }
        case CHALLENGE_TYPES.LOAD_VARIABLES: {
            this.set('state.variables', action.variables);
            break;
        }
        case CHALLENGE_TYPES.UPDATE_STEP_INDEX: {
            this.set('state.stepIndex', action.index);
            this.set('state.userProgress', getProgress());
            break;
        }
        case CHALLENGE_TYPES.UPDATE_STEPS: {
            this.set('state.steps', action.steps);
            this.set('state.userProgress', getProgress());
            break;
        }
        case CHALLENGE_TYPES.DISABLE_BANNER_BUTTON: {
            this.set('state.bannerButtonInactive', true);
            break;
        }
        case CHALLENGE_TYPES.ENABLE_BANNER_BUTTON: {
            this.set('state.bannerButtonInactive', false);
            break;
        }
        case CHALLENGE_TYPES.UPDATE_BANNER_STATE: {
            const banner = action.state;
            const buttonIsInactive = this.get('state.bannerButtonInactive');
            banner.head = banner.head || null;
            banner.buttonLabel = banner.next_button ? banner.buttonLabel : null;
            if (banner.buttonLabel && !banner.buttonState) {
                if (buttonIsInactive) {
                    banner.buttonState = 'inactive';
                } else {
                    banner.buttonState = 'active';
                }
            } else {
                banner.buttonState = 'hidden';
            }
            if (banner.animation) {
                banner.imgPage = banner.animation;
                banner.icon = null;
            } else if (banner.icon) {
                banner.icon = BANNER_ICONS[banner.icon];
                banner.imgPage = null;
            } else {
                banner.icon = null;
            }
            banner.imgPage = banner.imgPage || 'judoka';
            this.set('state.banner', banner);
            break;
        }
        case CHALLENGE_TYPES.ENABLE_LOCKDOWN: {
            this.set('state.lockdown', true);
            break;
        }
        case CHALLENGE_TYPES.DISABLE_LOCKDOWN: {
            this.set('state.lockdown', false);
            break;
        }
        case CHALLENGE_TYPES.ADD_HISTORY_RECORD: {
            this.push('state.history.backBuffer', {
                stepNumber: action.stepNumber,
                editorState: action.editorState,
            });
            this.set('state.history.forwardBuffer', []);
            break;
        }
        case CHALLENGE_TYPES.HISTORY_BACK: {
            const currentState = this.pop('state.history.backBuffer');
            const history = this.get('state.history');
            const record = history.backBuffer[history.backBuffer.length - 1];
            this.push('state.history.forwardBuffer', currentState);
            // Kano.MakeApps.Parts.clear();
            // this.editor.load(record.editorState, Kano.MakeApps.Parts.list);
            // TODO set the editor state
            this.set('state.history.ignoreNextStepChange', true);
            break;
        }
        case CHALLENGE_TYPES.HISTORY_FORWARD: {
            const record = this.pop('state.challenge.history.forwardBuffer');
            this.push('state.history.backBuffer', record);
            // Kano.MakeApps.Parts.clear();
            // this.editor.load(record.editorState, Kano.MakeApps.Parts.list);
            // TODO set the editor state
            this.set('state.history.ignoreNextStepChange', true);
            break;
        }
        case CHALLENGE_TYPES.UPDATE_HISTORY_OPTIONS: {
            this.set('state.history.canGoBack', action.canGoBack);
            this.set('state.history.canGoForward', action.canGoForward);
            break;
        }
        case CHALLENGE_TYPES.COMPLETE_CHALLENGE: {
            const challenge = this.get('state');
            const { show_remix_options, autoshare_disabled } = (challenge.scene || challenge);
            if (show_remix_options) {
                this.set('scene.completed', true);
            }
            if (autoshare_disabled) {
                this.set('scene.autoshareDisabled', true);
            }
            break;
        }
        case CHALLENGE_TYPES.UPDATE_BEACON: {
            const hintsEnabled = this.get('state.hints.enabled');
            if (!hintsEnabled) {
                this.set('state.beacon', null);
            } else {
                this.set('state.beacon', action.beacon);
            }
            break;
        }
        case CHALLENGE_TYPES.UPDATE_TOOLTIPS: {
            const hintsEnabled = this.get('state.hints.enabled');
            if (!hintsEnabled) {
                this.set('state.tooltips', null);
            } else {
                this.set('state.tooltips', action.tooltips);
            }
            break;
        }
        case CHALLENGE_TYPES.ENABLE_HINTS: {
            this.set('state.hints.enabled', true);
            break;
        }
        default: {
            break;
        }
        }
    });

    return {
        load(challenge) {
            store.dispatch({ type: CHALLENGE_TYPES.LOAD_CHALLENGE, challenge });
        },
        loadVariables(variables) {
            store.dispatch({ type: CHALLENGE_TYPES.LOAD_VARIABLES, variables });
        },
        updateStepIndex(index) {
            store.dispatch({ type: CHALLENGE_TYPES.UPDATE_STEP_INDEX, index });
        },
        updateSteps(steps) {
            store.dispatch({ type: CHALLENGE_TYPES.UPDATE_STEPS, steps });
        },
        disableBannerButton() {
            store.dispatch({ type: CHALLENGE_TYPES.DISABLE_BANNER_BUTTON });
        },
        enableBannerButton() {
            store.dispatch({ type: CHALLENGE_TYPES.ENABLE_BANNER_BUTTON });
        },
        updateBannerState(banner = {}) {
            store.dispatch({ type: CHALLENGE_TYPES.UPDATE_BANNER_STATE, state: banner });
        },
        enableLockdown() {
            store.dispatch({ type: CHALLENGE_TYPES.ENABLE_LOCKDOWN });
        },
        disableLockdown() {
            store.dispatch({ type: CHALLENGE_TYPES.DISABLE_LOCKDOWN });
        },
        updateHistoryOptions(canGoBack, canGoForward) {
            store.dispatch({ type: CHALLENGE_TYPES.UPDATE_HISTORY_OPTIONS, canGoBack, canGoForward });
        },
        addHistoryRecord(stepIndex, editorState) {
            store.dispatch({ type: CHALLENGE_TYPES.ADD_HISTORY_RECORD, stepIndex, editorState });
        },
        completeChallenge() {
            store.dispatch({ type: CHALLENGE_TYPES.COMPLETE_CHALLENGE });
        },
        updateBeacon(beacon) {
            store.dispatch({ type: CHALLENGE_TYPES.UPDATE_BEACON, beacon });
        },
        updateTooltips(tooltips) {
            store.dispatch({ type: CHALLENGE_TYPES.UPDATE_TOOLTIPS, tooltips });
        },
        historyBack() {
            store.dispatch({ type: CHALLENGE_TYPES.HISTORY_BACK });
        },
        historyForward() {
            store.dispatch({ type: CHALLENGE_TYPES.HISTORY_FORWARD });
        },
        enableHints() {
            store.dispatch({ type: CHALLENGE_TYPES.ENABLE_HINTS });
        },
    };
};

export default ChallengeActions;
