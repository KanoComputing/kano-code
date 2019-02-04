export function join(a : string, b : string) {
    const safeA = a.replace(/\/$/, '');
    const safeB = b.replace(/^\//, '');
    return `${safeA}/${safeB}`;
}
