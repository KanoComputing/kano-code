import UI from './ui';

export default class Button extends UI {
    constructor () {
        super({
            type: 'button',
            label: 'Button',
            image: 'assets/ui/button.png',
            hue: 118
        });
        this.addEvent({
            label: 'is clicked',
            id: 'clicked'
        });
    }
    addEventListener (name, callback) {
        super.addEventListener.apply(this, arguments);
        let element = this.getElement();
        return element.addEventListener.apply(element, arguments);
    }
    removeListeners () {
        let element = this.getElement();
        this.listeners.forEach((listener) => {
            element.removeEventListener.apply(element, listener);
        });
        super.removeListeners();
    }
}
