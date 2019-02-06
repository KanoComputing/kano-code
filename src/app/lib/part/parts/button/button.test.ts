import { ButtonPart } from './button.js';
import { IVisualsContext, IAudioContext, IDOMContext } from '../../../output/output.js';

class PartContextStub {
    public visuals : IVisualsContext;
    public audio : IAudioContext;
    public dom : IDOMContext;
    constructor() {
        this.visuals = {
            get canvas() {
                return document.createElement('canvas');
            },
            get width() {
                return 0;
            },
            get height() {
                return 0;
            }
        };
        const audioCtx = new AudioContext();
        this.audio = {
             context: audioCtx,
             destination: audioCtx.destination,
        };
        this.dom = {
            root: document.createElement('div'),
        };
    }
}

suite('ButtonPart', () => {
    test('#onInstall()', () => {
        const stub = new PartContextStub();
        const button = new ButtonPart();

        button.onInstall(stub);

        console.log(stub.dom.root);
    }); 
});
