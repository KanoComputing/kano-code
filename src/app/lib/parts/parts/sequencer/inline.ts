import { PartInlineDisplay } from '../../inline-display.js';
import { SequencerPart } from './sequencer.js';

export class SequencerInlineDisplay extends PartInlineDisplay {
    public domNode : HTMLElement = document.createElement('div');
    private part : SequencerPart;
    constructor(part : SequencerPart) {
        super(part);
        this.part = part;

        this.domNode.style.display = 'flex';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.justifyContent = 'flex-end';

        this.part.onDidChangeSequencers(() => {
            this.render();
        });
    }
    render() {
        this.domNode.innerText = '';
        this.part.sequencers.forEach((seq) => {
            const el = document.createElement('div');
            el.style.width = '8px';
            el.style.height = '8px';
            el.style.background = 'white';
            el.style.margin = '4px';
            el.style.borderRadius = '4px';
            el.style.opacity = '0.6';
            seq.onHit(() => {
                el.style.transform = 'scale(1.3)';
                el.style.opacity = '0.8';
                setTimeout(() => {
                    el.style.opacity = '0.6';
                    el.style.transform = '';
                }, 200);
            });
            this.domNode.appendChild(el);
        });
    }
    onInject() {}
    onDispose() {}
}