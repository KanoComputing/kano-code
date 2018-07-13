import { OutputProfile, AppModule } from '../../app/lib/index.js';

export class DrawModule extends AppModule {
    static get name() { return 'draw'; }
    constructor(...args) {
        super(...args);
        this.addMethod('square', '_square');
    }
    _square(x, y, w, h, c) {
        const { outputView } = this.output;
        const { canvas } = outputView;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = c || 'red';
        ctx.fillRect(x, y, w, h);
    }
}

export class DrawOutputProfile extends OutputProfile {
    get id() { return 'pong'; }
    get modules() {
        return [DrawModule];
    }
}

export default DrawOutputProfile;
