export function findInSet<T>(set : Set<T>, predicate : (value : T) => boolean) {
    for (const e of set) {
        if (predicate(e)) {
            return e;
        }
    }
    return null;
}
