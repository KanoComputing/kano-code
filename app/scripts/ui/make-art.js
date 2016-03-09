import UI from './ui';

export default class MakeArt extends UI {
    constructor () {
        console.log('dasd');
        super({
            type: 'make-art',
            label: 'Make Art',
            image: 'http://art.kano.me/assets/layout/draw-logo.png',
            hue: 60
        });
        this.addEvent({
            label: 'data fetched',
            id: 'fetchData'
        });
    }

    addEventListener (name, callback) {
        super.addEventListener.apply(this, arguments);
        let element = this.getElement();
        console.log('clicked');
        return element.addEventListener.apply(element, arguments);
    }

    removeListeners () {
        let element = this.getElement();
        this.listeners.forEach((listener) => {
            element.removeEventListener.apply(element, listener);
        });
        super.removeListeners.apply(this, arguments);
    }
    stop () {
        this.removeListeners();
        super.stop.apply(this, arguments);
    }
}
