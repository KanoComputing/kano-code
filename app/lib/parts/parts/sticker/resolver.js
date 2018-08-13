class StickerResolver {
    static resolve(root, set, sticker) {
        return `${root}${set}/${sticker}.svg`;
    }
}

export { StickerResolver };

export default StickerResolver;
