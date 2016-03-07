import UI from './ui';

export default class Label extends UI {
    constructor () {
        super({
            type: 'label',
            label: 'Label',
            image: '',
            hue: 118
        });
    }
    setText (text) {
        this.getElement().setText(text);
    }
}
