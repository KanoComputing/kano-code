import EventEmitter from '../../util/event-emitter.js';

export abstract class DialogProvider extends EventEmitter {
    abstract createDom() : HTMLElement;
    abstract dispose() : void;
}

export default DialogProvider;
