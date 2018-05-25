import { localize } from '../../../../i18n/index.js';

const weather = {
    partType: 'data',
    type: 'weather',
    label: localize('PART_DATA_WEATHER_NAME'),
    colour: '#cddc39',
    image: '/assets/part/weather.svg',
    parameters: [{
        label: localize('PART_DATA_WEATHER_LOCATION_TITLE'),
        key: 'location',
        type: 'text',
        value: localize('PART_DATA_WEATHER_LOCATION_DEFAULT')
    },{
        label: localize('PART_DATA_WEATHER_UNITS_TITLE'),
        key: 'units',
        type: 'list',
        value: 'metric',
        description: localize('PART_DATA_WEATHER_UNITS_DESC'),
        options: [{
            value: 'metric',
            label: localize('PART_DATA_WEATHER_UNITS_METRIC')
        },{
            value: 'imperial',
            label: localize('PART_DATA_WEATHER_UNITS_IMPERIAL')
        }]
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'weather.getWeather',
    dataKeys: [{
        label: localize('PART_DATA_WEATHER_TEMPERATURE_TITLE'),
        key: 'temperature',
        description: localize('PART_DATA_WEATHER_TEMPERATURE_DESC')
    },{
        label: localize('PART_DATA_WEATHER_SPEED_TITLE'),
        key: 'wind_speed',
        description: localize('PART_DATA_WEATHER_SPEED_DESC')
    },{
        label: localize('PART_DATA_WEATHER_ANGLE_TITLE'),
        key: 'wind_angle',
        description: localize('PART_DATA_WEATHER_ANGLE_DESC')
    },{
        label: localize('PART_DATA_WEATHER_CLOUDS_TITLE'),
        key: 'clouds',
        description: localize('PART_DATA_WEATHER_CLOUDS_DESC')
    },{
        label: localize('PART_DATA_WEATHER_EMOJI_TITLE'),
        key: 'emoji',
        description: localize('PART_DATA_WEATHER_EMOJI_DESC')
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'weather_is_status',
                message0: `${ui.name} ${Blockly.Msg.BLOCK_WEATHER_IS}`,
                args0: [{
                    type: 'field_dropdown',
                    name: 'STATUS',
                    options: [
                        [Blockly.Msg.BLOCK_WEATHER_CLOUDY, 'cloudy'],
                        [Blockly.Msg.BLOCK_WEATHER_RAINY, 'rainy'],
                        [Blockly.Msg.BLOCK_WEATHER_SNOWY, 'snowy'],
                        [Blockly.Msg.BLOCK_WEATHER_SUNNY, 'sunny'],
                    ]
                }],
                output: 'Boolean',
            };
        },
        javascript: (ui) => {
            return function (block) {
                let status = block.getFieldValue('STATUS');
                return [`data.weather.is('${status}', devices.get('${ui.id}').getData())`];
            };
        },
    }],
};

export default weather;
