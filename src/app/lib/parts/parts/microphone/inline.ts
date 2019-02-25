import { PartInlineDisplay } from '../../inline-display.js';
import { KCMicrophoneDisplay } from './kc-microphone-display.js';
import { MicrophonePart } from './microphone.js';
import { subscribeInterval } from '@kano/common/index.js';

export class MicrophoneInlineDisplay extends PartInlineDisplay<KCMicrophoneDisplay> {
    public domNode: KCMicrophoneDisplay = new KCMicrophoneDisplay();
    constructor(part : MicrophonePart) {
        super(part);
        subscribeInterval(() => {
            this.domNode.value = Math.round(part.volume);
            this.domNode.addValue(this.domNode.value);
        }, 100);
    }
    onInject() {}
    onDispose() {}
}