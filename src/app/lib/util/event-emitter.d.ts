declare class EventEmitter {
    addListener() : void;
    removeListener() : void;
    on() : void;
    emit(name : string|number|Symbol, arg : any) : void;
}

export default EventEmitter;
