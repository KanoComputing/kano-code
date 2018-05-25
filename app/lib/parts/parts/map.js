import { localize } from '../../i18n/index.js';

const map = {
    partType: 'ui',
    type: 'map',
    label: localize('PART_MAP_NAME', 'Map'),
    image: '/assets/part/map.svg',
    colour: '#E73544',
    customizable: {
        style: ['width', 'height'],
    },
    userStyle: {
        width: '200px',
        height: '200px',
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'show_marker',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_MAP_MOVE_MARKER}`,
                args0: [{
                    type: "input_value",
                    name: "LATITUDE"
                }, {
                    type: "input_value",
                    name: "LONGITUDE",
                    align: "RIGHT"
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
            };
        },
        javascript: (ui) => {
            return function (block) {
                let latitude = Blockly.JavaScript.valueToCode(block, 'LATITUDE') || 51,
                    longitude = Blockly.JavaScript.valueToCode(block, 'LONGITUDE') || 0,
                    code = `devices.get('${ui.id}').showMarker(${latitude}, ${longitude});\n`;
                return code;
            };
        },
    }, {
        block: (ui) => {
            return {
                id: 'map_type',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_MAP_SET_VIEW}`,
                args0: [{
                    type: "field_dropdown",
                    name: "MAPTYPE",
                    options: [
                        [
                            Blockly.Msg.BLOCK_MAP_MAP,
                            "roadmap"
                        ],
                        [
                            Blockly.Msg.BLOCK_MAP_SATELLITE,
                            "satellite"
                        ],
                    ],
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            };
        },
        javascript: (ui) => {
            return function (block) {
                let mapType = block.getFieldValue('MAPTYPE'),
                    code = `devices.get('${ui.id}').setMapType("${mapType}");\n`;
                return code;
            };
        },
    }, {
        block: (ui) => {
            return {
                id: 'map_zoom',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_MAP_SET_ZOOM}`,
                args0: [{
                    type: 'input_value',
                    name: 'ZOOM',
                    check: 'Number',
                }],
                previousStatement: true,
                nextStatement: true,
            };
        },
        javascript: (ui) => {
            return function (block) {
                let zoom = Blockly.JavaScript.valueToCode(block, 'ZOOM') || 20,
                    code = `devices.get('${ui.id}').setMapZoom(${zoom});\n`;
                return code;
            };
        },
    }, {
        block: (ui) => {
            return {
                id: 'random_location',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_MAP_MOVE_MARKER_RANDOM}`,
                inputsInline: true,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                code = `devices.get('${ui.id}').moveToRandom();\n`;
                return code;
            };
        },
    }],
};

export default map;
