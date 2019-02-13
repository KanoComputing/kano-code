export interface IEditorWidget {
    [K : string] : any;
    getDomNode() : HTMLElement;
}
