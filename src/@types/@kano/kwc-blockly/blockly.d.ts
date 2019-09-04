declare module '@kano/kwc-blockly/blockly.js' {
    class BlockSvg extends Block {
        static INLINE_PADDING_Y : number
        static SEP_SPACE_X : number;
        initSvg() : void;
    }
    class Connection {
        targetBlock() : Block;
        targetConnection : Connection;
        sourceBlock_ : Block;
        getSourceBlock() : Block;
        x_ : number;
        y_ : number;
        connect(connection : Connection) : void;
    }
    class Input {
        name : string;
        type : number;
        appendField<T extends Field = Field>(field : T|string, name? : string) : Input;
        insertFieldAt(index : number, field : Field|string, name : string) : Input;
        removeField(name : string) : Input;
        connection? : Connection;
        sourceBlock_ : Block;
        fieldRow : Field[];
        setCheck(type : string) : Input;
        setAlign(alignment : boolean) : Input;
    }
    class Block {
        constructor(workspace : Workspace)
        id : string;
        type : string;
        inputList : Input[];
        isInFlyout : boolean;
        getSvgRoot() : SVGElement;
        getField(name : string) : Field|null;
        getFieldValue<T = string>(name : string) : T;
        setPreviousStatement(state : boolean, type? : string) : Block;
        setNextStatement(state : boolean, type? : string) : Block;
        setColour(c : string) : Block;
        appendDummyInput(n? : string) : Input;
        getInput(n : string) : Input|null;
        removeInput(n : string) : void;
        isShadow() : boolean;
        getParent() : Block|null;
        nextConnection? : Connection;
        previousConnection? : Connection;
        outputConnection? : Connection;
        RTL : boolean;
        svgPath_ : SVGPathElement;
        getRelativeToSurfaceXY() : { x : number, y : number };
        workspace : Workspace;
        setOutput(o : boolean, type? : string) : Block;
        appendValueInput(name? : string) : Input;
        appendStatementInput(name? : string) : Input;
        initSvg() : void;
        render() : void;
        setFieldValue(value : string, field : string) : void;
        setInputsInline(inline : boolean) : Block;
    }
    class Field {
        protected width_ : number;
        protected height_ : number;
        protected size_ : any;
        protected text_ : string;
        protected tooltip_ : string;
        public fieldGroup_ : SVGElement|null;
        protected borderRect_ : SVGElement|null;
        protected visible_ : boolean;
        public sourceBlock_ : Block;
        public name : string;
        constructor(value : string|null, validator? : (v : string) => void);
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
        public setSourceBlock(block : Block) : void;
        public dispose() : void;
    }
    class FieldColour extends Field {}
    class FieldNumber extends Field {}
    class FieldDropdown extends Field {
        getOptions() : [string, string][];
    }
    class FieldVariable extends FieldDropdown {}
    class FieldCustomDropdown extends FieldDropdown {}
    class FieldTextInput extends Field {
        static htmlInput_ : HTMLInputElement;
        spellcheck_ : boolean;
        static FONTSIZE : number;
        validate_() : void;
        resizeEditor_() : void;
        bindEvents_(input : HTMLInputElement) : void;
        widgetDispose_() : Function;
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
    class Variable {
        name : string;
    }
    class Workspace<T extends Block = Block> {
        getCanvas() : SVGElement;
        getAllBlocks() : T[];
        getTopBlocks() : T[];
        getBlockById(id : string) : T|null;
        getMetrics() : any;
        getFlyout_() : Flyout;
        addChangeListener(callback : (e : any) => void) : (e : any) => void;
        removeChangeListener(callback : (e : any) => void) : void;
        getVariableById(id : string) : Variable|null;
        newBlock(type : string, id? : string) : T;
        cleanUp() : void;
        toolbox : Toolbox;
        toolbox_ : Toolbox;
        componentRoot_ : HTMLElement;
        scale : number;
        dispose() : void;
        centerOnBlock(id : string) : void;
    }
    class WorkspaceSvg extends Workspace<BlockSvg> {
        constructor(options : any);
        getParentSvg() : SVGElement;
    }
    const goog : any;
    const utils : {
        genUid : {
            () : string;
            soup_ : string;
        };
        getViewportBBox() : any;
        createSvgElement<T extends SVGElement = SVGElement>(tag : string, props? : any, parent? : SVGElement|null) : T;
        addClass(el : SVGElement, cl : string) : void;
        removeClass(el : SVGElement, cl : string) : void;
        replaceMessageReferences(message: string|any): string;
    }
    class Generator {
        valueToCode(block : Block, name : string, outerOrder : number) : string;

        ORDER_ATOMIC : number;
        ORDER_NEW : number;
        ORDER_MEMBER : number;
        ORDER_FUNCTION_CALL : number;
        ORDER_INCREMENT : number;
        ORDER_DECREMENT : number;
        ORDER_BITWISE_NOT : number;
        ORDER_UNARY_PLUS : number;
        ORDER_UNARY_NEGATION : number;
        ORDER_LOGICAL_NOT : number;
        ORDER_TYPEOF : number;
        ORDER_VOID : number;
        ORDER_DELETE : number;
        ORDER_AWAIT : number;
        ORDER_EXPONENTIATION : number;
        ORDER_MULTIPLICATION : number;
        ORDER_DIVISION : number;
        ORDER_MODULUS : number;
        ORDER_SUBTRACTION : number;
        ORDER_ADDITION : number;
        ORDER_BITWISE_SHIFT : number;
        ORDER_RELATIONAL : number;
        ORDER_IN : number;
        ORDER_INSTANCEOF : number;
        ORDER_EQUALITY : number;
        ORDER_BITWISE_AND : number;
        ORDER_BITWISE_XOR : number;
        ORDER_BITWISE_OR : number;
        ORDER_LOGICAL_AND : number;
        ORDER_LOGICAL_OR : number;
        ORDER_CONDITIONAL : number;
        ORDER_ASSIGNMENT : number;
        ORDER_YIELD : number;
        ORDER_COMMA : number;
        ORDER_NONE : number;
    }
    class WidgetDiv {
        static isVisible() : boolean;
        static hide() : void;
        static DIV : HTMLDivElement;
        static show(block : Field, rtl : boolean, dispose : Function) : void;
        static positionWithAnchor(a : any, b : any, c : any, rtl : boolean) : void;
    }
    class BlocklyEvent {}
    class BlockChange extends BlocklyEvent {
        constructor(block : Block, type : string, name : string, oldValue : any, newValue : any);
    }
    class Events {
        UI : string;
        CREATE : string;
        MOVE : string;
        OPEN_FLYOUT : string;
        CLOSE_FLYOUT : string;
        isEnabled() : boolean;
        BlockChange : typeof BlockChange;
        fire(event : BlocklyEvent) : void;
    }
    class FieldConfig extends Field {
        position() : void;
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
        WidgetDiv : typeof WidgetDiv;
        Events : Events;
        setPhantomBlock(connection : Connection, target : Block) : void;
        setPhantomBlockByPosition(workspace : Workspace, target : Block) : void;
        removePhantomBlock() : void;
        selected? : Block;
        FieldConfig : typeof FieldConfig;
    }
    class Xml {
        static workspaceToDom(workspace : Workspace) : XMLDocument;
        static domToWorkspace(dom : HTMLElement, workspace : Workspace) : void;
        static textToDom(text : string) : HTMLElement;
        static domToText(dom : HTMLElement|XMLDocument) : string;
        static blockToDom(block : Block) : HTMLElement;
        static domToBlock(dom : HTMLElement, workspace : Workspace) : Block;
    }
    class VariableModel {
        name : string;
        getId() : string;
        type : string;
    }
    class Variables {
        static getVariable(workspace : Workspace, id : string|null, opt_name? : string, opt_type? : string) : VariableModel|null;
    }
}