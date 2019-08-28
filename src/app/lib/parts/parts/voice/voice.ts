import { Part } from '../../part.js';
import { part } from '../../decorators.js';

@part('voice')
export class VoicePart extends Part {
    onStop() {
        window.speechSynthesis.cancel();
    }
    say(text : string, speed : number, language : string) {
        let msg = new SpeechSynthesisUtterance(text);
        msg.pitch = 1;
        msg.rate = speed / 100;
        msg.lang = language;

        window.speechSynthesis.speak(msg);
    }
}
