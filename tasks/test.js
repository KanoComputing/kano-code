'use strict';
let wct = require('web-component-tester'),
    conf = require('../wct.conf.json');

module.exports = (gulp, $) => {
    let babelOrCopy = require('./babel-or-copy')(gulp, $);
    gulp.task('copy-test', () => {
        return babelOrCopy('app/test/**/*.{js,html}', { base: 'app/test/' })
            .pipe(gulp.dest('www/test'));
    });

    gulp.task('wct', ['copy-test'], (next) => {
        wct.cli.run(conf, [], process.stdout).then(_ => {
            next();
            // Force process exit to kill resilient browsers
            process.exit();
        }).catch(e => {
            next(e);
            process.exit(1);
        });
    });
};
