import background from '../../assets/filesets/background';

let sets = {
        background
    },
    filesets;

export default filesets = {
    load (...list) {
        let filtered;
        filtered = Object.keys(sets)
                            .filter((name) => list.indexOf(name) !== -1)
                            .map((name) => sets[name]);
        return filesets.mergeSets(filtered);
    },
    /**
     * Merges multiple filesets. Takes care of concatenating every children if
     * there is a name collision
     */
    mergeSets (sets) {
        let name,
            concatened,
            grouped;

        concatened = sets.reduce((acc, set) => {
            return acc.concat(set);
        }, []);

        grouped = concatened.reduce((acc, set) => {
            name = set.name;
            acc[name] = acc[name] || [];
            acc[name].push(set);
            return acc;
        }, {});
        concatened = Object.keys(grouped).map((name) => {
            let duplicates = grouped[name];
            if (duplicates.length !== 1) {
                let merged = Object.assign.apply(Object, [{}].concat(duplicates));
                merged.children = filesets.mergeSets(duplicates.map(set => set.children));
                return merged;
            }
            return duplicates[0];
        });
        return concatened;
    }
};
