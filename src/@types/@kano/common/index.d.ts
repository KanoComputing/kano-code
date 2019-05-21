declare module '@kano/common/index.js' {
    import { IDisposable } from '@kano/common/lifecycle/disposables.js';
    export * from '@kano/common/lifecycle/disposables.js';
    export * from '@kano/common/events/emitter.js';

    export function subscribeTimeout(callback : () => void, timeout? : number) : IDisposable;
    export function subscribeInterval(callback : () => void, timeout? : number) : IDisposable;
}
