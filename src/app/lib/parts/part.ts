import { IDisposable, IEvent } from '@kano/common/index.js';
import { collectPrototype } from './util.js';
import { PartComponent } from './component.js';
import { Microphone } from '../output/microphone.js';

/**
 * @module part
 * @preferred
 */

/**
 * Declares the APIs available for the part to use.
 * This usually give access to the output's APIs.
 */
export interface IPartContext {
    visuals : {
        canvas : HTMLCanvasElement;
        width : number;
        height : number;
    };
    audio : {
        context : AudioContext;
        destination : AudioNode;
        microphone : Microphone;
    };
    dom : {
        root : HTMLElement;
        onDidResize : IEvent<void>;
    };
}

/**
 * Parent class for each Part. It handles setting up the components, and the lifecycle steps.
 * [[include:part.md]]
 */
export class Part {
    // A bug in EventEmitter makes it only accept arrays. No Disposables
    protected subscriptions : IDisposable[] = [];
    // Put all your user subscriptions in there, They will be disposed off on every app stop
    protected userSubscriptions : IDisposable[] = [];
    protected _components : Map<string, PartComponent> = new Map();
    public id? : string;
    public name? : string;
    static get type() : string {
        throw new Error('Could not create part, type is not defined');
    }
    static transformLegacy(app : any) {}
    constructor() {
        const components = collectPrototype<typeof PartComponent>('components', this.constructor, Part);
        components.forEach((componentClass, key) => {
            const component = new componentClass();
            this._components.set(key, component);
        });
    }
    /**
     * Called when the part is added to an output. Whether it is from an editor or a Player
     * @param context The context given by the output. Allowws to access the different output APIs
     */
    onInstall(context: IPartContext) {}
    /**
     * Called when an app starts
     */
    onStart() {};
    /**
     * Called when an app stops
     */
    onStop() {
        this.reset();
    }
    /**
     * Called when the part needs to be disposed off. Free up resources
     */
    dispose() {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }
    /**
     * Returns a JSON object representation of the part
     */
    serialize() {
        const data : { [K : string] : any } = {
            type: (this.constructor as typeof Part).type,
            id: this.id,
            name: this.name,
        };
        // TODO: This is disabled as there is no point in saving the live data from the part
        // Enable this when users can define default values for component properties
        // this._components.forEach((component, key) => {
        //     data[key] = component.serialize();
        // });
        return data;
    }
    /**
     * Re-hydrate a part with previously saved data
     * @param data JSON object representation of a part
     */
    load(data : any) {
        this.id = data.id;
        this.name = data.name;
        this._components.forEach((component, key) => {
            if (!data[key]) {
                return;
            }
            component.load(data[key]);
        });
    }
    /**
     * Reset all values in components to its default value
     */
    reset() {
        this._components.forEach(component => component.reset());
        this.userSubscriptions.forEach(d => d.dispose());
        this.userSubscriptions.length = 0;
    }
}
