import { EditorOrPlayer } from '../editor/editor-or-player.js';
import { Output } from '../output/output.js';

const profiles = new Map();

export class Player extends EditorOrPlayer {
    constructor() {
        super();
        this.output = new Output();
        this.enableFullscreen();
    }
    static registerProfile(profile) {
        profiles.set(profile.id, profile);
    }
    disableFullscreen() {
        this._fullscreenEnabled = false;
    }
    enableFullscreen() {
        this._fullscreenEnabled = true;
    }
    load(data) {
        const profile = profiles.get(data.profile);
        if (!profile) {
            throw new Error(`Could not load creation: Profile '${data.profile}' not registered`);
        }
        this.output.registerProfile(profile);
        this._injectOutputView();
        return this.output.onCreationImport(data);
    }
    _injectOutputView() {
        if (!this.element) {
            return;
        }
        if (!this.output) {
            return;
        }
        if (!this.output.outputView) {
            return;
        }
        // Remove old outputView node if it was added previously
        if (this.outputRoot) {
            this.outputRoot.parentNode.removeChild(this.outputRoot);
        }
        // Trick to get custom els added
        this.outputRoot = this.output.outputView instanceof HTMLElement ? this.output.outputView : this.output.outputView.root;
        if (this.before) {
            this.element.insertBefore(this.outputRoot, this.before);
        } else {
            this.element.appendChild(this.outputRoot);
        }
        this.output.onInject();
    }
    inject(element = document.body, before = null) {
        if (this.injected) {
            return;
        }
        this.injected = true;
        this.element = element;
        this.before = before;
        this._injectOutputView();
    }
    setRunningState(...args) {
        this.output.setRunningState(...args);
    }
    getRunningState() {
        return this.output.getRunningState();
    }
    toggleRunningState() {
        this.output.toggleRunningState();
    }
    setFullscreen(state) {
        this._fullscreen = state;
        this._updateFullscreen();
    }
    getFullscreen() {
        return this._fullscreen;
    }
    toggleFullscreen() {
        this.setFullscreen(!this.getFullscreen());
    }
    _updateFullscreen() {
        if (!this.outputRoot || !this._fullscreenEnabled) {
            return;
        }
        if (this._fullscreen) {
            this.outputRoot.style.position = 'fixed';
            this.outputRoot.style.top = '0';
            this.outputRoot.style.left = '0';
            this.outputRoot.style.width = '100%';
            this.outputRoot.style.height = '100%';
        } else {
            this.outputRoot.style.position = '';
            this.outputRoot.style.top = '';
            this.outputRoot.style.left = '';
            this.outputRoot.style.width = '';
            this.outputRoot.style.height = '';
        }
    }
    dispose() {
        if (this.element && this.outputRoot.parentNode === this.element) {
            this.element.removeChild(this.outputRoot);
        }
        this.output.dispose();
    }
}

export default Player;
