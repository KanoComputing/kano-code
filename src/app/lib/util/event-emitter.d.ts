declare class EventEmitter {
    addListener(name : string, callback : Function) : void;
    removeListener(name : string, callback : Function) : void;
    on(name : string, callback : Function) : void;
    emit(name : string|number|Symbol, arg? : any) : void;
}

export default EventEmitter;
