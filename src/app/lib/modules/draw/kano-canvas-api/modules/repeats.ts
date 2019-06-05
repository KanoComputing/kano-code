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
   repeatDrawing(repeats : number, rotation : number, movement : number, callback: Function) {
        let previousX = this.session.pos.x,
        previousY = this.session.pos.y

        // moves drawing context to centre around rotation point
        this.session.ctx.translate(previousX, previousY);
        this.session.ctx.moveTo(0, 0);

        for( var i = 0; i < repeats; i++ ) {
            this.session.pos = {x: 0, y: 0};
            callback()
            this.session.ctx.rotate(rotation * Math.PI / 180)
        }

        // resets changes
        this.session.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.session.pos = {x: previousX, y: previousY};

    };
}

export default Repeats;