import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/web-components/kano-reward-modal/kano-reward-modal.js';
import '@kano/web-components/kano-alert/kano-alert.js';
import { SoundPlayerBehavior } from '@kano/web-components/kano-sound-player-behavior/kano-sound-player-behavior.js';
import '../../elements/kano-app-challenge/kano-app-challenge.js';
import '../../elements/kano-app-editor/kano-app-editor.js';
import '../../elements/kano-challenge-completed-modal/kano-challenge-completed-modal.js';
import '../../elements/kano-share-modal/kano-share-modal.js';
import { SharingBehavior } from '../../elements/behaviors/kano-sharing-behavior.js';
import { GABehavior } from '../../elements/behaviors/kano-code-ga-tracking-behavior.js';
import { I18nBehavior } from '../../elements/behaviors/kano-i18n-behavior.js';
import '../../scripts/kano/make-apps/blockly/blockly.js';
import '../../scripts/kano/util/router.js';
import { Stories } from '../../scripts/kano/make-apps/stories.js';
import { Progress } from '../../scripts/kano/make-apps/progress.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import '../../scripts/kano/make-apps/actions/app.js';
import { Utils } from '../../scripts/kano/make-apps/utils.js';
import { experiments } from '../../scripts/kano/make-apps/experiments.js';
import { ViewBehavior } from '../../elements/behaviors/kano-view-behavior.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { Editor, UserPlugin, PartsPlugin, Runner, Mode } from '../../lib/index.js';
import { PartTypes, Parts } from '../../lib/parts/all.js';
import { AllModules } from '../../lib/app-modules/all.js';
import { AllApis } from '../../lib/meta-api/modules/all.js';
import { Challenge } from '../../lib/challenge/index.js';

const behaviors = [
    ViewBehavior,
    SharingBehavior,
    GABehavior,
    I18nBehavior,
    SoundPlayerBehavior,
];

