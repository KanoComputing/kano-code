export function join(a : string, b : string) {
    const safeA = a.replace(/\/$/, '');
    const safeB = b.replace(/^\//, '');
    return `${safeA}/${safeB}`;
}

export function extname(p : string) {
    return p.substring(p.lastIndexOf('.') + 1) || null;
}