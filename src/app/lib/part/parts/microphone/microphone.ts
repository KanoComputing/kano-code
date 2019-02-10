import { Part, IPartContext } from '../../part.js';
import { part, property, component } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { Microphone } from '../../../output/microphone.js';
import { subscribeInterval, IDisposable } from '@kano/common/index.js';
import { transformLegacyMicrophone } from './legacy.js';

class MicrophoneComponent extends PartComponent {
    @property({ type: Number, value: 0 })
    public volume : number = 0;
    @property({ type: Number, value: 0 })
    public pitch : number = 0;
}

interface IThreshold {
    value : number;
    rising : boolean;
    callback: () => void;
    active : boolean;
}

@part('microphone')
export class MicrophonePart extends Part {
    @component(MicrophoneComponent)
    public core : MicrophoneComponent;
    private microphone? : Microphone;
    private thresholds : IThreshold[] = [];
    private thresholdSub : IDisposable|null = null;
    static transformLegacy(app : any) {
        transformLegacyMicrophone(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as MicrophoneComponent;
    }
    onInstall(context : IPartContext) {
        this.microphone = context.audio.microphone;
        this.microphone.start();
    }
    onStop() {
        if (this.thresholdSub) {
            this.thresholdSub.dispose();
        }
        this.thresholdSub = null;
        this.thresholds.length = 0;
    }
    _queryVolume() {
        if (this.microphone && this.microphone.started) {
            const currentVolume = this.core.volume;
            const volume = this.microphone.volume;
            if (currentVolume !== volume) {
                this.core.volume = this.microphone.volume;
                this.core.invalidate();
            }
        }
    }
    _queryPitch() {
        if (this.microphone && this.microphone.started) {
            const currentPitch = this.core.pitch;
            const pitch = this.microphone.pitch;
            if (currentPitch !== pitch) {
                this.core.pitch = this.microphone.pitch;
                this.core.invalidate();
            }
        }
    }
    get volume() {
        this._queryVolume();
        return this.core.volume;
    }
    get pitch() {
        this._queryPitch();
        return this.core.pitch;
    }
    private _executeThresholds() {
        this.thresholds.forEach((threshold) => {
            const isOver = this.volume > threshold.value;
            const isActive = threshold.active;
            const willBeActive = (threshold.rising && isOver) || (!threshold.rising && !isOver);
            if (!isActive && willBeActive) {
                threshold.callback();
            }
            threshold.active = willBeActive;
        });
    }
    private _startThresholdWatcher() {
        if (this.thresholdSub) {
            return;
        }
        this.thresholdSub = subscribeInterval(() => {
            this._executeThresholds();
        }, 32);
    }
    onEdge(type : 'rising'|'falling', value : number, callback : () => void) {
        this.thresholds.push({
            value,
            rising: type === 'rising',
            callback,
            active: false,
        });
        this._startThresholdWatcher();
    }
}