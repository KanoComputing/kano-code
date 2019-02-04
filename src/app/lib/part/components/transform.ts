import { PartComponent, IComponentProperties } from '../component.js';

export class Transform extends PartComponent {
    static get properties() : IComponentProperties {
        return {
            x: {
                type: Number,
                value: 0,
            },
            y: {
                type: Number,
                value: 0,
            },
            scale: {
                type: Number,
                value: 1,
            },
            rotation: {
                type: Number,
                value: 0,
            },
        };
    }
}
