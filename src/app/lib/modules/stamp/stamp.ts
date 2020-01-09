import { AppModule } from '../../app-modules/app-module.js';

export class StampModule extends AppModule {
    static get id() {
        return 'stamp';
    }
    constructor(output : any) {
        super(output);
        const stickers = output.resources.get('stickers');

        function random(id : string) {
            if (id === 'all') {
                return stickers.getRandom()
            }
            return stickers.getRandomFrom(id);
        }

        function stampChoice(id : string) {
            return id;
        }
        
        this.addMethod('random', random);
        this.addMethod('stampChoice', stampChoice);
    }

}

export default StampModule;
