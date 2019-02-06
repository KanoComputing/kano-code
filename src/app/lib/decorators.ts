export function debug(target : any, key : string, descriptor : any) {
    if (!descriptor) {
        return;
    }
    const originalMethod = descriptor.value;
    descriptor.value = function (...args : any[]) {
        console.log(`[%cDEBUG%c] %c${target.constructor.name}%c.%c${key}%c(`, 'color: cyan', 'color: inherit', 'color: #03a9f4', 'color: white', 'color: #03a9f4', 'color: inherit', ...args, ')');
        return originalMethod.apply(this, arguments);
    };
    return descriptor;
}