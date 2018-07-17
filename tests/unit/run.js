export const loadTests = (testFiles) => {
    mocha.setup('tdd');
    return Promise.all(testFiles.map(t => import(t)))
        .then(() => {
            mocha.checkLeaks();
            mocha.run();
        });
};
