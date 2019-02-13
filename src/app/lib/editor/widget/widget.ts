export interface IEditorWidget {
    [K : string] : any;
    getDomNode() : HTMLElement;
    getPosition() : string|null;
}
