/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { CreationCustomPreviewProvider } from '../creation-preview-provider.js';

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
