/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Space } from './space.js';
import { Utils, ISession } from '../utils.js';

export class Paths {
    private session : ISession;
    private space : Space;
    constructor(session : ISession) {
        this.session = session;
        this.space = new Space(this.session);
    }
    /*
    * Draw a line from current cursor position to absolute x and y coordinates
    *
    * @param {Number} x
    * @param {Number} y
    * @return void
    */
    lineTo(x : number, y : number) {
        var ratio = this.session.ratio,
        pos = Utils.parseCoordinates(this.session, x, y),
        from = {
            x : this.session.pos.x,
            y : this.session.pos.y
        };

        x = pos.x;
        y = pos.y;

        this.space.moveTo(this.session.pos.x, this.session.pos.y);
        Utils.startShape(this.session);
        this.session.ctx.moveTo(from.x * ratio, from.y * ratio);
        this.session.ctx.lineTo(x * ratio, y * ratio);
        Utils.endShape(this.session);
    };

    /*
    * Draw a line from current cursor position to relative x and y coordinates
    *
    * @param {Number} x
    * @param {Number}* y
    * @return void
    */
    line(x : number, y = 0) {
        this.lineTo(this.session.pos.x + x, this.session.pos.y + y);
    };

    /*
    * Set linecap to given type
    *
    * @param {String} type
    * @return void
    */
    lineCap(type : CanvasLineCap) {
        this.session.ctx.lineCap = type;
    };
}

export default Paths;