class KanoViewStory extends Store.StateReceiver(
    mixinBehaviors(behaviors, PolymerElement)
) {
    static get is() { return 'kano-view-story'; }
    static get template() {
        return html`
            <style>
            :host {
                @apply --layout-vertical;
                position: relative;
                transition: opacity 200ms linear;
            }
            :host([loading]) {
                opacity: 0;
            }
            :host kano-app-challenge {
                @apply --layout-flex;
            }
            :host kano-app-editor {
                @apply --layout-flex;
            }
            paper-dialog {
                border-radius: 5px;
                overflow: hidden;
                background: transparent;
            }
            paper-dialog#share-modal kano-share-modal {
                padding: 0px;
                margin: 0px;
            }
            .bolt {
                background: black;
                width: 11px;
                height: 11px;
                margin: 3px 4px;
                border-radius: 2px;
                padding: 3px;
            }
        </style>
        <paper-dialog id="share-modal" opened={{shareOpened}} modal>
            <kano-share-modal id="share-modal-content"
                            on-confirm="confirmShare"
                            on-dismiss="dismissShare"
                            on-share-attempted="_setUserShared"
                            on-share-successful="_setUserShared"
                            opened="[[shareOpened]]"
                            on-next-story="goToNextChallenge"
                            share-info="{{shareInfo}}"
                            world-url="[[config.WORLD_URL]]"
                            is-authenticated="[[user]]"
                            in-challenge>
                            </kano-share-modal>
        </paper-dialog>
        <kano-challenge-completed-modal id="challenge-completed"></kano-challenge-completed-modal>
        <kano-reward-modal id="reward-modal"
                           on-request-signup="_openSignup"
                           sound="/assets/audio/samples/challenge_complete.wav"></kano-reward-modal>
        <kano-alert id="leave-alert"
                    heading="[[localize('NOT_FINISHED', 'Oh oh.. not finished yet!')]]"
                    text="[[localize('LEAVE_CHALLENGE', 'Are you sure you want to leave the challenge?')]]"
                    entry-animation="from-big-animation"
                    with-backdrop>
            <button class="kano-alert-primary" on-tap="_confirmExit" dialog-confirm slot="actions">[[localize('CONFIRM', 'Confirm')]]</button>
            <button class="kano-alert-secondary" dialog-dismiss slot="actions">[[localize('CANCEL', 'Cancel')]]</button>
        </kano-alert>
        <kano-alert id="load-app-alert"
            heading="[[localize('NOT_FINISHED', 'Oh oh.. not finished yet!')]]"
            text="[[localize('LEAVE_CHALLENGE', 'Are you sure you want to leave the challenge?')]]"
            entry-animation="from-big-animation"
            opened="[[loadingApp]]"
            with-backdrop>
            <button class="kano-alert-primary" on-tap="_confirmLoadApp" dialog-confirm slot="actions">[[localize('CONFIRM', 'Load app')]]</button>
            <button class="kano-alert-secondary" dialog-dismiss slot="actions">[[localize('CANCEL', 'Cancel')]]</button>
        </kano-alert>
        `;
    }
    static get properties() {
        return {
            loading: {
                type: Boolean,
                value: true,
                reflectToAttribute: true,
            },
            context: {
                linkState: 'routing.context',
                observer: '_contextChanged',
            },
            store: {
                type: Object,
                value: () => ({}),
            },
            story: {
                type: Object,
                linkState: 'challenge',
            },
            scene: {
                type: Object,
                linkState: 'challenge.scene',
            },
            addedParts: {
                type: Array,
            },
            sceneVariables: {
                type: Object,
            },
            remix: {
                type: Boolean,
                value: false,
                observer: '_remixChanged',
            },
            code: Object,
            customAlert: Boolean,
            loadingApp: {
                type: Object,
                linkState: 'story.loadingApp',
            },
            editorApp: {
                type: Object,
                linkState: 'editor.app',
                observer: '_editorAppChanged',
            },
        };
    }
    static get observers() {
        return [
            '_completedChanged(scene.completed)',
            '_addedPartsChanged(addedParts.splices)',
        ];
    }
    constructor() {
        super();
        const { config } = this.getState();
        this.progress = new Progress(config);
        this._nextChallenge = this._nextChallenge.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        const { config } = this.getState();

        this.modal = this.$['share-modal'];

        this.editor = new Editor(config);

        const userPlugin = new UserPlugin();
        this.editor.addPlugin(userPlugin);

        this.partsPlugin = new PartsPlugin(PartTypes);
        this.editor.addPlugin(this.partsPlugin);

        this.editor.toolbox.setEntries(AllApis);

        this.runner = new Runner(AllModules);
        this.editor.addPlugin(this.runner);

        this.challenge = new Challenge(this.partsPlugin);
        this.challenge.setParts(Parts);
        this.challenge.on('completed', this.challengeCompleted.bind(this));

        this.editor.addPlugin(this.challenge);

        this._onModalChanged = this._onModalChanged.bind(this);

        this.addEventListener('opened-changed', this._onModalChanged);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('opened-changed', this._onModalChanged);
    }
    _contextChanged() {
        this.loading = true;
        // Load challenge data
        Stories.getById(this.context.params.id)
            .then((story) => {
                if (typeof story.next === 'string') {
                    // Load next challenge as well if needed
                    return Stories.getById(story.next)
                        .then((nextStory) => {
                            this.set('story.next', nextStory);
                            return story;
                        })
                        .catch(() => {
                            return story;
                        });
                }
                return story;
            })
            .then((story) => {
                // Legacy challenge structure has challenges in scenes. We now only load the first scene as the whole challenge
                const sceneIndex = 0;
                // Load challenge data (nested, legacy)
                return Stories.getSceneByIndex(story, sceneIndex)
                    .then((scene) => {
                        // FIXME This merging of scene and scene data will not be necessary once we restructure the challenge files
                        story.scene = Object.assign({}, scene, scene.data);
                        delete story.scene.data;
                        return this.loadMode(story.scene.mode || 'normal');
                    })
                    .then((mode) => {
                        this.setupEditor();
                        this.challenge.load(story, mode);
                        this.$['share-modal-content'].set('nextButtonLabel', Boolean(this.story.next) ? this.localize('NEXT_CHALLENGE', 'Next Challenge') : this.localize('BACK_TO_CHALLENGES', 'Back to Challenges'));
                        this.loading = false;
                    });
            });
    }
    loadMode(id) {
        const url = `/mode/${id}.js`;
        return Mode.load(id, url);
    }
    save() {}
    setupEditor() {
        if (this.injected) {
            return;
        }
        this.injected = true;
        this.challenge.inject(this.root, this.root.firstChild);
        this.editor.on('share', (shareInfo) => this.share({ detail: shareInfo }));
        this.editor.on('exit', () => this._exit());
        this.editor.on('change', () => this.save());
        this.editor.on('save', () => this.saveApp());

        this.challenge.on('next-challenge', this._nextChallenge);

        this.editor.setRunningState(true);
    }
    _nextChallenge() {
        this.goToNextChallenge();
    }
    _editorAppChanged() {
        if (!this.editorApp) {
            return;
        }
        // TODO replace this when routing is based on flow-down
        page.redirect('/');
    }
    _onFileDropped(contents) {
        let app;
        try {
            app = JSON.parse(contents);
            this.dispatch({ type: 'LOAD_APP_FROM_STORY', data: app });
        } catch (e) {}
    }
    _confirmLoadApp() {
        const state = this.getState();
        this.dispatch({ type: 'LOAD_EDITOR_APP', data: state.story.loadingApp });
    }
    challengeCompleted() {
        const challenge = this.challenge.store.getState();

        this.fire('ga-tracking-event', {
            event: 'worldTutorialCompleted'
        });

        this.trackUserProgress(challenge.id);
        //story completed
        let progress = challenge.progress,
            extension = challenge.extension ? challenge.id : null;
        this.progress.updateProgress(progress.group, progress.storyNo, extension, challenge.id);
        this.customAlert = false;
        this._displayUserReward();
    }
    _completedChanged(completed) {
        if (completed) {
            this.remix = true;
            this.editor.rootEl.generateCover().then((image) => {
                this.appPreview = image.src;
            });
        }
    }
    goToNextChallenge() {
        let storyId;
        if (!this.story.next) {
            this.fire('exit-confirmed');
            return;
        }

        if (this.story.next) {
            window.history.pushState(null, null, `/story/${this.story.id}`);
            page.redirect(`/story/${this.story.next.id}`);
        }
    }
    _displayUserReward() {
        const headers = new Headers();
        const flags = experiments.getFlags();
        let fakeGamificationData;
        const challenge = this.challenge.store.getState();
        const payload = {
            name: 'kano-code-challenge-completed',
            detail: {
                id: challenge.id
            }
        };
        const trackingData = {
            id: challenge.id,
            name: challenge.name
        };
        if (challenge.progress && challenge.progress.group) {
            trackingData.group = challenge.progress.group;
        }
        this.fire('track-challenge-event', {
            type: 'complete',
            data: trackingData
        });
        // this.bannerButtonInactive = true;
        // this.$.challenge.computeBanner(this.currentStep);
        this.triggerGamificationEngine(payload)
            .then(res => {
                // this.bannerButtonInactive = false;
                // this.$.challenge.computeBanner(this.currentStep);
                this._trackRewards(res.update);
                this.$['reward-modal'].open(res, this.user);
                this.fire('update-user-progress', res.update);
            });
    }
    _trackRewards(update) {
        let levelChanges = update.levels && update.levels.changes,
            badgeChanges = update['badges-basic'] && update['badges-basic'].changes,
            xpChanges = levelChanges && levelChanges['total-xp'];
        if (xpChanges) {
            this.fire('tracking-event', {
                name: 'xp_earned',
                data: {
                    previous_level: xpChanges.oldValue,
                    new_level: xpChanges.newValue,
                    xp_earned: xpChanges.newValue - xpChanges.oldValue,
                    leveled_up: !!levelChanges.level
                }
            });
        }
        if (badgeChanges) {
            badgeChanges.new.forEach(badge => {
                this.fire('tracking-event', {
                    name: 'badge_unlocked',
                    data: {
                        badge_id: badge.id,
                        badge_name: badge.title
                    }
                });
            });
        }
    }
    _openSignup() {
        this.fire('signup');
    }
    _setUserShared() {
        this.set('user.hasSharedInSession', true);
    }
    _confirmExit() {
        this.fire('exit-confirmed');
    }
    _exit() {
        if (this.customAlert) {
            this.$['leave-alert'].open();
        } else {
            this.fire('exit-confirmed');
        }
    }
    resetAppState() {
        this.$.editor.resetAppState();
    }
    _runningChanged() {
        if (!this.scene || !this.scene.started) {
            return;
        }
        Kano.Behaviors.EditorViewBehaviorImpl._runningChanged.apply(this, arguments);
    }
    loadApp(e) {
        let id = e.detail,
            savedState,
            challenge;
        savedState = this.fromStore(id);
        challenge = this.$.challenge;
        this.$.editor.load(savedState.app, this._computeParts());
        challenge.set('stepIds', savedState.stepIds);
        challenge.set('blockIds', savedState.blockIds);
    }
    saveApp(e) {
        let id = e.detail.id || 'current',
            blockIds = e.detail.blockIds,
            stepIds = e.detail.stepIds,
            app = this.$.editor.save(true, false);
        this.addToStore(id, {
            app,
            blockIds,
            stepIds
        });
    }
    shareApp() {
        this.$.editor.share();
    }
    saveToStorage() {
        let app = this.$.editor.save();
        localStorage.setItem('savedApp', JSON.stringify(app));
    }
    showHints() {
        this.set('banner', null);
        this.computeBanner(this.currentStep);
        this.set('state.hints', { enabled: true });
    }
    _concludeStory() {
        // Go to next story or share automatically
        Utils.onLine().then((isOnline) => {
            if (!this.user || this.user.hasSharedInSession || this._userAlreadyShared(this.story) ||
                    this.scene.autoshareDisabled || !isOnline) {
                this.goToNextChallenge();
            } else {
                const detail = this.$.editor.compileApp();
                detail.title = this.story.name;
                detail.autoshare = true;
                this.scene.autoshareDisabled = true;
                this.running = false;
                this.share({ detail });
            }
        });
    }
    _userAlreadyShared(story) {
        const progress = this._getUserProgress(this.user);
        return progress.indexOf(story.id) > -1;
    }
    _getUserProgress(user) {
        let groups = this._getProgressGroups(user),
            stories = [];
        if (groups) {
            Object.keys(groups).forEach(key => {
                stories = stories.concat(groups[key].completedStories);
            });
        }
        return stories;
    }
    _getProgressGroups(user) {
        return user && user.profile && user.profile.stats['make-apps'] &&
                user.profile.stats['make-apps'].progress || null;
    }
    _pauseAndShare(e) {
        this.running = false;
        this.share(e);
        e.preventDefault();
        e.stopPropagation();
    }
    _remixChanged(remix) {
        if (remix) {
            this.editor.setMode(this.originalMode);
            // // Look for the previously removed blocks in the addedParts
            // this.addedParts.forEach((part, i) => {
            //     // Some blocks were removed, we need to add them back
            //     if (part.removedBlocks) {
            //         // Go through all the removed blocks and inject them back in the blocks array
            //         Object.keys(part.removedBlocks).forEach(index => {
            //             this.splice(`addedParts.${i}.blocks`, index, 0, part.removedBlocks[index]);
            //         });
            //         delete part.removedBlocks;
            //     }
            // });
        }
    }
    /**
     * Observes the `addedParts` array. Goes through the added splice and removes the blocks from a part if needed.
     * Stores the removed blocks in a `removedBlocks` object for future re-injection
     */
    _addedPartsChanged (e) {
        if (!e || this.remix || !this.scene.filterBlocks) {
            return;
        }
        e.indexSplices.forEach(splice => {
            splice.object.forEach(part => {
                Object.keys(this.scene.filterBlocks).forEach(key => {
                    if (part.id !== key) {
                        return;
                    }
                    part.blocks = part.blocks.filter((block, index) => {
                        let id, definition, remove;
                        if (typeof block === 'string') {
                            id = block;
                        } else {
                            definition = block.block(part);
                            id = definition.id
                        }
                        remove = this.scene.filterBlocks[key].indexOf(id) === -1;
                        // We're about to remove the block from the part. Save it under another object to
                        // be able to inject it back later
                        if (remove) {
                            part.removedBlocks = part.removedBlocks || {};
                            part.removedBlocks[index] = block;
                        }
                        return !remove;
                    });
                });
            });
        });
    }
    _onModalChanged(e) {
        if (!this.story) {
            return;
        }
        //TODO Refactor this when challenge modal is implemented similarly to share-modal i.e. as child of a paper dialog
        const pathIds = dom(e).path.map(path => path.id);

        if (pathIds.indexOf('share-modal') > -1 || pathIds.indexOf('reward-modal') > -1) {
            this.set('story.paused', e.detail.value);
        }
    }
    addToStore(id, data) {
        this.store[id] = data;
    }
    fromStore(id) {
        return this.store[id];
    }
    askEditorToShare() {
        this.editor.share();
    }
}

customElements.define(KanoViewStory.is, KanoViewStory);
