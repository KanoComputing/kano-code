import { Tracking } from '@kano/kwc-behaviors/kwc-tracking.js';
import { Store } from '../../scripts/kano/make-apps/store.js';

// @polymerBehavior
const KanoCodeTrackingBehaviorImpl = {
    properties: {
        blocklyInitialized: {
            type: Boolean,
            value: false
        },
        path: {
            type: String,
            value: ''
        },
        preserveSavedSession: {
            type: Boolean,
            value: true
        }
    },
    listeners: {
        'change': '_trackChanges',
        'track-challenge-event': '_trackChallengeEvent'
    },
    _initializeTracking(e) {
        this.fire('initialize-tracking', e);
        this.fire('tracking-event', {
            name: 'ide_opened',
            data: {}
        });
    },
    _getObjectProperty(obj, str) {
        /** Convert indices to properties */
        str = str.replace(/\[(\w+)\]/g, '.$1');
        /** Strip out leading dots */
        str = str.replace(/^\./, '');
        let arr = str.split('.');
        arr.forEach((item, index) => {
            let prop = arr[index];
            if (prop in obj) {
                obj = obj[prop];
            } else {
                return;
            }
        });
        return obj;
    },
    _trackChallengeAttempt(challengeAttempts, challenge) {
        let idString = this.browserId + Date.now().toString(),
            hashedId = md5(idString);
        challengeAttempts[challenge.id] = challengeAttempts[challenge.id] || [];
        challengeAttempts[challenge.id].push({
            id: hashedId,
            start: Date.now(),
            end: null
        });
        this.fire('tracking-event', {
            name: 'challenge_attempted',
            data: {
                challenge_attempt_id: hashedId,
                challenge_id: challenge.id,
                challenge_set_id: challenge.group,
                challenge_name: challenge.name
            }
        });
        localStorage.setItem('KANO-TRACKING-CHALLENGE-ATTEMPTS', JSON.stringify(challengeAttempts));
    },
    _trackChallengeCompletion(challengeAttempts, challenge) {
        let lastIndex = challengeAttempts[challenge.id].length - 1,
            lastAttempt = challengeAttempts[challenge.id][lastIndex],
            end = Date.now(),
            duration = (end - lastAttempt.start) / 1000;
        challengeAttempts[challenge.id][lastIndex].end = end;
        this.fire('tracking-event', {
            name: 'challenge_completed',
            data: {
                challenge_attempt_id: lastAttempt.id,
                challenge_id: challenge.id,
                challenge_name: challenge.name,
                challenge_set_id: challenge.group,
                time_in_challenge: duration.toFixed(2)
            }
        });
        localStorage.setItem('KANO-TRACKING-CHALLENGE-ATTEMPTS', JSON.stringify(challengeAttempts));
    },
    _trackChallengeEvent(e) {
        let storedAttempts = localStorage.getItem('KANO-TRACKING-CHALLENGE-ATTEMPTS'),
            challengeAttempts = {},
            eventType = e.detail.type,
            challenge = e.detail.data;
        if (storedAttempts) {
            challengeAttempts = JSON.parse(storedAttempts);
        }
        if (eventType === 'attempt') {
            this._trackChallengeAttempt(challengeAttempts, challenge);
        }
        if (eventType === 'complete') {
            this._trackChallengeCompletion(challengeAttempts, challenge);
        }
    },
    _trackBlocklyEvents(e) {
        let blockDetails,
            blockTypeAvailabe;
        /**
         * Only initialize Blockly event tracking after the user has
         * interacted, to exclude the setup of default and saved blocks.
         */
        if (e.type === Blockly.Events.UI ||
            e.type === Blockly.Events.OPEN_FLYOUT && !this.blocklyInitialized) {
            this.blocklyInitialized = true;
        }
        if (!this.blocklyInitialized) {
            return;
        }
        if (e.type === Blockly.Events.CREATE) {
            this.fire('tracking-event', {
                name: 'workspace_block_created',
                data: {
                    block_type: e.blockType
                }
            });
        }
        if (e.type === Blockly.Events.DELETE) {
            this.fire('tracking-event', {
                name: 'workspace_block_deleted',
                data: {
                    block_type: e.blockType
                }
            });
        }
        if (e.type === Blockly.Events.OPEN_FLYOUT) {
            this.fire('tracking-event', {
                name: 'workspace_toolbox_panel_opened',
                data: {
                    panel_type: e.categoryId
                }
            });
        }
    },
    _trackChanges(e) {
        if (!e.detail.type) {
            return;
        }
        let trackableChanges = {
            'open-parts': {
                eventName: 'parts_tray_opened'
            },
            'close-parts': {
                eventName: 'parts_tray_closed'
            },
            'add-part': {
                eventName: 'part_added',
                fields: {
                    part_name: 'part.label'
                }
            },
            'remove-part': {
                eventName: 'part_removed',
                fields: {
                    part_name: 'part.label'
                }
            },
            'select-part': {
                eventName: 'part_selected',
                fields: {
                    part_name: 'part.label'
                }
            },
            'change-part-volume': {
                eventName: 'part_volume_changed',
                fields: {
                    part_name: 'part.label',
                    muted: 'part.muted'
                }
            }
        }
        if (e.detail.type === 'blockly') {
            this._trackBlocklyEvents(e.detail.event);
        } else if (trackableChanges[e.detail.type]) {
            let name = trackableChanges[e.detail.type].eventName,
                data = {};
            if (trackableChanges[e.detail.type].fields) {
                let fields = Object.keys(trackableChanges[e.detail.type].fields);
                fields.forEach(field => {
                    let path = trackableChanges[e.detail.type].fields[field],
                        property = this._getObjectProperty(e.detail, path);
                    data[field] = property;
                });
            }
            this.fire('tracking-event', {
                name,
                data
            });
        }
    }
};

const { config } = Store.getState();

const KanoCodeTrackingBehavior = [
    Tracking(config),
    KanoCodeTrackingBehaviorImpl,
];

export { KanoCodeTrackingBehavior };
