import { ISession } from '../utils.js';
import { calculateRotation, multiply } from '../transformation.js';

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
        if(!this.session.transformation) {
            this.session.transformation = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        }
        const previousTransform = this.session.transformation || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        this.session.ctx.beginPath();

        for( var i = 0; i < repeats; i++ ) {
            this.session.pos = { x: previousX + moveX * i, y: previousY + moveY * i };
            callback();
            const all = calculateRotation({x: previousX, y: previousY}, rotation);
            this.session.transformation = multiply(this.session.transformation, all);
            this.session.ctx.transform(all[0][0], all[1][0], all[0][1], all[1][1], all[0][2], all[1][2]);
        }

        // resets changes
        this.session.ctx.setTransform(
            previousTransform[0][0],
            previousTransform[1][0],
            previousTransform[0][1],
            previousTransform[1][1],
            previousTransform[0][2],
            previousTransform[1][2]
        );

        this.session.transformation = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ];

        this.session.ctx.closePath();

        this.session.pos = { x: previousX, y: previousY };
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