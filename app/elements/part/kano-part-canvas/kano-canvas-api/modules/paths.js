import { Space } from './space.js';
import { Utils } from '../utils.js';

function Paths(session) {
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
Paths.prototype.lineTo = function (x, y) {
    var ratio = this.session.ratio,
    pos = Utils.parseCoordinates(this.session, x, y),
    from = {
        x : this.session.pos.x,
        y : this.session.pos.y
    };

    x = pos.x;
    y = pos.y;

    this.space.moveTo(this.session.pos.x, this.session.pos.y, false);
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
Paths.prototype.line = function (x, y) {
    y = y || 0;

    this.lineTo(this.session.pos.x + x, this.session.pos.y + y);
};

/*
* Set linecap to given type
*
* @param {String} type
* @return void
*/
Paths.prototype.lineCap = function (type) {
    this.session.ctx.lineCap = type;
};

export { Paths };
