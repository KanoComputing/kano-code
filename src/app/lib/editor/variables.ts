

export class VariableStore {
    private vars : Set<string> = new Set();
    /**
     * Generates a safe to be used string as JS variable for the runner
     * @param source Original name
     */
    getAvailable(source : string) {
        const safeName = VariableStore.getSafeName(source);
        let potentialName = safeName;
        // Start at one. Useful for user facing generated code
        let incr = 1;
        while (this.vars.has(potentialName)) {
            incr += 1;
            potentialName = `${safeName}${incr}`;
        }
        this.reserve(potentialName);
        return potentialName;
    }
    /**
     * Reserves this variable. Does not check for name clashing
     * @param name Name to reserve
     */
    reserve(name : string) {
        this.vars.add(name);
    }
    /**
     * Marks a variable name as free to use
     * @param name Name to free
     */
    free(name : string) {
        this.vars.delete(name);
    }
    /**
     * Generate a safe equivalent of a provided name
     * @param source Source name
     */
    static getSafeName(source : string) {
        let result = '';
        if (/[A-Za-z]|\$|_/.test(source.charAt(0))) {
            result += source.charAt(0).toLowerCase();
        }
        for (let i = 1; i < source.length; i += 1) {
            if (/[A-Za-z0-9]|\$|_/.test(source.charAt(i))) {
                result += source.charAt(i);
            }
        }
        return result;
    }
}