declare module '@kano/common/index.js' {
    interface IDisposable {
        dispose() : void;
    }
    class Disposables implements IDisposable {
        push(...args : IDisposable[]) : void;
        dispose() : void;
    }
    type IEvent<T> = (callback : (data : T) => void, thisArg? : any, subs? : IDisposable[]) => IDisposable;
    class EventEmitter<T = void> {
        event : IEvent<T>;
        fire(data : T) : void;
        dispose() : void;
    }
    function subscribe(target : any, name : string, callback : Function, thisArg? : any, subs? : IDisposable[]) : IDisposable;
    function subscribeDOM(target : HTMLElement, name : string, callback : Function, thisArg? : any, subs? : IDisposable[]) : IDisposable;
    function subscribeTimeout(callback : () => void, timeout? : number) : IDisposable;
    function subscribeInterval(callback : () => void, timeout? : number) : IDisposable;
}