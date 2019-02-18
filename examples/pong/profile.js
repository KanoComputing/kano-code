import './vendor/pong.js';
import * as code from '../../index.js';

const PongManager = {
    setup(output) {
        if (this.root) {
            return;
        }
        this.root = document.createElement('div');
        this.root.style.position = 'absolute';
        this.root.style.top = '0';
        this.root.style.left = '0';
        this.root.style.width = '100%';
        this.root.style.height = '100%';
        this.pong = new Pong(this.root);
        this.pong.players.a.addControls({
            up: 'w',
            down: 's',
        });
        output.dom.root.appendChild(this.root);
    }

}

// Pong runner module. It just sets the methods to be the instance of pong running
// In more complex situations, you will need to wrap the methods to not expose the
// whole API to the VM
class PongModule extends code.AppModule {
    static get id() { return 'pong'; }
    constructor(output) {
        super(output);
        PongManager.setup(output);
        this.addLifecycleStep('start', '_start');
    }
    _start() {
        this.methods = PongManager.pong
        PongManager.pong.reset();
        PongManager.pong.setBackgroundColor(0x000000);
        PongManager.pong.setBallColor(0xffffff);
        PongManager.pong.setBallSize(10);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            PongManager.pong.resize();
            PongManager.pong.start();
        });
    }
}

class AIModule extends code.AppModule {
    static get id() { return 'ai'; }
    constructor(...args) {
        super(...args);
        this.addMethod('position', '_position');
        this.addMethod('move', '_move');

        this.methods = {
            get position() {
                return PongManager.pong.players.b.y;
            },
            move(amount) {
                PongManager.pong.players.b.move(amount);
            },
        };
    }
}

class BallModule extends code.AppModule {
    static get id() { return 'ball'; }
    constructor(...args) {
        super(...args);
        this.methods = {
            get position() {
                if (!PongManager.pong.balls.length) {
                    return 0;
                }
                return PongManager.pong.balls[0].y;
            },
        };
    }
}

export class PongOutputProfile extends code.DefaultOutputProfile {
    onInstall(output) {
        super.onInstall(output);
        this.modules.push(
            PongModule,
            AIModule,
            BallModule,
        );
    }
}

export default PongOutputProfile;
