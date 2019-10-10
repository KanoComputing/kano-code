import { ISession } from '../utils.js';
import { calculateFullTransform } from '../transformation.js';
import { Sticker } from '../../../../parts/parts/sticker/types.js';
import { RESOURCE_CACHE_RESOLUTION_MULTIPLIER } from '../../../../output/resources.js';

const legacyValueCheck = (value : string | Sticker, legacyIdMap: any) : string | Sticker => {
    const newId = legacyIdMap.get(value);
    if (newId) {
        return newId;
    }
    return value;
}

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
        const session = this.session;
        const previousX = session.pos.x;
        const previousY = session.pos.y;
        const percent = size !== 0 ? size / 100 : 0.001;
        const previousTransform = session.transformation ? session.transformation : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        if (!sticker) {
            return;
        }

        if (session && session.stickers) {
            let stickerName : string | Sticker = sticker;

            if (session.stickers.legacyIdMap) {
                stickerName = legacyValueCheck(sticker, session.stickers.legacyIdMap);
            }
            const stamp = session.stickers.cacheValue(stickerName);

            if (!stamp) {
                return;
            }

            session.ctx.beginPath();
            const all = calculateFullTransform({x: previousX, y: previousY}, rotation, percent);
            session.ctx.transform(all[0][0], all[1][0], all[0][1], all[1][1], all[0][2], all[1][2]);

            const width = stamp.width / RESOURCE_CACHE_RESOLUTION_MULTIPLIER;
            const height = stamp.height / RESOURCE_CACHE_RESOLUTION_MULTIPLIER;
            session.ctx.drawImage(
                stamp,
                Math.floor((previousX - (width * percent / 2)) / percent),
                Math.floor((previousY - (height * percent / 2)) / percent),
                width,
                height
            );

            session.ctx.setTransform(
                previousTransform[0][0],
                previousTransform[1][0],
                previousTransform[0][1],
                previousTransform[1][1],
                previousTransform[0][2],
                previousTransform[1][2]
                );
            session.ctx.closePath();

        }
    };
};

export default Stamp;
