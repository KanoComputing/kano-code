import '@polymer/neon-animation/animations/transform-animation.js';
import { ViewBehavior } from './kano-view-behavior.js';
import { GamificationBehavior } from './kano-gamification-behavior.js';
import { SDK } from '../../scripts/kano/make-apps/sdk.js';

/*
 * Convert base64/URLEncoded data component to raw binary data held in a string
 *
 * @param {String} dataURI
 * @return Blob
 */
export const dataURItoBlob = function dataURItoBlob(dataURI) {
    let byteString,
        mimeString,
        ia,
        i;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length);
    for (i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
};

var SharingBehaviorImpl = {

    properties: {
        remixedShare: {
            type: Object
        },
        shareInfo: {
            type: Object,
            value: function () {
                return {};
            },
            notify: true
        },
        isChallenge: {
            type: Boolean,
            value: false
        },
        /**
         * Holds the gamification engine response until it's time to bring the
         * reward modal.
         */
        gamificationResponse: {
            type: Object,
            value: null
        },
        shareContent: Object,
        user: {
            type: Object,
            linkState: 'user',
        }
    },
    listeners: {
        'cover-generated': '_onCoverGenerated'
    },
    observers: [
        '_userChanged(user)'
    ],
    _goToPage(page) {
        this.set('shareInfo.page', page);
        this.modal.refit();
    },
    _onCoverGenerated() {
        if (this.shareInfo.autoshare) {
            this._shareApp({
                share: true
            });
            this._goToPage('saving');
        }
    },
    _shareApp(options) {
        // Generates the standalone component
        let savedApp,
            attachment,
            appName = 'make-apps',
            cover = this.shareInfo.coverBlob,
            spritesheet = this.shareInfo.spriteSheetBlob,
            files,
            trackingData = {},
            taggableParts = [
                'gyro-accelerometer',
                'motion-sensor',
                'speaker',
                'microphone'
            ],
            animationBlob,
            workspaceInfo,
            hardware = this.shareInfo.parts.filter(part => {
                return part.partType === 'hardware' &&
                    taggableParts.indexOf(part.type) >= 0;
            }).map(part => {
                return { product: part.type };
            });

        if (this.shareInfo.workspaceInfo) {
            workspaceInfo = new Blob(
                [this.shareInfo.workspaceInfo],
                { type: 'application/json' }
            );
            workspaceInfo.filename = 'workspace_info.json';
            if (!this.shareInfo.animation) {
                let parts = this.shareInfo.parts,
                    firstAnimationPart;
                for (let i = 0; i < parts.length; i++) {
                    if (parts[i].type === 'light-animation') {
                        firstAnimationPart = parts[i];
                        break;
                    }
                }
                if (firstAnimationPart) {
                    this.shareInfo.animation = {
                        bitmaps: firstAnimationPart.userProperties.bitmaps,
                        speed: firstAnimationPart.userProperties.speed
                    }
                }
            }
        }

        // Eventually transform if needed
        if (this.shareInfo.animation) {
            animationBlob = new Blob(
                [JSON.stringify(this.shareInfo.animation)],
                { type: 'application/json' }
            );
            animationBlob.filename = 'animation.json';
        }

        if (this.shareInfo.mode.id === 'lightboard') {
            hardware.push({product: 'lightboard'});
        }

        if (this.remixedShare) {
            trackingData.remixed_from_project_id = this.remixedShare.id;
        }

        if (this.shareInfo.mode.sharing.cover === 'still') {
            cover.filename = 'cover.png';
        } else {
            cover.filename = 'cover.gif';
        }

        this.set('shareInfo.loading', true);

        trackingData.project_type = appName;

        files = {
            cover: cover,
            workspace_info: workspaceInfo,
            animation: animationBlob
        };

        if (this.shareInfo.mode.sharing.spritesheet && spritesheet) {
            spritesheet.filename = 'spritesheet.png';
            files.lightboard_spritesheet = spritesheet;
        }

        const sdk = new SDK(this.config);

        //Share by calling the API
        return sdk.postShare({
            app: appName,
            title: this.shareInfo.title,
            description: this.shareInfo.description,
            files: files,
            is_private: this.shareInfo.is_private || false,
            hardware: hardware
        })
        .then((res) => {
            let share = res.item;
            // Generate the html file with the slug as component name
            savedApp = Kano.AppModules.generateStandaloneComponent(
                share.slug,
                this.shareInfo.parts,
                this.shareInfo.background,
                this.shareInfo.mode,
                this.shareInfo.code
            );
            // Create the attachment
            attachment = new Blob([savedApp], { type: 'text/html' });
            attachment.filename = 'code.html';
            // Attach the file to the share
            return sdk.attachToShare({ id: share.id, files: { attachment } });
        })
        .then((res) => {
            const share = res.item;
            trackingData.project_id = share.id;
            return res.item;
        })
        .catch((err) => {
            throw new Error(err);
        })
        .then((share) => {
            this.fire('share-successful');
            this.set('shareInfo.id', share.id);
            this.set('shareInfo.slug', share.slug);

            if (options && options.share) {
                this.fire('tracking-event', {
                    name: 'shared_project',
                    data: trackingData
                });
            }
            if (!this.shareInfo.is_private) {
                this._goToPage('success');
            }
            return share;
        })
        .then((share) => {
            // Check if it's a creation you made from scratch or a challenge
            if (!this.isChallenge) {
                // Hit the gamification engine
                let payload = [
                    {
                        name: 'share-creation',
                        detail: {
                            id: share.id
                        }
                    },
                    {
                        name: 'xp',
                        detail: {
                            value: 10
                        }
                    }
                ];
                this.triggerGamificationEngine(payload)
                    .then((response) => {
                        this.set('gamificationResponse', response);
                    });
            }
            return share;
        }).catch((e) => {
            console.error(e);
            this.fire('share-attempted');
            this._goToPage('failure');
        });
    },
    _generateAppFromAnimation (animation) {
        let partModels = Parts.list,
            part;
        for (let i = 0; i < partModels.length; i++) {
            if (partModels[i].type === 'light-animation') {
                partModel = partModels[i];
                break;
            }
        }
        part = Parts.create(partModel);
        part.userProperties.width = 16;
        part.userProperties.height = 8;
        part.userProperties.speed = animation.speed;
        part.userProperties.bitmaps = animation.bitmaps;
        Parts.create({ partType: 'ui', type: 'light-animation' });
        return {
            "parts": [part],
            "source": `<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"part_event\" id=\"default_part_event_id\" x=\"290\" y=\"120\"><field name=\"EVENT\">global.start</field><statement name=\"DO\"><block type=\"${part.id}#animation_play\" id=\"8?f2Z?XEcG~%9dcJ=~i1\"></block></statement></block></xml>`,
            "code": `global.when('start', function () {\n  devices.get('${part.id}').play();\n});\n`,
            "background": "#ffffff",
            "mode":"lightboard",
        };
    },
    /**
    * Opens the sharing modal and shares the app
    */
    shareAnimation(e) {
        let animation = e.detail.animation,
            mode = Kano.MakeApps.Mode.modes['lightboard'],
            app = this._generateAppFromAnimation(animation),
            shareInfo, component, slug, appData;
        slug = Date.now().toString();
        appData = this._generateAppFromAnimation(animation);
        component = Kano.AppModules.generateStandaloneComponent(
            slug,
            appData.parts,
            appData.background,
            Kano.MakeApps.Mode.modes[appData.mode],
            appData.code);

        shareInfo = {
            animation: animation,
            page: 'sharing-form',
            title: e.detail.title || '',
            description: '',
            id: null,
            background: app.background,
            parts: app.parts,
            code: app.code,
            app: {
                slug,
                component
            },
            workspaceInfo: JSON.stringify(app),
            mode
        };

        this.set('shareInfo', shareInfo);
        this.modal.animationConfig = {
            entry: [{
                name: 'transform-animation',
                transformFrom: 'scale(1.5)',
                node: this.modal,
                timing: {
                    duration: 200
                }
            },{
                name: 'fade-in-animation',
                node: this.modal,
                timing: {
                    duration: 200
                }
            }],
            exit: {
                name: 'fade-out-animation',
                node: this.modal,
                timing: {
                    duration: 200
                }
            }
        };
        let onAppReady = () => {
            this.modal.refit();
            this.modal.removeEventListener('app-ready', onAppReady);
        };
        this.modal.addEventListener('app-ready', onAppReady);
        this.modal.open();
    },
    /**
    * Opens the sharing modal and shares the app
    */
    share(e) {
        const { app, mode } = e.detail;
        const slug = Date.now().toString();
        const component = Kano.AppModules.generateStandaloneComponent(
            slug,
            app.parts,
            app.background,
            mode,
            app.code);
        const shareInfo = {
            app: {
                slug,
                component
            },
            workspaceInfo: e.detail.workspaceInfo,
            page: 'sharing-form',
            title: e.detail.title || '',
            description: '',
            id: null,
            background: e.detail.background,
            parts: e.detail.parts,
            code: e.detail.code,
            mode,
            autoshare: e.detail.autoshare,
        };

        this.set('shareInfo', shareInfo);
        this.modal.animationConfig = {
            entry: [{
                name: 'transform-animation',
                transformFrom: 'scale(1.5)',
                node: this.modal,
                timing: {
                    duration: 200
                }
            },{
                name: 'fade-in-animation',
                node: this.modal,
                timing: {
                    duration: 200
                }
            }],
            exit: {
                name: 'fade-out-animation',
                node: this.modal,
                timing: {
                    duration: 200
                }
            }
        };
        let onAppReady = () => {
            this.modal.refit();
            this.modal.removeEventListener('app-ready', onAppReady);
        };
        this.modal.addEventListener('app-ready', onAppReady);
        this.modal.open();
    },

    _userChanged(user) {
        // user just logged out, nothing to do
        if (!user) {
            return;
        }
        // The user logged in and the sharing was waiting authentication, trigger the share
        if (this.waitingAuth && !this.shareInfo.is_private) {
            this.confirmShare(this.shareContent);
        }
    },

    confirmShare(e) {
        // The user is not authenticated
        if (!this.user) {
            // Flag the sharing as waiting authentication and trigger a login event
            this.waitingAuth = true;
            this.shareContent = e.detail;
            return this.fire('login');
        }
        this._shareApp(e.detail);

        if (!this.shareInfo.is_private) {
            this._goToPage('saving');
        }

    },

    dismissShare() {
        this.modal.close();
        let rewardModal = this.$['reward-modal'];
        if (rewardModal) {
            rewardModal.process(this.gamificationResponse, this.user);
            this.set('gamificationResponse', null);
        }
    }
};

// @polymerBehavior
export const SharingBehavior = [
    ViewBehavior,
    GamificationBehavior,
    SharingBehaviorImpl];
