'use strict';
module.exports = (gulp, $) => {
    let bundler = $.browserify('app/scripts/parts/index.js', { standalone: 'Kano.MakeApps.Parts' });

    function bundle(target, refresh) {
        return () => {
            let stream = bundler
                .bundle()
                .on('error', $.utils.notifyError)
                .pipe($.source('index.js'))
                .pipe(gulp.dest(target));
            if (refresh) {
                stream = stream.pipe($.browserSync.stream());
            }
            return stream;
        };
    }

    gulp.task('parts-module-dev', bundle('www/scripts/parts', true));
    gulp.task('parts-module', bundle('.tmp/app/scripts/parts'));

    gulp.task('parts-module-watch', () => {
        bundler = bundler.plugin($.watchify).on('update', bundle('www/scripts/parts', true));
        bundle('www/scripts/parts', true)();
    });
};
