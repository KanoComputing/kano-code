import { Disposables } from '@kano/common/index.js';
import { collectPrototype } from './util.js';
import { PartComponent } from './component.js';

export interface IPartContext {
    visuals : {
        canvas : HTMLCanvasElement;
        width : number;
        height : number;
    };
    audio : {
        context : AudioContext;
        destination : AudioNode;
    };
    dom : {
        root : HTMLElement;
    };
}

export interface IPart {
    onInstall(context : IPartContext) : void;
    onStart() : void;
    onStop() : void;
}

export class Part implements IPart {
    protected subscriptions : Disposables = new Disposables();
    protected _components : PartComponent[] = [];
    protected _componentKeys : string[] = [];
    [K : string] : PartComponent|any;
    static get type() : string {
        throw new Error('Could not create part, type is not defined');
    }
    constructor() {
        const components = collectPrototype<Type<PartComponent>>('components', this.constructor, Part);
        components.forEach((componentClass, key) => {
            const component = new componentClass();
            this[key] = component;
            this._components.push(component);
            this._componentKeys.push(key);
        });
    }
    onInstall(context: IPartContext): void {
        throw new Error('Method not implemented.');
    }
    onStart(): void {
        throw new Error('Method not implemented.');
    }
    onStop(): void {
        throw new Error('Method not implemented.');
    }
    dispose() {
        this.subscriptions.dispose();
    }
    serialize() {
        const data : { [K : string] : any } = {
            type: (this.constructor as typeof Part).type,
        };
        return this._componentKeys.reduce((acc, key) => {
            acc[key] = this[key].serialize();
            return acc;
        }, data);
    }
    load(data : any) {
        this._componentKeys.forEach((key) => {
            (this[key] as PartComponent).load(data[key]);
        });
    }
}
