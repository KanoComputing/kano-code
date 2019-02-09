declare module '@kano/kwc-blockly/blockly.js' {
    class BlockSvg {
        static INLINE_PADDING_Y : number
    }
    class Input {
        appendField<T extends Field = Field>(field : T|string, name? : string) : Field;
        insertFieldAt(index : number, field : Field|string, name : string) : Field;
    }
    class Block {
        id : string;
        type : string;
        inputList : Input[];
        getSvgRoot() : SVGElement;
        getField(name : string) : Field|null;
        getFieldValue<T = string>(name : string) : T;
        setPreviousStatement(state : boolean) : Block;
        setNextStatement(state : boolean) : Block;
        setColour(c : string) : Block;
        appendDummyInput(n? : string) : Input;
        getInput(n : string) : Input|null;
        removeInput(n : string) : void;
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
    class Generator {
        valueToCode(block : Block, name : string) : string;
    }
    const Blockly : {
        ALIGN_RIGHT : string;
        JavaScript : Generator;
        Msg : { [K : string] : string };
        Blocks : {
            [K : string] : any;
        };
        Events : {
            MOVE : string;
        };
    }
}