import { Base } from './base.js';

const Speaker = {
    play () {
        return;
    },
    say () {
        return;
    },
    loop () {
        return;
    },
    stop () {
        return;
    },
    setPlaybackRate () {
        return;
    },
    setVolume () {
        return;
    }
};


/**
 * @polymerBehavior
 */
export const speaker = Base.applyMixins({}, Base, Speaker);
