import { localize } from '../../../../i18n/index.js';

const iss = {
    partType: 'data',
    type: 'iss',
    label: localize('PART_DATA_ISS_NAME'),
    image: '/assets/part/iss.svg',
    colour: '#1f1f1f',
    parameters: [],
    refreshFreq: 5,
    minRefreshFreq: 5,
    singleton: true,
    method: 'space.getISSStatus',
    dataKeys: [{
        label: localize('PART_DATA_ISS_LATITUDE_TITLE'),
        key: 'latitude',
        description: localize('PART_DATA_ISS_LATITUDE_DESC'),
    },{
        label: localize('PART_DATA_ISS_LONGITUDE_TITLE'),
        key: 'longitude',
        description: localize('PART_DATA_ISS_LONGITUDE_DESC'),
    }],
};

export default iss;
