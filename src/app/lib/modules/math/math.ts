import { AppModule } from '../../app-modules/app-module.js';

export class MathModule extends AppModule {
    constructor(output : any) {
        super(output);

        this.addMethod('random', '_random');
        this.addMethod('sign', '_sign');
        this.addMethod('lerp', '_lerp');
    }
    static get id() { return 'math'; }
    _sign(x : number) {
        x = +x; // convert to a number
        if (x === 0 || Number.isNaN(x)) {
            return x;
        }
        return x > 0 ? 1 : -1;
    }

    /* This generator is inclusive the ranges [min, max] */
    _random(min : number, max : number) {
        const swap = +min;
        min = +min;
        max = +max;

        if (min > max) {
            min = max;
            max = swap;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* This generator is inclusive the ranges [min, max] */
    _lerp(from : number, to : number, percent : number) {
        const span = to - from;
        percent = Math.max(0, Math.min(percent, 100));

        return from + (span * (percent * 0.01));
    }
}

export default MathModule;
