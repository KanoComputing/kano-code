import { ISession } from '../utils.js';
import { Sticker } from '../../../../parts/parts/sticker/types.js';

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
        const session = this.session;

        if (!sticker) {
            return;
        }

        if (session && session.stickers) {
            const stamp = session.stickers.cacheValue(sticker);

            if (!stamp) {
                return
            }

            const scale = stamp.width / stamp.height;
            const r = rotation * (Math.PI / 180);
            const xx = Math.cos(r) * scale;
            const xy = Math.sin(r) * scale;
            session.ctx.setTransform(xx, xy, -xy, xx, 0, 0);

            session.ctx.drawImage(
                stamp,
                session.pos.x - (stamp.width * percent / 2),
                session.pos.y - (stamp.height * percent / 2),
                scale * stamp.height * percent,
                (stamp.width / scale) * percent,
            );

            // reset transformation
            session.ctx.resetTransform();
        }


    };
};

export default Stamp;
