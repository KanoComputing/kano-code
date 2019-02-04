
declare module 'flow-down/flow-down.js' {
    import { PolymerElement } from '@polymer/polymer';

    type Constructor<T> = {
        new(...args: any[]) : T;
    }

    type ProviderMixin = <B extends Constructor<HTMLElement>>(parent : B) => B;

    interface IActionEvent {
        type : string;
        [K : string] : any;
    }

    interface Store {
        StateReceiver : any;
        ReceiverBehavior : any;
        StateProvider : ProviderMixin;
        id : number;
        providerElement : HTMLElement;
        dispatch(event : IActionEvent) : void;
        getState() : any;
        addMutator(mutator : (this : any, action : IActionEvent) => void) : void;
        appStateComponent : PolymerElement;
    }
    export function createStore(initialState : object) : Store;
}