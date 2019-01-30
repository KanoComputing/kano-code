export const Input = {
    properties: {
        type: {
            type: String
        },
        label: {
            type: String,
            value: null
        },
        value: {
            type: String,
            notify: true
        },
        symbol: {
            type: String
        },
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        step: {
            type: Number
        },
        options: {
            type: Array
        },
        description: {
            type: String
        },
        theme: String
    }
};
