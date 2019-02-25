declare module 'tone/build/Tone.js' {
    class Sequence {
        constructor(cb : (time : number, col : number) => void, events : number[], subdivision : string);
    }
    class Transport {
        start() : void;
        bpm : {
            value : number;
        };
        schedule(cb : () => void, time : number) : number;
    }
    interface Tone {
        Sequence : typeof Sequence;
        Transport : Transport;
    }
    global {
        interface Window {
            Tone : Tone
        }
    }
}
