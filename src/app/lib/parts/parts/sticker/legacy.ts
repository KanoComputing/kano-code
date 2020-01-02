import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export const stickersMap : { [K : string] : string } = {
    'animal-bee': 'bee',
    'animal-bird': 'bird',
    'animal-blowfish': 'blowfish',
    'animal-bluehwhale': 'bluehwhale',
    'animal-bunny': 'bunny',
    'animal-camel': 'camel',
    'animal-cat': 'cat',
    'animal-centipede': 'centipede',
    'animal-chicken': 'chicken',
    'animal-clownfish': 'clownfish',
    'animal-cow': 'cow',
    'animal-crab': 'crab',
    'animal-crocodile': 'crocodile',
    'animal-dog': 'dog',
    'animal-dolphin': 'dolphin',
    'animal-duck': 'duck',
    'animal-elephant': 'elephant',
    'animal-fish-1': 'fish',
    'animal-goat': 'goat',
    'animal-ladybug': 'ladybug',
    'animal-monkey': 'monkey',
    'animal-mouse': 'mouse',
    'animal-octopus': 'octopus',
    'animal-pig': 'pig',
    'animal-poodle': 'poodle',
    'animal-sheep': 'sheep',
    'animal-shrimp': 'shrimp',
    'animal-snail': 'snail',
    'animal-snake': 'snake',
    'animal-spider': 'spider',
    'animal-squirrel': 'squirrel',
    'animal-tiger': 'tiger',
    'animal-tortoise': 'tortoise',
    'animal-unicorn': 'unicorn',
    'animal-whale': 'whale',
    'holidays-candle': 'candle',
    'holidays-gift': 'gift',
    'holidays-gingerbread': 'gingerbread',
    'holidays-hat': 'hat',
    'holidays-tree': 'tree',
    'arrow': 'arrow',
    'judoka-face': 'judoka',
    'planet': 'planet',
    'judoka-record': 'record',
    'robotnik': 'robotnik',

    'mask-smile': 'smile',
    'mask-cool': 'cool',
    'mask-grin': 'grin',
    'mask-laughcry': 'laughcry',
    'mask-meh': 'meh',
    'mask-rolleyes': 'rolleyes',
    'mask-sleep': 'sleep',
    'mask-alien': 'alien',
    'mask-bear': 'bear',
    'mask-blank': 'blank',
    'mask-boar': 'boar',
    'mask-cat': 'cat-head',
    'mask-chicken': 'chicken-head',
    'mask-cow': 'cow-head',
    'mask-deer': 'deer',
    'mask-devil': 'devil',
    'mask-dog': 'dog-head',
    'mask-easter-island': 'easter-island',
    'mask-fox': 'fox',
    'mask-frog': 'frog',
    'mask-gorilla': 'gorilla',
    'mask-horse': 'horse',
    'mask-koala': 'koala',
    'mask-lion': 'lion',
    'mask-monkey': 'monkey-head',
    'mask-mouse': 'mouse-head',
    'mask-panda': 'panda',
    'mask-pig': 'pig-head',
    'mask-pumpkin': 'pumpkin',
    'mask-rabbit': 'rabbit',
    'mask-robot': 'robot',
    'mask-santa': 'santa',
    'mask-skull': 'skull',
    'mask-small-mouse': 'small-mouse',
    'mask-tiger': 'tiger-head',
    'mask-traditional': 'traditional',

    'food-burger': 'burger',
    'food-burrito': 'burrito',
    'food-candy': 'candy',
    'food-cheese': 'cheese',
    'food-cherry': 'cherry',
    'food-chicken': 'chicken-leg',
    'food-donut': 'donut',
    'food-eggplant': 'eggplant',
    'food-icecream': 'icecream',
    'food-melon': 'melon',
    'food-noodles': 'noodles',
    'food-peach': 'peach',
    'food-pineapple': 'pineapple',
    'food-pizza': 'pizza',
    'food-shrimp': 'tempura',
    'food-sushi': 'sushi',
    'food-taco': 'taco',
    'food-tomato': 'tomato',
    'food-watermelon': 'watermelon',

    'music-bell': 'bell',
    'music-drum': 'drum',
    'music-guitar': 'guitar',
    'music-musical-note': 'note',
    'music-musical-notes': 'notes',
    'music-sax': 'sax',
    'music-pick': 'pick',
    'music-trumpet': 'trumpet',

    'bolt': 'bolt',
    'markers': 'Markers',
    'doubting-donut': 'doubting-donut',
    'krink-marker': 'krink-marker',
    'creeper': 'creeper',
    'mouse': 'mouse-art',
    'mrsprinkles': 'mrsprinkles',
    'old-schooler': 'old-schooler',
    'peace': 'peace',
    'pixel-spraycan': 'pixel-spraycan',
    'point': 'point',
    'rainbow-roller': 'rainbow-roller',
    'soydog': 'soydog',
    'spraycan': 'spraycan',
    'spraying': 'spraying',
    'supreme-code': 'supreme',

    'other-avocado': 'avocado',
    'other-ball': 'ball',
    'other-ball-baseball': 'baseball',
    'other-ball-basketball': 'basketball',
    'other-cactus': 'cactus',
    'other-cake': 'cake',
    'other-clap': 'clap',
    'other-controller': 'controller',
    'other-face': 'face',
    'other-ball-football': 'football',
    'other-ghost': 'ghost',
    'other-hotdog': 'hotdog',
    'other-keyboard': 'keyboard',
    'other-keytar': 'keytar',
    'other-lightning-bolt': 'lightning',
    'other-map': 'map',
    'other-medal': 'medal',
    'other-medal-2': 'medal2',
    'other-microphone': 'microphone',
    'other-micropscope': 'microscope',
    'other-minecraft-block': 'minecraft',
    'other-palm-tree': 'palmtree',
    'other-piano-keyboard': 'piano',
    'other-popcorn': 'popcorn',
    'other-pen': 'pen',
    'other-paintbrush': 'paintbrush',
    'other-space-invader': 'space-invader',
    'other-ball-tennis': 'tennis',
    'other-thermometer': 'thermometer',
    'other-toadstool': 'toadstool',
    'other-trophy': 'trophy',
    'other-waffles': 'pancakes',
    'other-sprout': 'sprout',
    'other-palmtree': 'palmtree',
    'other-clubs': 'clubs',
    'other-spades': 'spades',
    'other-hearts': 'hearts',
    'other-diamonds': 'diamonds',
    'other-dice': 'dice',
    'other-eightball': 'eightball',
    'other-poop': 'poop',

    'photo-animal-nose': 'animal-nose',
    'photo-boom': 'boom',
    'photo-crown': 'crown',
    'photo-ears': 'ears',
    'photo-eye': 'eye',
    'photo-eyes': 'eyes',
    'photo-hearts': 'hearts',
    'photo-lightbulb': 'lightbulb',
    'photo-lips': 'lips',
    'photo-mouth': 'mouth',
    'photo-nose': 'nose',
    'photo-bubble-see-speech': 'speech',
    'photo-bubble-speech-left': 'speech-left',
    'photo-bubble-speech-right': 'speech-right',
    'photo-bubble-speech-urgent': 'speech-urgent',
    'photo-sunglasses': 'sunglasses',
    'photo-bubble-thought': 'thought',
    'photo-tongue': 'tongue',
    'photo-zzz': 'zzz',

    'earth-asia': 'asia',
    'earth-america': 'america',
    'earth-europe': 'europe',
    'meteor': 'meteor',
    'moon-1': 'moon',
    'moon-2': 'moon2',
    'moon-3': 'moon3',
    'moon-4': 'moon4',
    'moon-5': 'moon5',
    'moon-6': 'moon6',
    'moon-7': 'moon7',
    'moon-8': 'moon8',
    'moon-smiling': 'moon-smiling',
    'night-sky': 'night',
    'satellite': 'satellite',
    'space-rocket': 'rocket',
    'sun-smiling': 'sun-smiling',
    'telescope': 'telescope',

    'ambulance' : 'ambulance',
    'fire-engine' : 'fire-engine',
    'police-car' : 'police-car',
    'red-car' : 'red-car',
    'taxi' : 'taxi'
};

