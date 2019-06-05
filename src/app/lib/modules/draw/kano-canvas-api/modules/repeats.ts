import { ISession } from '../utils.js';

export class Repeats {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Repeat a drawing a specified number of times
    *
    * @param {Number} repeats
    * @param {Number} rotation
    * @param {Number} movement
    * @return void
    */
   repeatDrawing(repeats : number, rotation : number, movementX : number, movementY : number, callback: Function) {
        let previousX = this.session.pos.x,
        previousY = this.session.pos.y,
        moveX = movementX ? movementX : 0,
        moveY = movementY ? movementY : 0

        // moves drawing context to centre around rotation point
        this.session.ctx.translate(previousX, previousY);
        this.session.ctx.moveTo(0, 0);

        for( var i = 0; i < repeats; i++ ) {
            this.session.pos = {x: 0 + moveX * i, y: 0 + moveY * i};
            callback()
            this.session.ctx.rotate(rotation * Math.PI / 180)
        }

        // resets changes
        this.session.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.session.pos = {x: previousX, y: previousY};

    };
}

export default Repeats;