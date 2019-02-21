declare module '@kano/icons-rendering/index.js' {
    function svg(source : TemplateStringsArray, ...args : any[]) : HTMLTemplateElement;
    function dataURI(tpl : HTMLTemplateElement) : string;
}