const query = location.search.replace(/^\?/, '');
const queryParts = query.split('&');
const params = queryParts.reduce((acc, line) => {
    const parts = line.split('=');
    const [key, value] = parts;
    if (!value) {
        return acc;
    }
    const values = value.split(',');
    acc[key] = values.length === 1 ? values[0] : values;
    return acc;
}, {});

export const loadTests = (tests) => {
    mocha.setup('tdd');
    let testFiles;
    if (!params.filter) {
        testFiles = Object.keys(tests).map(k => tests[k]);
    } else {
        testFiles = Object.keys(tests).reduce((acc, testKey) => {
            if (params.filter && params.filter.indexOf(testKey) !== -1) {
                acc.push(tests[testKey]);
            }
            return acc;
        }, []);
    }
    return Promise.all(testFiles.map(t => import(t)))
        .then(() => {
            mocha.checkLeaks();
            mocha.run();
        });
};
