import { AudioPlayer } from '../../scripts/kano/music/player.js';
import { Cache } from '../../scripts/kano/make-apps/files/cache.js';
const KcAssetPickerBehavior = {
    properties: {
        type: {
            type: String
        },
        playing: {
            type: Number,
            value: null
        },
        paused: {
            type: Boolean,
            value: true
        },
        value: {
            type: Object,
            notify: true
        }
    },
    observers: [
        '_pathChanged(path)',
        '_openStateChanged(opened)'
    ],
    attached () {
        this.playButtonIcons = {
            stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
            running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z'
        };
    },
    detached () {
        if (this._player) {
            this._player.stop();
        }
    },
    _openStateChanged (opened) {
        if (!opened && this._player) {
            this._player.stop();
        }
    },
    _pathChanged () {
        if (this._player) {
            this._player.stop();
        }
    },
    _selectAsset (e) {
        const item = e.model.get('item');
        this.select(item[this.nameProp], this.path);
        this.set('value', { item, path: this.path });
    },
    _getPlayingStatus (playing, index, paused) {
        return !paused && playing === index ? 'running' : 'stopped'; 
    },
    preloadSample (filename) {
        return Cache.getFile('samples', filename);
    },
    _previewSample (e) {
        const item = e.model.get('item');
        const index = e.model.get('index');
        e.preventDefault();
        e.stopPropagation();
        if (this.playing === index) {
            this._player.toggle();
            return;
        }
        this.preloadSample(item.filename)
            .then(buffer => {
                if (this._player) {
                    this._player.stop();
                }
                this._player = new AudioPlayer(buffer);
                this._player.emitter.addEventListener('stopped', () => {
                    this.playing = null;
                    this.paused = true;
                });
                this._player.emitter.addEventListener('end', () => {
                    this.playing = null;
                    this.paused = true;
                });
                this._player.emitter.addEventListener('paused', () => {
                    this.paused = true;
                });
                this._player.emitter.addEventListener('play', () => {
                    this.paused = false;
                    this.playing = index;
                });
                this._player.play();
            });
    }
};

export { KcAssetPickerBehavior };