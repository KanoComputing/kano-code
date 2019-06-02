import { IDisposable, IEvent } from '@kano/common/index.js';
import { collectPrototype } from './util.js';
import { PartComponent } from './component.js';
import { Microphone } from '../output/microphone.js';

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
 * [[include:Part.md]]
 * 
 * This class is the parent for each Part. It handles setting up the components, and the lifecycle steps.
 */
export class Part {
    /**
     * A bug in EventEmitter makes it only accept arrays. No Disposables
     */
    protected subscriptions : IDisposable[] = [];
    /**
     * Put all your user subscriptions in there, They will be disposed off on every app stop
     */
    protected userSubscriptions : IDisposable[] = [];
    /**
     * Map of components for the part. See [[PartComponent]]
     */
    protected _components : Map<string, PartComponent> = new Map();
    /**
     * Unique id generated from the name by the editor when created
     */
    public id? : string;
    /**
     * Unique name generated from the label by the editor when created. The user can update this name, and the id will be re-generated to match the new name
     */
    public name? : string;
    /**
     * Unique type string for this part
     */
    static get type() : string {
        throw new Error('Could not create part, type is not defined');
    }
    /**
     * Apply a series of transformations to a legacy app to make it compatible with the most up-to-date APIs
     * @param app A previously saved app
     */
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
    renderComponents(ctx : CanvasRenderingContext2D) : Promise<void> {
        return Promise.resolve();
    }
    resetTransform(ctx: CanvasRenderingContext2D) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    applyTransform(ctx : CanvasRenderingContext2D) {}
}
