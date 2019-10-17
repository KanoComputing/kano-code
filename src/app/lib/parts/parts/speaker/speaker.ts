import { Part, IPartContext } from '../../part.js';
import { part, property, component } from '../../decorators.js';
import { samples, ISample, ISampleSet } from './data.js';
import { SamplePlayer } from '../../../music/sample-player.js';
import { PartComponent } from '../../component.js';
import Output from '../../../output/output.js';
import { join } from '../../../util/path.js';
import { transformLegacySpeaker } from './legacy.js';

const bufferCache : Map<string, AudioBuffer> = new Map();

class SpeakerComponent extends PartComponent {
    @property({ type: Number, value: 1 })
    public playbackRate : number = 1;
    @property({ type: Number, value: 0.4 })
    public volume : number = 0.4;
}

const SAMPLE_URL_PREFIX_KEY = 'speaker:base-url';

const legacyValueCheck = (value: string, legacyIdMap: Map<string, string>): string => {
    const newId = legacyIdMap.get(value);
    if (newId) {
        return newId;
    }
    return value;
}

@part('speaker')
export class SpeakerPart extends Part {
    private ctx? : AudioContext;
    private destination? : AudioNode;
    private players : SamplePlayer[] = [];
    @component(SpeakerComponent)
    public core : SpeakerComponent;
    private samplesMap : Map<string, ISample> = new Map();
    private _samples : ISampleSet[] = [];
    private _defaultSample : string = '';
    private legacyIdMap : Map<string, string> = new Map();
    static get defaultSample() { return 'claves'; }
    static get items() { return samples; }
    static get legacyIdMap() : Map<string, string> { return new Map(); }
    static resolve(id : string) {
        const prefix = Output.config.get(SAMPLE_URL_PREFIX_KEY, '/assets/audio/samples/');
        return join(prefix, id);
    }
    static transformLegacy(app : any) {
        transformLegacySpeaker(app);
    }
    constructor() {
        super();
        (this.constructor as typeof SpeakerPart).items.forEach((set) => {
            const sampleSet : ISampleSet = { id: set.id, label: set.label, resources: [] }
            this._samples.push(sampleSet);
            set.resources.forEach((sample) => {
                sampleSet.resources.push(Object.assign(sample, {}));
                // Build a map of id => sample data to access those swiftly
                this.samplesMap.set(sample.id, sample);
            });
        });
        this._defaultSample = (this.constructor as typeof SpeakerPart).defaultSample;
        this.core = this._components.get('core') as SpeakerComponent;
        this.core.onDidInvalidate(() => {
            this.render();
        }, this, this.subscriptions);
    }
    onInstall(context : IPartContext) {
        this.ctx = context.audio.context;
        this.destination = context.audio.destination;
    }
    loadSample(src : string) {
        return fetch(src)
            .then(r => r.arrayBuffer())
            .then(r => this.ctx!.decodeAudioData(r));
    }
    getSample(src : string) : Promise<AudioBuffer>{
        const srcRes = legacyValueCheck(src, this.legacyIdMap);
        if (!bufferCache.has(srcRes)) {
            return this.loadSample(srcRes)
                .then((buffer) => {
                    bufferCache.set(srcRes, buffer);
                    return buffer;
                });
        }
        return Promise.resolve(bufferCache.get(srcRes)!);
    }
    onStop() {
        super.onStop();
        this.stop();
    }
    render() {
        if (!this.core.invalidated) {
            return;
        }
        this.players.forEach((player) => {
            player.source!.playbackRate.value = this.core.playbackRate;
            player.volume = this.core.volume;
        });
        this.core.apply();
    }
    _play(id : string, loop : boolean = false, time? : number) {
        const sample = this.samplesMap.get(id);
        if (!sample) {
            return;
        }
        this.getSample(SpeakerPart.resolve(sample.src))
            .then((buffer) => {
                const player = new SamplePlayer(this.ctx!, buffer, this.destination!, { loop });
                player.play(time);
                if (!player.source) {
                    return;
                }
                player.source.playbackRate.value = this.core.playbackRate;
                player.volume = this.core.volume;
                // Remove play when it finishes
                player.onDidEnd(() => {
                    const idx = this.players.indexOf(player);
                    this.players.splice(idx, 1);
                });
                this.players.push(player);
            });
    }
    play(id : string, time : number) {
        this._play(id, false, time);
    }
    loop(id : string) {
        this._play(id, true);
    }
    stop() {

        // using a decrementing loop to ensure array is fully traversed, even when spliced
        for (var i = this.players.length; i > 0 ; i -= 1) {
            try {
                this.players[i - 1].stop();
            } catch (e) {}
        } 

        this.players.length = 0;
    }
    randomFrom(id: string) {
        const set = this._samples.find(set => set.id === id);
        if (!set) {
            return this._defaultSample;
        }
        const sample = set.resources[Math.floor(Math.random() * set.resources.length)];
        return sample.id;
    }
    setLegacyIdMap(map: Map<string, string>) {
        this.legacyIdMap = map;
    }
    getLegacyIdMap(): Map<string, string> {
        return this.legacyIdMap;
    }
    set pitch(r : number) {
        this.core.playbackRate = Math.min(Math.max(r, 0), 200) / 100;
        this.core.invalidate();
    }
    get pitch() {
        return this.core.playbackRate * 100;
    }
    set volume(v : number) {
        // the maximum value is limited to an ear-friendly sound pressure level
        this.core.volume = Math.min(Math.max(v, 0), 100) * 0.004;
        this.core.invalidate();
    }
    get volume() {
        return this.core.volume / 0.004;
    }
}