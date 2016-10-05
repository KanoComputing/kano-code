'use strict';
module.exports = (gulp, $) => {
    let canvasApi = gulp.src('app/assets/vendor/kano-canvas-api/**/*');

    gulp.task('kano-canvas-api-dev', () => {
        canvasApi.pipe(gulp.dest('www/assets/vendor/kano-canvas-api'));
    });
    gulp.task('kano-canvas-api', () => {
        return canvasApi.pipe(gulp.dest('.tmp/app/assets/vendor/kano-canvas-api'));
    });
};
