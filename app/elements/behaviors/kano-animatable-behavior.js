// @polymerBehavior
export const AnimatableBehavior = {
    properties: {
        noAnimations: {
            type: Boolean,
            value: false,
            observer: 'noAnimationsChanged'
        }
    },
    ready () {
        this.toggleClass('animatable', true);
    },
    noAnimationsChanged (noAnimations) {
        this.toggleClass('no-animations', noAnimations);
    }
};
