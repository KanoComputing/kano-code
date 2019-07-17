import { ISession } from '../utils.js';
import { Sticker } from '../../../../parts/parts/sticker/types.js';
import { reduceAllImages, resolve } from '../../../../util/image-stamp.js';
import { stamps } from '../../../stamp/data.js';

const all = reduceAllImages(stamps);

export class Stamp {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Stamps a sticker image at the pen point
    *
    * @param {String} sticker
    * @param {Number} size
    * @param {Number} rotation
    * @return void
    */
    stamp(sticker: Sticker, size: number, rotation: number) {
        const previousX = this.session.pos.x;
        const previousY = this.session.pos.y;
        const percent = size / 100;
        const img = new Image;
        const session = this.session;
        
        if (!sticker) {
            return;
        }

        img.onload = function() {
            const scale = img.width / img.height;
            session.ctx.translate(previousX, previousY);
            session.ctx.moveTo(0,0);
            session.ctx.rotate(rotation * Math.PI / 180);
            session.ctx.translate(-previousX, -previousY);

            session.ctx.drawImage(
                img,
                session.pos.x,session.pos.y,
                scale * img.height * percent,
                img.width / scale * percent,
            );

            session.ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
        img.crossOrigin = "Anonymous";
        img.src = resolve(all[sticker.toString()]);

    };

    /*
    * Selects a random image from the sticker list
    *
    * @return void
    */
};

export default Stamp;
