import { IStepData } from './creator.js';

export function runMiddleware(stepData : IStepData, middleware? : string) {
    if (!middleware) {
        return stepData;
    }
    let result = stepData;
    try {
        const fn = new Function('step', middleware);
        result = fn.call(null, Object.assign({}, stepData));
    } catch (e) {
        console.error(e);
    }
    return result;
}