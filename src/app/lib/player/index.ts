import { EditorOrPlayer } from '../editor/editor-or-player.js';
import { Output, IOutputProfile } from '../output/output.js';
import { DefaultOutputProfile } from '../output/profile.js';
import { transformLegacyCreation } from './legacy.js';

const profiles = new Map();

profiles.set('default', new DefaultOutputProfile());

export class Player extends EditorOrPlayer {
    public output : Output;
    public profiles : Map<string, IOutputProfile> = new Map();
    private _fullscreenEnabled : boolean = true;
    private _fullscreen : boolean = false;
    public element? : HTMLElement;
    public outputRoot? : HTMLElement;
    public before? : HTMLElement;
    public injected : boolean = false;
    constructor() {
        super();
        this.output = new Output();
        this.enableFullscreen();
    }
    static registerProfile(profile : IOutputProfile) {
        profiles.set(profile.id, profile);
    }
    getCode() {
        return this.output.getCode();
    }
    disableFullscreen() {
        this._fullscreenEnabled = false;
    }
    enableFullscreen() {
        this._fullscreenEnabled = true;
    }
    load(data : any) {
        const transformedData = this.replaceSource(data);
        // Assume default profile. This will help creations with no saved profile
        const profile = profiles.get(transformedData.profile || 'default');
        if (!profile) {
            throw new Error(`Could not load creation: Profile '${transformedData.profile}' not registered`);
        }
        this.output.registerProfile(profile);
        this._injectOutputView();
        return transformLegacyCreation(transformedData, this.output)
            .then((cookedData) => {
                return this.output.onCreationImport(cookedData);
            });
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
        if (this.outputRoot && this.outputRoot.parentNode) {
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
    inject(element = document.body, before? : HTMLElement) {
        if (this.injected) {
            return;
        }
        this.injected = true;
        this.element = element;
        this.before = before;
        this._injectOutputView();
    }
    setRunningState(state : boolean) {
        this.output.setRunningState(state);
    }
    getRunningState() {
        return this.output.getRunningState();
    }
    toggleRunningState() {
        this.output.toggleRunningState();
    }
    setFullscreen(state : boolean) {
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
        // TODO: This is not working correctly but is getting there.
        // Will fix up in next iteration - Paul McK 20191112
        let aspectRatio = 300 / 400;
        const { style } = this.outputRoot;
        if (this._fullscreen) {
            // Portrait
            if (window.innerHeight > window.innerWidth * aspectRatio) {
                style.width = '84vw';
                style.height = `calc(84vw * ${aspectRatio})`;
                style.top = `calc(50% - (84vw * ${aspectRatio} / 2))`;
                style.left = '8vw';
            } else {
                // Landscape
                aspectRatio = 1 / aspectRatio;
                style.height = '84vh';
                style.width = `calc(84vh * ${aspectRatio})`;
                style.top = 'calc(50% - 42vh)';
                style.left = `8vw`;
            }
        } else {
            // We are not fullscreen so set the viewport
            // height relative to the width of the workspace
            style.width = 'auto';
            style.height = `auto`;
            style.top = 'auto';
            style.left = 'auto';
        }
    }

    dispose() {
        if (this.element && this.outputRoot && this.outputRoot.parentNode === this.element) {
            this.element.removeChild(this.outputRoot);
        }
        this.output.dispose();
    }
}

export default Player;
