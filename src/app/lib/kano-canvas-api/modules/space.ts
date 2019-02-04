import { Utils, ISession } from '../utils.js';

export class Space {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Move cursor to absolute x and y positions
    *
    * @param {Number} x
    * @param {Number} y
    * @return void
    */
    moveTo(x : number = 0, y : number = 0) {
        const pos = Utils.parseCoordinates(this.session, x, y);

        x = pos.x;
        y = pos.y;

        this.session.pos = { x: x, y: y };

        x = this.session.pos.x * this.session.ratio;
        y = this.session.pos.y * this.session.ratio;


        this.session.ctx.moveTo(x, y);
    }
    /*
    * Move cursor to random x and y positions
    *
    * @return void
    */
    moveToRandom() {
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
    move(x : number, y : number = 0) {
        this.moveTo(this.session.pos.x + x, this.session.pos.y + y);
    };
}

export default Space;
