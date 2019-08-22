import { GifEncoder } from '../../gif-encoder/encoder.js';
import { CreationCustomPreviewProvider } from '../creation-preview-provider.js';
import { Output } from '../../output/output.js';

const wait = (delay : number) => new Promise(resolve => setTimeout(resolve, delay));

export class CreationAnimationPreviewProvider extends CreationCustomPreviewProvider {
    private size : { width : number, height : number };
    private length : number;
    private fps : number;
    private scale : number;
    constructor(size : { width : number, height : number }, length : number, fps : number, scale = 1) {
        super();
        this.size = size;
        this.length = length;
        this.fps = fps;
        this.scale = scale;
    }
    createFrame(output : Output) : Promise<HTMLCanvasElement> {
        const canvas = document.createElement('canvas');
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        const res = output.render(canvas.getContext('2d'));
        let p = res;
        if (!(res instanceof Promise)) {
            p = Promise.resolve(res);
        }
        return p.then(() => canvas);
    }
    createFile(output : Output) : Promise<Blob> {
        let frameProgress = 0;
        let encodingProgress = 0;
        let interrupted = false;
        const encoder = new GifEncoder({
            width: this.size.width * this.scale,
            height: this.size.height * this.scale,
            length: this.length,
            workerUrl: '/lib/gif-encoder/worker-rgb.js',
        });
        let p = wait(300);

        const delay = 1000 / this.fps;

        const getFrame = (() => {
            return this.createFrame(output)
                .then((canvas) => {
                    encoder.addFrame(canvas.getContext('2d'), delay);
                    frameProgress += (100 / this.length);
                    if (interrupted) {
                        return {};
                    }
                    return wait(delay);
                });
        });
        for (let i = 0; i < this.length; i += 1) {
            p = p.then(getFrame.bind(this));
        }
        return p.then(() => encoder.end())
            .then((blob) => {
                frameProgress = 0;
                encodingProgress = 0;
                return blob;
            });
    }
    display(blob : Blob) {
        const root = document.createElement('img');
        root.src = URL.createObjectURL(blob);
        return root;
    }
}
