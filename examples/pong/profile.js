import './pong.js';
import * as code from '../../app/lib/index.js';

// Define what the output will be, In this case, an instance of Pong.js
class PongOutputView extends code.OutputViewProvider {
    constructor(...args) {
        super(...args);
        this.root = document.createElement('div');
        this.root.style.width = '100%';
        this.root.style.height = '420px';
        this.pong = new Pong(this.root);
        // Add keyboard controls for player A
        this.pong.players.a.addControls({
            'up': 'w',
            'down': 's',
        });

        // Add behaviour for player B
        this.pong.on('update', () => {
            if (this.pong.players.b.y < this.pong.balls[0].y) {
                this.pong.players.b.move(1);
            } else if (this.pong.players.b.y > this.pong.balls[0].y) {
                this.pong.players.b.move(-1);
            }
        });
    }
    // Every time the output restarts, resets all values
    start() {
        if (!this.started) {
            this.pong.resize();
            this.started = true;
        }
        this.pong.reset();
        this.pong.setBackgroundColor(0x000000);
        this.pong.setBallColor(0xffffff);
        this.pong.setBallSize(10);
        setTimeout(() => {
            this.pong.start();
        });
    }
}

// Pong runner module. It just sets the methods to be the instance of pong running
// In more complex situations, you will need to wrap the methods to not expose the
// whole API to the VM
class PongModule extends code.AppModule {
    static get name() { return 'pong'; }
    constructor(...args) {
        super(...args);
        this.addLifecycleStep('start', '_start');
    }
    _start(s) {
        const { outputView } = this.output;
        this.methods = outputView.pong;
    }
}

export class PongOutputProfile extends code.OutputProfile {
    get id() { return 'pong'; }
    get outputViewProvider() { return new PongOutputView(); }
    get modules() { return [PongModule]; }
}

export default PongOutputProfile;
