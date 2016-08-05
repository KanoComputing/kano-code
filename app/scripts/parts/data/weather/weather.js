let weather;

export default weather = {
    partType: 'data',
    type: 'weather',
    label: 'Weather',
    colour: '#cddc39',
    image: '/assets/part/weather.svg',
    description: 'All around the world, people installed small boxes full of sensors to record the temperature, wind speed and much more about the weather. Thanks to them, you can get the current weather in any part of the world!',
    parameters: [{
        label: 'Location',
        key: 'location',
        type: 'text',
        value: 'London, U.K.'
    },{
        label: 'Units',
        key: 'units',
        type: 'list',
        value: 'metric',
        description: 'The metric system will display the temperature in ºC while the imperial one will display it in ºF',
        options: [{
            value: 'metric',
            label: 'Metric system'
        },{
            value: 'imperial',
            label: 'Imperial system'
        }]
    }],
    refreshFreq: 5,
    minRefreshFreq: 5,
    method: 'weather.getWeather',
    dataKeys: [{
        label: 'Temperature',
        key: 'temperature',
        description: 'The current temperature at the location'
    },{
        label: 'Wind speed',
        key: 'wind_speed',
        description: 'The speed of the wind'
    },{
        label: 'Wind angle',
        key: 'wind_angle',
        description: 'The general direction of the wind'
    },{
        label: 'Clouds',
        key: 'clouds',
        description: 'The percentage of the sky covered by clouds'
    },{
        label: 'Emoji',
        key: 'emoji',
        description: 'The emoji matching the weather'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'weather_is_status',
                message0: `${ui.name} is %1`,
                args0: [{
                    type: 'field_dropdown',
                    name: 'STATUS',
                    options: [
                        ['sunny', 'sunny'],
                        ['rainy', 'rainy'],
                        ['cloudy', 'cloudy'],
                        ['snowy', 'snowy']
                    ]
                }],
                output: 'Boolean'
            };
        },
        javascript: (ui) => {
            return function (block) {
                let status = block.getFieldValue('STATUS');
                return [`data.weather.is('${status}', devices.get('${ui.id}').getData())`];
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let status = block.getFieldValue('STATUS');
                return [`data.weather.is('${status}', devices.get('${ui.id}').getData())`];
            };
        }
    }]
};
