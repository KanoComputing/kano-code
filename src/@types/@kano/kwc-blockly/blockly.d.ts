declare module '@kano/kwc-blockly/blockly.js' {
    class BlockSvg {
        static INLINE_PADDING_Y : number
    }
    class Input {
        insertFieldAt(index : number, field : Field|string, name : string) : Field;
    }
    class Block {
        type : string;
        inputList : Input[];
        getSvgRoot() : SVGElement;
        getField(name : string) : Field;
        setPreviousStatement(state : boolean) : Block;
        setNextStatement(state : boolean) : Block;
    }
    class Field {
        protected width_ : number;
        protected height_ : number;
        protected size_ : any;
        protected text_ : string;
        protected tooltip_ : string;
        sourceBlock_ : Block;
    }
    class Workspace {
        getAllBlocks() : Block[];
    }
    const goog : any;
    const utils : {
        createSvgElement(tag : string, props? : any, parent? : SVGElement|null) : SVGElement;
    }
}