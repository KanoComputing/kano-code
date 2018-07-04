import EventEmitter from '../../util/event-emitter.js';

export class DialogProvider extends EventEmitter {
    createDom() {
        return document.createElement('div');
    }
}

export default DialogProvider;
