declare module '@kano/kwc-blockly/blockly.js' {
    class BlockSvg {
        static INLINE_PADDING_Y : number
        static SEP_SPACE_X : number;
    }
    class Connection {
        targetBlock() : Block;
        targetConnection : Connection;
        sourceBlock_ : Block;
    }
    class Input {
        name : string;
        type : number;
        appendField<T extends Field = Field>(field : T|string, name? : string) : Field;
        insertFieldAt(index : number, field : Field|string, name : string) : Field;
        removeField(name : string) : Input;
        connection? : Connection;
        sourceBlock_ : Block;
    }
    class Block {
        id : string;
        type : string;
        inputList : Input[];
        isInFlyout : boolean;
        getSvgRoot() : SVGElement;
        getField(name : string) : Field|null;
        getFieldValue<T = string>(name : string) : T;
        setPreviousStatement(state : boolean) : Block;
        setNextStatement(state : boolean) : Block;
        setColour(c : string) : Block;
        appendDummyInput(n? : string) : Input;
        getInput(n : string) : Input|null;
        removeInput(n : string) : void;
        isShadow() : boolean;
        nextConnection? : Connection;
        previousConnection? : Connection;
        RTL : boolean;
    }
    class Field {
        protected width_ : number;
        protected height_ : number;
        protected size_ : any;
        protected text_ : string;
        protected tooltip_ : string;
        protected fieldGroup_ : SVGElement|null;
        protected borderRect_ : SVGElement|null;
        protected visible_ : boolean;
        protected sourceBlock_ : Block;
        public name : string;
        constructor(value : string|null, validator? : () => void);
        forceRerender() : void;
        getValue() : string;
        setValue(v : string) : void;
        static getCachedWidth(text : SVGElement) : number;
        setText(v : string) : void;
        getScaledBBox_() : any;
        protected getDisplayText_() : string;
        protected updateWidth() : void;
        protected render_() : void;
        public getText() : string;
    }
    class Toolbox {
        opened : boolean;
        getCategoryElement(id : string) : HTMLElement;
        flyout_ : Flyout|null;
    }
    class Flyout {
        getWidth() : number;
        getBlockByType(type : string) : Block|null;
    }
    class Workspace {
        getAllBlocks() : Block[];
        getBlockById(id : string) : Block|null;
        getMetrics() : any;
        getFlyout_() : Flyout;
        addChangeListener(callback : (e : any) => void) : (e : any) => void;
        removeChangeListener(callback : (e : any) => void) : void;
        toolbox : Toolbox;
        toolbox_ : Toolbox;
    }
    const goog : any;
    const utils : {
        getViewportBBox() : any;
        createSvgElement(tag : string, props? : any, parent? : SVGElement|null) : SVGElement;
    }
    class Generator {
        valueToCode(block : Block, name : string) : string;
    }
    class WidgetDiv {
        isVisible() : boolean;
        hide() : void;
        DIV : HTMLDivElement;
        show(block : Field, rtl : boolean, dispose : Function) : void;
        positionWithAnchor(a : any, b : any, c : any, rtl : boolean) : void;
    }
    class BlocklyEvent {}
    class BlockChange extends BlocklyEvent {
        constructor(block : Block, type : string, name : string, oldValue : any, newValue : any);
    }
    class Events {
        MOVE : string;
        OPEN_FLYOUT : string;
        CLOSE_FLYOUT : string;
        isEnabled() : boolean;
        BlockChange : typeof BlockChange;
        fire(event : BlocklyEvent) : void;
    }
    const Blockly : {
        DUMMY_INPUT : number;
        ALIGN_RIGHT : string;
        JavaScript : Generator;
        Msg : { [K : string] : string };
        Blocks : {
            [K : string] : any;
        };
        bindEvent_(target : HTMLElement|SVGElement, event : string, thisArg : any, callback : Function) : void;
        WidgetDiv : WidgetDiv;
        Events : Events;
        setPhantomBlock(connection : Connection, target : Block) : void;
        removePhantomBlock() : void;
        selected? : Block;
    }
}