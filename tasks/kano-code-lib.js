"use strict";

var rename = require('gulp-rename');

module.exports = (gulp, $) => {

    /**
     * No need to babelify here, this code will be sent to a node environment
     */
    gulp.task('kano-code-lib', () => {
        let stream = gulp.src('app/scripts/kano/make-apps/parts-api/index.html', { base: 'app' })
            .pipe($.vulcanize())
            .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
            .pipe($.if('*.js', $.transpile()))
            .pipe(rename('scripts/kano-code-lib.js'))
            .pipe($.if('*.js', gulp.dest('www')));
        return stream;
    });
};
