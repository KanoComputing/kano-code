import '@polymer/polymer/polymer-legacy.js';

// @polymerBehavior
export const MediaQueryBehavior = {
    properties: {
        smallScreen: {
            type: Boolean,
            reflectToAttribute: true
        },
        mediumScreen: {
            type: Boolean,
            reflectToAttribute: true
        },
        largeScreen: {
            type: Boolean,
            reflectToAttribute: true
        }       
    }
};
