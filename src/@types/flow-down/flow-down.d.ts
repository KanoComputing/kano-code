
declare module 'flow-down/flow-down.js' {
    import { PolymerElement } from '@polymer/polymer';

    type Constructor<T> = {
        new(...args: any[]) : T;
    }

    type ProviderMixin = <B extends Constructor<HTMLElement>>(parent : B) => B;

    interface Store {
        StateReceiver : any;
        ReceiverBehavior : any;
        StateProvider : ProviderMixin;
        id : number;
        providerElement : HTMLElement;
    }
    export function createStore(initialState : object) : Store;
}