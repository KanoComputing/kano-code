import UI from './ui';

export default class TextInput extends UI {
    constructor () {
        super({
            type: 'text-input',
            label: 'Text input',
            image: 'assets/ui/text-input.png',
            hue: 118
        });
        this.addBlock({
            id: 'get_value',
            output: true,
            message0: 'input value',
            javascript: (hw) => {
                return function (block) {
                    return [`devices.get('${hw.id}').getValue()`];
                };
            },
            natural: (hw) => {
                return function (block) {
                    return [`input value`];
                };
            }
        });
        this.addEvent({
            label: 'has changed',
            id: 'input-keyup'
        });
    }
    getValue () {
        return this.getElement().getValue();
    }
    addEventListener () {
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
