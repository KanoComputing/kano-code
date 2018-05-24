import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
let REGISTRY = {};

// @polymerBehavior AppElementRegistryBehavior
export const AppElementRegistryBehaviorImpl = {
    properties: {
        visible: {
            type: Boolean,
            value: false
        }
    },
    listeners: {
        'iron-resize': '_isVisible'
    },
    _registerElement (id, el) {
        REGISTRY[id] = el;
    },
    _getElement (id) {
        return REGISTRY[id];
    },
    _getElementList () {
        return Object.keys(REGISTRY).filter(id => !!REGISTRY[id]);
    },
    /**
    * The Kano challenge UI uses a computed 'data-animate' attribute on HTML elements.
    * The value will tell how many milliseconds any tooltip etc. should wait before
    * reading the position of an element. This will avoid getting wrong values when
    * an element is animating. Once the element is visible, the delay is set to zero.
    */
    _computeDataAnimate (value, visible) {
        return visible ? '0' : value;
    },
    _isVisible () {
        this.visible = this.getBoundingClientRect().width !== 0 &&
            this.getBoundingClientRect().height !== 0;
    }
};

export const AppElementRegistryBehavior = [AppElementRegistryBehaviorImpl, IronResizableBehavior];
