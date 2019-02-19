export abstract class DialogProvider {
    abstract createDom() : HTMLElement;
    abstract dispose() : void;
}

export default DialogProvider;
