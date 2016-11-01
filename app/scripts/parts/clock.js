let clock;

export default clock = {
    partType: 'data',
    type: 'clock',
    label: 'Clock',
    image: '/assets/part/clock.svg',
    component: 'kano-part-clock',
    excludeBlocks: ['refresh'],
    excludeEvents: ['update'],
    method: 'clock.noop',
    configPanel: 'disabled',
    blocks: [{
        block: () => {
            return {
                id: 'get_time',
                message0: 'Clock: current %1',
                output: 'Number',
                args0: [{
                    type: "field_dropdown",
                    name: "FIELD",
                    options: [
                        [
                            "Year",
                            "year"
                        ],
                        [
                            "Month",
                            "month"
                        ],
                        [
                            "Day",
                            "day"
                        ],
                        [
                            "Hour",
                            "hour"
                        ],
                        [
                            "Minute",
                            "minute"
                        ],
                        [
                            "Seconds",
                            "seconds"
                        ]
                    ]
                }]
            };
        },
        javascript: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code = `date.getCurrent().${field}`;
                return [code];
            };
        },
        pseudo: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code = `date.getCurrent().${field}`;
                return [code];
            };
        }
    },{
        block: () => {
            return {
                id: 'get_formatted_time',
                message0: 'Clock: current %1',
                output: 'String',
                args0: [{
                    type: "field_dropdown",
                    name: "FIELD",
                    options: [
                        [
                            "Date",
                            "date"
                        ],
                        [
                            "Time",
                            "time"
                        ]
                    ]
                }]
            };
        },
        javascript: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code;
                if (field === 'date') {
                    code = `date.getFormattedDate()`;
                } else {
                    code = `date.getFormattedTime()`;
                }
                return [code];
            };
        },
        pseudo: () => {
            return (block) => {
                let field = block.getFieldValue('FIELD'),
                    code;
                if (field === 'date') {
                    code = `date.getFormattedDate()`;
                } else {
                    code = `date.getFormattedTime()`;
                }
                return [code];
            };
        }
    }]
};
