declare module '@kano/common/index.js' {
    interface IDisposable {
        dispose() : void;
    }
    class Disposables implements IDisposable {
        push(...args : IDisposable[]) : void;
        dispose() : void;
    }
    function subscribe(target : any, name : string, callback : Function, thisArg? : any) : IDisposable;
    function subscribeDOM(target : HTMLElement, name : string, callback : Function, thisArg? : any) : IDisposable;
}