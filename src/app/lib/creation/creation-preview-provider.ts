import { Plugin } from '../editor/plugin.js';
import { GifEncoder } from '../gif-encoder/encoder.js';
import Editor from '../editor/editor.js';
import Output from '../output/output.js';

export abstract class CreationCustomPreviewProvider extends Plugin {
    protected editor? : Editor;
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    abstract createFile(output : Output) : Promise<Blob>|Blob;
    abstract display(blob : Blob) : void;
}

const canvasToBlob = (canvas : HTMLCanvasElement, mimeType : string, quality : number) => new Promise((resolve) => {
    canvas.toBlob((blob) => {
        if (!blob) {
            throw new Error('Could not generate preview: Canvas did not generate a blob');
        }
        resolve(blob);
    }, mimeType, quality);
});

export class CreationImagePreviewProvider extends CreationCustomPreviewProvider {
    private size : { width : number, height : number };
    constructor(size : { width : number, height : number }) {
        super();
        this.size = size;
    }
    createFile() {
        if (!this.editor) {
            throw new Error('Could not generate image preview: Editor is not defined. The file creation was called before the editor creation');
        }
        const canvas = document.createElement('canvas');
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        // Use the output from the editor, not the player
        const res = this.editor.output.render(canvas.getContext('2d'));
        // TODO
        // The background of the canvas is set in CSS and when we make an image from canvas
        // it does not render with the background colour.
        // To add the background colour into the canvas use something like this:
        
        // let width = this.session.width * this.session.ratio,
        //     height = this.session.height * this.session.ratio;
        // const bgColor = this.session.settings.bg;
        // this.session.ctx.globalCompositeOperation = 'destination-over';
        // this.session.ctx.fillStyle = this.session.settings.bg;
        // this.session.ctx.beginPath();
        // this.session.ctx.rect(0, 0, width, height);
        // this.session.ctx.closePath();
        // this.session.ctx.fill();

        let p = res;
        if (!(res instanceof Promise)) {
            p = Promise.resolve(res);
        }
        return p.then(() => canvasToBlob(canvas, 'image/png', 1));
    }
    display(blob : Blob) {
        const root = document.createElement('img');
        root.src = URL.createObjectURL(blob);
        return root;
    }
}

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

export default CreationImagePreviewProvider;
