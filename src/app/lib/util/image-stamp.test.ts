import { reduceAllImages, resolve } from './image-stamp.js';

const string = 'some string';
const blockStickers : { id: string, label : string, stickers : { [K : string] : string } }[] = [{
    label: 'Label',
    id: 'label',
    stickers: {
        a: 'label/label-a.svg',
        b: 'label/label-b.svg',
        c: 'label/label-c.svg'
    },
},{
    label: 'Other Label',
    id: 'other-label',
    stickers: {
        d: 'other-label/other-label-d.svg',
        e: 'other-label/other-label-e.svg',
        f: 'other-label/other-label-f.svg'
    }
}]

suite('image-stamp', () => {
    test('#reduceAllImages()', () => {
        let result = reduceAllImages(blockStickers);
        assert.deepEqual(result, {
            a: 'label/label-a.svg',
            b: 'label/label-b.svg',
            c: 'label/label-c.svg',
            d: 'other-label/other-label-d.svg',
            e: 'other-label/other-label-e.svg',
            f: 'other-label/other-label-f.svg',
        });
    })

    test('#resolve()', () => {
        let result = resolve(string);
        assert.match(result, /{\w||\/}+assets\/part\/stickers\/some\%20string/);
    });
});