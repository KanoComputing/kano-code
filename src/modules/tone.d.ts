export class Sequence {
    constructor(cb : (time : number, col : number) => void, events : any[], subdivisions : string);
    start() : void;
    stop() : void;
    add(index : number, event : any) : void;
    at(index : number, event? : any) : any;
    playbackRate : number;
}
export const Transport : {
    start() : void;
    stop() : void;
    bpm : {
        value : number;
    };
    state : 'started'|'stopped';
}
export class Player {}
export class Buffer {}
export class CrossFade {}
export class Loop {}
export const Tone : {
    setContext(ctx : AudioContext) : void;
};