let lightFrame;

export default lightFrame = {
    partType: 'ui',
    type: 'lightframe',
    label: 'Frame',
    image: '/assets/part/pixels-draw.svg',
    colour: '#FFB347',
    component: 'kano-part-light-frame',
    restrict: 'workspace',
    blocks: [],
    configPanel: 'kano-light-frame-editor',
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: 'Width'
        },{
            key: 'height',
            type: 'range',
            label: 'Height'
        },{
            key: 'bitmap',
            type: 'bitmap',
            label: 'Bitmap'
        }],
        style: []
    },
    userProperties: {
        width: 5,
        height: 5
    }
};
