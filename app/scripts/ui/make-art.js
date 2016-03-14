import UI from './ui';

export default class MakeArt extends UI {
    constructor () {
        super({
            type: 'make-art',
            label: 'Make Art',
            image: 'http://art.kano.me/assets/layout/draw-logo.png',
            hue: 60,
            customizable: {
                style: ['background-image']
            }
        });
    }
}