export function getStickerIdForLegacy(set : string, sticker : string) {
    let newSticker = stickersMap[sticker];
    // Fancy stuff here to take care of the 3 different types of star in legacy creations
    if (sticker === 'star') {
        if (set === 'kano') {
            newSticker = 'star';
        } else if (set === 'street art') {
            newSticker = 'graffiti-star';
        } else if (set === 'space') {
            newSticker = 'shining-star';
        }
    }
    return newSticker;
}

export function transformLegacySticker(app : any) {
    transformLegacyDOMPart('sticker', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'sticker', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_sticker"] [type="assets_random_sticker_from"]`, (block) => {
                block.setAttribute('type', `${id}_random`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_sticker"] [type="assets_get_sticker"]`, (block) => {
                LegacyUtil.renameValue(block, 'PICTURE', 'STICKER');
                const setField = block.querySelector('[name="SET"]');
                const stickerField = block.querySelector('field[name="STICKER"]');
                if (stickerField && setField){
                    const set = setField.innerHTML;
                    const sticker = stickerField.innerHTML;
                    let newSticker = getStickerIdForLegacy(set, sticker);
                    stickerField.innerHTML = newSticker;
                    setField.remove();
                }
                block.setAttribute('type', 'stamp_getImage');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_sticker"]`, (block) => {
                LegacyUtil.renameValue(block, 'PICTURE', 'IMAGE');
                block.setAttribute('type', `${id}_image_set`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}