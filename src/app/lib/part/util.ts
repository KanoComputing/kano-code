export function sanitizeVariable(input : string) {
    return input.replace(/^[^a-zA-Z_$]|[^\\w$]/g, '_');
}

export function collectPrototype<T>(key : string, base : any, limit : any) : Map<string, T> {
    let c = base;
    const components : Map<string, T> = new Map();
    while (c !== limit) {
        Object.keys(c[key]).forEach((k) => components.set(k, c[key][k]));
        c = Object.getPrototypeOf(c);
    }
    return components;
}
