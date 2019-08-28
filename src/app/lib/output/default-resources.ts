import { Resource, Resources } from './resources.js'

class DefaultStickers extends Resource<HTMLImageElement> {
    constructor() {
        super();
        this.default = 'crocodile';
        this.categories = {
            animals: {
                label: 'Animals',
                id: 'animals',
                resources: {
                    bee: { id: 'bee', label: 'Bee', path: 'animals/animal-bee.svg' },
                    bird: { id: 'bird', label: 'Bird', path: 'animals/animal-bird.svg' },
                    blowfish:
                    { id: 'blowfish',
                    label: 'Blowfish',
                    path: 'animals/animal-blowfish.svg' },
                    bluehwhale:
                    { id: 'bluehwhale',
                    label: 'Bluehwhale',
                    path: 'animals/animal-bluehwhale.svg' },
                    bunny: { id: 'bunny', label: 'Bunny', path: 'animals/animal-bunny.svg' },
                    camel: { id: 'camel', label: 'Camel', path: 'animals/animal-camel.svg' },
                    cat: { id: 'cat', label: 'Cat', path: 'animals/animal-cat.svg' },
                    centipede:
                    { id: 'centipede',
                    label: 'Centipede',
                    path: 'animals/animal-centipede.svg' },
                    chicken:
                    { id: 'chicken',
                    label: 'Chicken',
                    path: 'animals/animal-chicken.svg' },
                    clownfish:
                    { id: 'clownfish',
                    label: 'Clownfish',
                    path: 'animals/animal-clownfish.svg' },
                    cow: { id: 'cow', label: 'Cow', path: 'animals/animal-cow.svg' },
                    crab: { id: 'crab', label: 'Crab', path: 'animals/animal-crab.svg' },
                    crocodile:
                    { id: 'crocodile',
                    label: 'Crocodile',
                    path: 'animals/animal-crocodile.svg' },
                    dog: { id: 'dog', label: 'Dog', path: 'animals/animal-dog.svg' },
                    dolphin:
                    { id: 'dolphin',
                    label: 'Dolphin',
                    path: 'animals/animal-dolphin.svg' },
                    duck: { id: 'duck', label: 'Duck', path: 'animals/animal-duck.svg' },
                    elephant:
                    { id: 'elephant',
                    label: 'Elephant',
                    path: 'animals/animal-elephant.svg' },
                    fish: { id: 'fish', label: 'Fish', path: 'animals/animal-fish-1.svg' },
                    goat: { id: 'goat', label: 'Goat', path: 'animals/animal-goat.svg' },
                    ladybug:
                    { id: 'ladybug',
                    label: 'Ladybug',
                    path: 'animals/animal-ladybug.svg' },
                    monkey:
                    { id: 'monkey',
                    label: 'Monkey',
                    path: 'animals/animal-monkey.svg' },
                    mouse:
                    { id: 'mouse',
                    label: 'Mouse',
                    path: 'animals/animal-mouse-2.svg' },
                    octopus:
                    { id: 'octopus',
                    label: 'Octopus',
                    path: 'animals/animal-octopus.svg' },
                    pig: { id: 'pig', label: 'Pig', path: 'animals/animal-pig.svg' },
                    poodle:
                    { id: 'poodle',
                    label: 'Poodle',
                    path: 'animals/animal-poodle.svg' },
                    sheep: { id: 'sheep', label: 'Sheep', path: 'animals/animal-sheep.svg' },
                    shrimp:
                    { id: 'shrimp',
                    label: 'Shrimp',
                    path: 'animals/animal-shrimp.svg' },
                    snail: { id: 'snail', label: 'Snail', path: 'animals/animal-snail.svg' },
                    snake: { id: 'snake', label: 'Snake', path: 'animals/animal-snake.svg' },
                    spider:
                    { id: 'spider',
                    label: 'Spider',
                    path: 'animals/animal-spider.svg' },
                    squirrel:
                    { id: 'squirrel',
                    label: 'Squirrel',
                    path: 'animals/animal-squirrel.svg' },
                    tiger: { id: 'tiger', label: 'Tiger', path: 'animals/animal-tiger.svg' },
                    tortoise:
                    { id: 'tortoise',
                    label: 'Tortoise',
                    path: 'animals/animal-tortoise.svg' },
                    unicorn:
                    { id: 'unicorn',
                    label: 'Unicorn',
                    path: 'animals/animal-unicorn.svg' },
                    whale: { id: 'whale', label: 'Whale', path: 'animals/animal-whale.svg' } 
                },
            }, 
            holidays: {
                label: 'Holidays',
                id: 'holidays',
                resources: { 
                    candle: { id: 'candle',
                      label: 'Candle',
                      path: 'holidays/holidays-candle.svg' },
                    gift: { id: 'gift', label: 'Gift', path: 'holidays/holidays-gift.svg' },
                    gingerbread:
                    { id: 'gingerbread',
                      label: 'Gingerbread',
                      path: 'holidays/holidays-gingerbread.svg' },
                    hat: { id: 'hat', label: 'Hat', path: 'holidays/holidays-hat.svg' },
                    tree: { id: 'tree', label: 'Tree', path: 'holidays/holidays-tree.svg' } 
                },
            }, 
            kano: {
                label: 'Kano',
                id: 'kano',
                resources: {
                    arrow: { id: 'arrow', label: 'Arrow', path: 'kano/arrow.svg' },
                    judoka: { id: 'judoka', label: 'Judoka', path: 'kano/judoka-face.svg' },
                    record: { id: 'record', label: 'Record', path: 'kano/judoka-record.svg' },
                    planet: { id: 'planet', label: 'Planet', path: 'kano/planet.svg' },
                    robotnik: { id: 'robotnik', label: 'Robotnik', path: 'kano/robotnik.svg' },
                    star: { id: 'star', label: 'Star', path: 'kano/star.svg' }
                },
            }, 
            masks: {
                label: 'Masks',
                id: 'masks',
                resources: {
                    alien: { id: 'alien', label: 'Alien', path: 'masks/mask-alien.svg' },
                    bear: { id: 'bear', label: 'Bear', path: 'masks/mask-bear.svg' },
                    blank: { id: 'blank', label: 'Blank', path: 'masks/mask-blank.svg' },
                    boar: { id: 'boar', label: 'Boar', path: 'masks/mask-boar.svg' },
                    'cat-head': { id: 'cat-head', label: 'Cat head', path: 'masks/mask-cat.svg' },
                    'chicken-head':
                    { id: 'chicken-head',
                    label: 'Chicken head',
                    path: 'masks/mask-chicken.svg' },
                    cool: { id: 'cool', label: 'Cool', path: 'masks/mask-cool.svg' },
                    'cow-head': { id: 'cow-head', label: 'Cow head', path: 'masks/mask-cow.svg' },
                    deer: { id: 'deer', label: 'Deer', path: 'masks/mask-deer.svg' },
                    devil: { id: 'devil', label: 'Devil', path: 'masks/mask-devil.svg' },
                    'dog-head': { id: 'dog-head', label: 'Dog head', path: 'masks/mask-dog.svg' },
                    'easter-island':
                    { id: 'easter-island',
                    label: 'Easter island',
                    path: 'masks/mask-easter-island.svg' },
                    fox: { id: 'fox', label: 'Fox', path: 'masks/mask-fox.svg' },
                    frog: { id: 'frog', label: 'Frog', path: 'masks/mask-frog.svg' },
                    gorilla:
                    { id: 'gorilla',
                    label: 'Gorilla',
                    path: 'masks/mask-gorilla.svg' },
                    grin: { id: 'grin', label: 'Grin', path: 'masks/mask-grin.svg' },
                    horse: { id: 'horse', label: 'Horse', path: 'masks/mask-horse.svg' },
                    koala: { id: 'koala', label: 'Koala', path: 'masks/mask-koala.svg' },
                    laughcry:
                    { id: 'laughcry',
                    label: 'Laughcry',
                    path: 'masks/mask-laughcry.svg' },
                    lion: { id: 'lion', label: 'Lion', path: 'masks/mask-lion.svg' },
                    meh: { id: 'meh', label: 'Meh', path: 'masks/mask-meh.svg' },
                    mokey: { id: 'monkey', label: 'Monkey', path: 'masks/mask-mokey.svg' },
                    'mouse-head':
                    { id: 'mouse-head',
                    label: 'Mouse head',
                    path: 'masks/mask-mouse.svg' },
                    panda: { id: 'panda', label: 'Panda', path: 'masks/mask-panda.svg' },
                    'pig-head': { id: 'pig-head', label: 'Pig head', path: 'masks/mask-pig.svg' },
                    pumpkin:
                    { id: 'pumpkin',
                    label: 'Pumpkin',
                    path: 'masks/mask-pumpkin.svg' },
                    rabbit: { id: 'rabbit', label: 'Rabbit', path: 'masks/mask-rabbit.svg' },
                    robot: { id: 'robot', label: 'Robot', path: 'masks/mask-robot.svg' },
                    rolleyes:
                    { id: 'rolleyes',
                    label: 'Rolleyes',
                    path: 'masks/mask-rolleyes.svg' },
                    santa: { id: 'santa', label: 'Santa', path: 'masks/mask-santa.svg' },
                    skull: { id: 'skull', label: 'Skull', path: 'masks/mask-skull.svg' },
                    sleep: { id: 'sleep', label: 'Sleep', path: 'masks/mask-sleep.svg' },
                    'small mouse':
                    { id: 'small mouse',
                    label: 'Small mouse',
                    path: 'masks/mask-small-mouse.svg' },
                    smile: { id: 'smile', label: 'Smile', path: 'masks/mask-smile.svg' },
                    'tiger-head':
                    { id: 'tiger-head',
                    label: 'Tiger head',
                    path: 'masks/mask-tiger.svg' },
                    traditional:
                    { id: 'traditional',
                    label: 'Traditional',
                    path: 'masks/mask-traditional.svg' }
                },
            }, 
            food: {
                label: 'Food',
                id: 'food',
                resources: {
                    burger: { id: 'burger', label: 'Burger', path: 'food/food-burger.svg' },
                    burrito:
                    { id: 'burrito',
                    label: 'Burrito',
                    path: 'food/food-burrito.svg' },
                    candy: { id: 'candy', label: 'Candy', path: 'food/food-candy.svg' },
                    cheese: { id: 'cheese', label: 'Cheese', path: 'food/food-cheese.svg' },
                    cherry: { id: 'cherry', label: 'Cherry', path: 'food/food-cherry.svg' },
                    'chicken-leg':
                    { id: 'chicken-leg',
                    label: 'Chicken leg',
                    path: 'food/food-chicken.svg' },
                    donut: { id: 'donut', label: 'Donut', path: 'food/food-donut.svg' },
                    eggplant:
                    { id: 'eggplant',
                    label: 'Eggplant',
                    path: 'food/food-eggplant.svg' },
                    icecream:
                    { id: 'icecream',
                    label: 'Icecream',
                    path: 'food/food-icecream.svg' },
                    melon: { id: 'melon', label: 'Melon', path: 'food/food-melon.svg' },
                    noodles:
                    { id: 'noodles',
                    label: 'Noodles',
                    path: 'food/food-noodles.svg' },
                    peach: { id: 'peach', label: 'Peach', path: 'food/food-peach.svg' },
                    pineapple:
                    { id: 'pineapple',
                    label: 'Pineapple',
                    path: 'food/food-pineapple.svg' },
                    pizza: { id: 'pizza', label: 'Pizza', path: 'food/food-pizza.svg' },
                    tempura: { id: 'tempura', label: 'Tempura', path: 'food/food-shrimp.svg' },
                    sushi: { id: 'sushi', label: 'Sushi', path: 'food/food-sushi.svg' },
                    taco: { id: 'taco', label: 'Taco', path: 'food/food-taco.svg' },
                    tomato: { id: 'tomato', label: 'Tomato', path: 'food/food-tomato.svg' },
                    watermelon:
                    { id: 'watermelon',
                    label: 'Watermelon',
                    path: 'food/food-watermelon.svg' }
                },
            }, 
            music: {
                label: 'Music',
                id: 'music',
                resources: {
                    bell: { id: 'bell', label: 'Bell', path: 'music/music-bell.svg' },
                    drum: { id: 'drum', label: 'Drum', path: 'music/music-drum.svg' },
                    guitar: { id: 'guitar', label: 'Guitar', path: 'music/music-guitar.svg' },
                    note:
                    { id: 'note',
                        label: 'Note',
                        path: 'music/music-musical-note.svg' },
                    notes:
                    { id: 'notes',
                        label: 'Notes',
                        path: 'music/music-musical-notes.svg' },
                    pick: { id: 'pick', label: 'Pick', path: 'music/music-pick.svg' },
                    sax: { id: 'sax', label: 'Sax', path: 'music/music-sax.svg' },
                    trumpet:
                    { id: 'trumpet',
                        label: 'Trumpet',
                        path: 'music/music-trumpet.svg' }
                },
            }, 
            'street-art': {
                label: 'Street Art',
                id: 'street-art',
                resources: {
                    bolt: { id: 'bolt', label: 'Bolt', path: 'street-art/bolt.svg' },
                    creeper:
                    { id: 'creeper',
                        label: 'Creeper',
                        path: 'street-art/creeper.svg' },
                    'doubting-donut':
                    { id: 'doubting-donut',
                        label: 'Doubting donut',
                        path: 'street-art/doubting-donut.svg' },
                    'krink-marker':
                    { id: 'krink-marker',
                        label: 'Krink marker',
                        path: 'street-art/krink-marker.svg' },
                    markers:
                    { id: 'markers',
                        label: 'Markers',
                        path: 'street-art/markers.svg' },
                    'mouse-art':
                    { id: 'mouse-art',
                        label: 'Mouse art',
                        path: 'street-art/mouse.svg' },
                    mrsprinkles:
                    { id: 'mrsprinkles',
                        label: 'Mrsprinkles',
                        path: 'street-art/mrsprinkles.svg' },
                    'old-schooler':
                    { id: 'old-schooler',
                        label: 'Old schooler',
                        path: 'street-art/old-schooler.svg' },
                    peace: { id: 'peace', label: 'Peace', path: 'street-art/peace.svg' },
                    'pixel-spraycan':
                    { id: 'pixel-spraycan',
                        label: 'Pixel spraycan',
                        path: 'street-art/pixel-spraycan.svg' },
                    point: { id: 'point', label: 'Point', path: 'street-art/point.svg' },
                    'rainbow-roller':
                    { id: 'rainbow-roller',
                        label: 'Rainbow roller',
                        path: 'street-art/rainbow-roller.svg' },
                    soydog: { id: 'soydog', label: 'Soydog', path: 'street-art/soydog.svg' },
                    spraycan:
                    { id: 'spraycan',
                        label: 'Spraycan',
                        path: 'street-art/spraycan.svg' },
                    spraying:
                    { id: 'spraying',
                        label: 'Spraying',
                        path: 'street-art/spraying.svg' },
                    'graffiti-star':
                    { id: 'graffiti-star',
                        label: 'Graffiti star',
                        path: 'street-art/star.svg' },
                    supreme:
                    { id: 'supreme',
                        label: 'Supreme',
                        path: 'street-art/supreme-code.svg' }
                },
            }, 
            other: {
                label: 'Other',
                id: 'other',
                resources: {
                    avocado:
                    { id: 'avocado',
                        label: 'Avocado',
                        path: 'other/other-avocado.svg' },
                    baseball:
                    { id: 'baseball',
                        label: 'Baseball',
                        path: 'other/other-ball-baseball.svg' },
                    basketball:
                    { id: 'basketball',
                        label: 'Basketball',
                        path: 'other/other-ball-basketball.svg' },
                    football:
                    { id: 'football',
                        label: 'Football',
                        path: 'other/other-ball-football.svg' },
                    tennisball:
                    { id: 'tennisball',
                        label: 'Tennisball',
                        path: 'other/other-ball-tennis.svg' },
                    ball: { id: 'ball', label: 'Ball', path: 'other/other-ball.svg' },
                    cactus: { id: 'cactus', label: 'Cactus', path: 'other/other-cactus.svg' },
                    cake: { id: 'cake', label: 'Cake', path: 'other/other-cake.svg' },
                    clap: { id: 'clap', label: 'Clap', path: 'other/other-clap.svg' },
                    controller:
                    { id: 'controller',
                        label: 'Controller',
                        path: 'other/other-controller.svg' },
                    clubs: { id: 'clubs', label: 'Clubs', path: 'other/other-clubs.svg' },
                    diamonds:
                    { id: 'diamonds',
                        label: 'Diamonds',
                        path: 'other/other-diamonds.svg' },
                    hearts: { id: 'hearts', label: 'Hearts', path: 'other/other-hearts.svg' },
                    spades: { id: 'spades', label: 'Spades', path: 'other/other-spades.svg' },
                    dice: { id: 'dice', label: 'Dice', path: 'other/other-dice.svg' },
                    eightball:
                    { id: 'eightball',
                        label: 'Eightball',
                        path: 'other/other-eightball.svg' },
                    face:
                    { id: 'face',
                        label: 'Face',
                        path: 'other/other-face.svg' },
                    ghost: { id: 'ghost', label: 'Ghost', path: 'other/other-ghost.svg' },
                    hotdog: { id: 'hotdog', label: 'Hotdog', path: 'other/other-hotdog.svg' },
                    keyboard:
                    { id: 'keyboard',
                        label: 'Keyboard',
                        path: 'other/other-keyboard.svg' },
                    keytar: { id: 'keytar', label: 'Keytar', path: 'other/other-keytar.svg' },
                    lightning:
                    { id: 'lightning',
                        label: 'Lightning',
                        path: 'other/other-lightning-bolt.svg' },
                    map: { id: 'map', label: 'Map', path: 'other/other-map.svg' },
                    medal: { id: 'medal', label: 'Medal', path: 'other/other-medal.svg' },
                    medal2:
                    { id: 'medal2',
                        label: 'Medal2',
                        path: 'other/other-medal-2.svg' },
                    microphone:
                    { id: 'microphone',
                        label: 'Microphone',
                        path: 'other/other-microphone.svg' },
                    micropscope:
                    { id: 'micropscope',
                        label: 'Micropscope',
                        path: 'other/other-micropscope.svg' },
                    minecraft:
                    { id: 'minecraft',
                        label: 'Minecraft',
                        path: 'other/other-minecraft-block.svg' },
                    paintbrush:
                    { id: 'paintbrush',
                        label: 'Paintbrush',
                        path: 'other/other-paintbrush.svg' },
                    palmtree:
                    { id: 'palmtree',
                        label: 'Palmtree',
                        path: 'other/other-palmtree.svg' },
                    pen: { id: 'pen', label: 'Pen', path: 'other/other-pen.svg' },
                    piano:
                    { id: 'piano',
                        label: 'Piano',
                        path: 'other/other-piano-keyboard.svg' },
                    poop: { id: 'poop', label: 'Poop', path: 'other/other-poop.svg' },
                    popcorn:
                    { id: 'popcorn',
                        label: 'Popcorn',
                        path: 'other/other-popcorn.svg' },
                    'space-invader':
                    { id: 'space-invader',
                        label: 'Space invader',
                        path: 'other/other-space-invader.svg' },
                    spider2:
                    { id: 'spider2',
                        label: 'Spider2',
                        path: 'animals/animal-spider-2.svg' },
                    sprout: { id: 'sprout', label: 'Sprout', path: 'other/other-sprout.svg' },
                    thermometer:
                    { id: 'thermometer',
                        label: 'Thermometer',
                        path: 'other/other-thermometer.svg' },
                    toadstool:
                    { id: 'toadstool',
                        label: 'Toadstool',
                        path: 'other/other-toadstool.svg' },
                    trophy: { id: 'trophy', label: 'Trophy', path: 'other/other-trophy.svg' },
                    pancakes:
                    { id: 'pancakes',
                        label: 'Pancakes',
                        path: 'other/other-waffles.svg' }
                },
            }, 
            data: {
                label: 'Photo',
                id: 'data',
                resources: {
                    'animal-nose':
                    { id: 'animal-nose',
                      label: 'Animal',
                      path: 'photo-play/photo-animal-nose.svg' },
                    boom: { id: 'boom', label: 'Boom', path: 'photo-play/photo-boom.svg' },
                    see:
                        { id: 'see',
                        label: 'See',
                        path: 'photo-play/photo-bubble-see-speech.svg' },
                    'speech-left':
                        { id: 'speech-left',
                        label: 'Speech left',
                        path: 'photo-play/photo-bubble-speech-left.svg' },
                    'speech-right':
                        { id: 'speech-right',
                        label: 'Speech right',
                        path: 'photo-play/photo-bubble-speech-right.svg' },
                    'speech-urgent':
                        { id: 'speech-urgent',
                        label: 'Speech urgent',
                        path: 'photo-play/photo-bubble-speech-urgent.svg' },
                    thought:
                        { id: 'thought',
                        label: 'Thought',
                        path: 'photo-play/photo-bubble-thought.svg' },
                    crown:
                        { id: 'crown',
                        label: 'Crown',
                        path: 'photo-play/photo-crown.svg' },
                    ears: { id: 'ears', label: 'Ears', path: 'photo-play/photo-ears.svg' },
                    eye: { id: 'eye', label: 'Eye', path: 'photo-play/photo-eye.svg' },
                    eyes: { id: 'eyes', label: 'Eyes', path: 'photo-play/photo-eyes.svg' },
                    heart:
                        { id: 'heart',
                        label: 'Heart',
                        path: 'photo-play/photo-hearts.svg' },
                    lightbulb:
                        { id: 'lightbulb',
                        label: 'Lightbulb',
                        path: 'photo-play/photo-lightbulb.svg' },
                    lips: { id: 'lips', label: 'Lips', path: 'photo-play/photo-lips.svg' },
                    mouth:
                        { id: 'mouth',
                        label: 'Mouth',
                        path: 'photo-play/photo-mouth.svg' },
                    nose: { id: 'nose', label: 'Nose', path: 'photo-play/photo-nose.svg' },
                    sunglasses:
                        { id: 'sunglasses',
                        label: 'Sunglasses',
                        path: 'photo-play/photo-sunglasses.svg' },
                    tongue:
                        { id: 'tongue',
                        label: 'Tongue',
                        path: 'photo-play/photo-tongue.svg' },
                    zzz: { id: 'zzz', label: 'Zzz', path: 'photo-play/photo-zzz.svg' }
                },
            },
            space: {
                label: 'Space',
                id: 'space',
                resources: { 
                    america:
                    { id: 'america',
                      label: 'America',
                      path: 'space/earth-america.svg' },
                    asia: { id: 'asia', label: 'Asia', path: 'space/earth-asia.svg' },
                    europe: { id: 'europe', label: 'Europe', path: 'space/earth-europe.svg' },
                    meteor: { id: 'meteor', label: 'Meteor', path: 'space/meteor.svg' },
                    moon: { id: 'moon', label: 'Moon', path: 'space/moon-1.svg' },
                    moon2: { id: 'moon2', label: 'Moon2', path: 'space/moon-2.svg' },
                    moon3: { id: 'moon3', label: 'Moon3', path: 'space/moon-3.svg' },
                    moon4: { id: 'moon4', label: 'Moon4', path: 'space/moon-4.svg' },
                    moon5: { id: 'moon5', label: 'Moon5', path: 'space/moon-5.svg' },
                    moon6: { id: 'moon6', label: 'Moon6', path: 'space/moon-6.svg' },
                    moon7: { id: 'moon7', label: 'Moon7', path: 'space/moon-7.svg' },
                    moon8: { id: 'moon8', label: 'Moon8', path: 'space/moon-8.svg' },
                    'moon-smiling':
                        { id: 'moon-smiling',
                        label: 'Moon smiling',
                        path: 'space/moon-smiling.svg' },
                    night: { id: 'night', label: 'Night', path: 'space/night-sky.svg' },
                    satellite:
                        { id: 'satellite',
                        label: 'Satellite',
                        path: 'space/satellite.svg' },
                    rocket: { id: 'rocket', label: 'Rocket', path: 'space/space-rocket.svg' },
                    'shining-star':
                        { id: 'shining-star',
                        label: 'Shining star',
                        path: 'space/star.svg' },
                    'sun-smiling':
                        { id: 'sun-smiling',
                        label: 'Sun smiling',
                        path: 'space/sun-smiling.svg' },
                    telescope:
                        { id: 'telescope',
                        label: 'Telescope',
                        path: 'space/telescope.svg' } 
                },
            }, 
            vehicles: {
                label: 'Vehicles',
                id: 'vehicles',
                resources: { ambulance:
                    { id: 'ambulance',
                      label: 'Ambulance',
                      path: 'vehicles/ambulance.svg' },
                    'fire-engine':
                        { id: 'fire engine',
                        label: 'Fire engine',
                        path: 'vehicles/fire-engine.svg' },
                    'police-car':
                        { id: 'police-car',
                        label: 'Police',
                        path: 'vehicles/police-car.svg' },
                    'red-car': { id: 'red-car', label: 'Red car', path: 'vehicles/red-car.svg' },
                    taxi: { id: 'taxi', label: 'Taxi', path: 'vehicles/taxi.svg' } },
            }
        }
    }
}

export class DefaultResources extends Resources{
    constructor() {
        super();
        this.resources.set('stickers', new DefaultStickers());
    }
}