import { Plugin } from '../editor/plugin.js';
import { GifEncoder } from '../gif-encoder/encoder.js';

export class CreationCustomPreviewProvider extends Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    createFile() {}
    display() {}
}

const canvasToBlob = (canvas, mimeType, quality) => new Promise((resolve) => {
    canvas.toBlob((blob) => {
        resolve(blob);
    }, mimeType, quality);
});

export class CreationImagePreviewProvider extends CreationCustomPreviewProvider {
    constructor(size) {
        super();
        this.size = size;
    }
    createFile(output) {
        const canvas = document.createElement('canvas');
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        const res = output.render(canvas.getContext('2d'));
        let p = res;
        if (!(res instanceof Promise)) {
            p = Promise.resolve(res);
        }
        return p.then(() => canvasToBlob(canvas, 'image/png', 1));
    }
    display(blob) {
        const root = document.createElement('img');
        root.src = URL.createObjectURL(blob);
        return root;
    }
}

const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

export class CreationAnimationPreviewProvider extends CreationCustomPreviewProvider {
    constructor(size, length, fps, scale = 1) {
        super();
        this.size = size;
        this.length = length;
        this.fps = fps;
        this.scale = scale;
    }
    createFrame(output) {
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
    createFile(output) {
        this.frameProgress = 0;
        this.encodingProgress = 0;
        this.interrupted = false;
        const encoder = new GifEncoder({
            width: this.size.width * this.scale,
            height: this.size.height * this.scale,
            length: this.length,
            workerUrl: '/lib/gif-encoder/worker-rgb.js',
        });
        let p = wait(300);

        const delay = 1000 / this.fps;

        const getFrame = () => {
            return this.createFrame(output)
                .then((canvas) => {
                    encoder.addFrame(canvas.getContext('2d'), delay);
                    this.frameProgress += (100 / this.length);
                    if (this.interrupted) {
                        return null;
                    }
                    return wait(delay);
                });
        };
        for (let i = 0; i < this.length; i += 1) {
            p = p.then(getFrame.bind(this));
        }
        return p.then(() => encoder.end())
            .then((blob) => {
                this.frameProgress = 0;
                this.encodingProgress = 0;
                return blob;
            });
    }
    display(blob) {
        const root = document.createElement('img');
        root.src = URL.createObjectURL(blob);
        return root;
    }
}

export default CreationImagePreviewProvider;
