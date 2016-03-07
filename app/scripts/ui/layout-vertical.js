import UI from './ui';

export default class LayoutVertical extends UI {
    constructor () {
        super({
            type: 'layout-vertical',
            label: 'Vertical Layout',
            image: '/assets/ui/vertical.png',
            hue: 118,
            passive: true
        });
    }
}
