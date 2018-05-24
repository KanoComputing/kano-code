import { Utils } from '../utils.js';

function Space(session) {
    this.session = session;
}

/*
* Move cursor to absolute x and y positions
*
* @param {Number} x
* @param {Number} y
* @return void
*/
Space.prototype.moveTo = function (x, y) {
    var pos, dx, dy;
    x = x || 0;
    y = y || 0;

    pos = Utils.parseCoordinates(this.session, x, y);
    dx = pos.x - this.session.pos.x;
    dy = pos.y - this.session.pos.y;

    x = pos.x;
    y = pos.y;

    this.session.pos = { x: x, y: y };

    x = this.session.pos.x * this.session.ratio;
    y = this.session.pos.y * this.session.ratio;


    this.session.ctx.moveTo(x, y);
};

/*
* Move cursor to random x and y positions
*
* @return void
*/
Space.prototype.moveToRandom = function () {
    var x, y;
    x = Math.floor(Math.random() * this.session.width);
    y = Math.floor(Math.random() * this.session.height);
    this.moveTo(x,y);
};

/*
* Move cursor by relative x and y amounts
*
* @param {Number} x
* @param {Number} y
* @return void
*/
Space.prototype.move = function (x, y) {
    y = y || 0;
    this.moveTo(this.session.pos.x + x, this.session.pos.y + y);
};

export { Space };
