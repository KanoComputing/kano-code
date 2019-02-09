export function throttle(callback : Function, wait : number, immediate = false) {
    let timeout : number|null = null;
    let initialCall = true;
    return function (this : any) {
        const callNow = immediate && initialCall;
        const next = () => {
            callback.apply(this, arguments);
            timeout = null;
        }
        if (callNow) {
            initialCall = false;
            next();
        }
        if (!timeout) {
            timeout = window.setTimeout(next, wait);
        }
    }
}