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
        
        const previousX = this.session.pos.x;
        const previousY = this.session.pos.y;
        const moveX = movementX ? movementX : 0;
        const moveY = movementY ? movementY : 0;
        // moves drawing context to centre around rotation point
        this.session.ctx.translate(previousX, previousY);
        this.session.ctx.moveTo(0, 0);

        for( var i = 0; i < repeats; i++ ) {
            this.session.pos = {x: 0 + moveX * i, y: 0 + moveY * i};
            callback();
            this.session.ctx.rotate(rotation * Math.PI / 180);
        }

        
        // resets changes
        const totalRotation = repeats * rotation * Math.PI / 180;
        this.session.ctx.rotate(-totalRotation);
        
        this.session.ctx.translate(-previousX, -previousY);
        this.session.pos.x = previousX
        this.session.pos.y = previousY
    };

    /*
    * Repeat a drawing a specified number of times, with angles repeated
    *
    * @param {Number} repeats
    * @return void
    */
   repeatInCircle(repeats : number, callback: Function) {
       const angle = 360 / repeats;
       this.repeatDrawing(repeats, angle, 0, 0, callback);
   }


}

export default Repeats;