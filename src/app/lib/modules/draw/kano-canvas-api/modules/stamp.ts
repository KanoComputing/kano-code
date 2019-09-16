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

            const multiply = (a: any, b: any) => {
                const aNumRows = a.length;
                const aNumCols = a[0].length; 
                const bNumCols = b[0].length;
                const m = new Array(aNumRows);
                for (let r = 0; r < aNumRows; r+=1) {
                    m[r] = new Array(bNumCols);
                    for (let c = 0; c < bNumCols; c+=1) {
                        m[r][c] = 0;
                        for (var i = 0; i < aNumCols; i+=1) {
                            m[r][c] += a[r][i] * b[i][c];
                        }
                    }
                }
                return m;
            }

            const translate1 = [
                [Math.cos(0),-Math.sin(0), -previousX],
                [Math.sin(0), Math.cos(0), -previousY],
                [0, 0, 1],
            ];
            const rotate = [
                [xx, -xy, 0],
                [xy, xx, 0],
                [0, 0, 1],
            ];
            const translate2 = [
                [Math.cos(0), -Math.sin(0), previousX],
                [Math.sin(0), Math.cos(0), previousY],
                [0, 0, 1],
            ];
            
            const all = multiply(multiply(translate2, rotate), translate1);
            
            session.ctx.save();
            session.ctx.transform(all[0][0], all[1][0], all[0][1], all[1][1], all[0][2], all[1][2])
            session.ctx.drawImage(
                stamp,
                previousX - (stamp.width * percent / 2),
                previousY - (stamp.height * percent / 2),
                stamp.width * percent,
                stamp.height * percent,
            );

            // reset transformation
            session.ctx.restore();
        }
    };
};

export default Stamp;
