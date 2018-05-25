import { localize } from '../../../../i18n/index.js';

const share = {
    partType: 'data',
    type: 'share',
    label: localize('PART_DATA_SHARE_NAME'),
    image: '/assets/part/kano-world.svg',
    colour: '#1f1f1f',
    dataType: 'list',
    dataLength: 9,
    parameters: [],
    refreshFreq: 5,
    minRefreshFreq: 5,
    singleton: true,
    method: 'kano.getShares',
    dataKeys: [{
        label: localize('PART_DATA_SHARE_TITLE_TITLE'),
        key: 'title',
        description: localize('PART_DATA_SHARE_TITLE_DESC'),
    }, {
        label: localize('PART_DATA_SHARE_LIKES_TITLE'),
        key: 'likes',
        description: localize('PART_DATA_SHARE_LIKES_DESC'),
    }, {
        label: localize('PART_DATA_SHARE_USER_TITLE'),
        key: 'user',
        description: localize('PART_DATA_SHARE_USER_DESC'),
    }, {
        label: localize('PART_DATA_SHARE_IMAGE_TITLE'),
        key: 'image',
        description: localize('PART_DATA_SHARE_IMAGE_DESC'),
    }],
};

export default share;