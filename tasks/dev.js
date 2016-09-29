'use strict';

module.exports = (gulp, $) => {
    let babelOrCopy = require('./babel-or-copy')(gulp, $),
        watchMap = {};

    function copy(src) {
        return () => {
            return gulp.src(src, { base: 'app'})
                .pipe(gulp.dest('www'));
        };
    }

    function elements(src) {
        return () => {
            return babelOrCopy(src, { base: 'app/elements/' })
                .pipe(gulp.dest('www/elements'))
                .pipe($.browserSync.stream());
        };
    }

    function scenes(src) {
        return () => {
            return babelOrCopy(src)
            .pipe(gulp.dest('www/assets/stories'))
            .pipe($.browserSync.stream());
        };
    }

    function views(src) {
        return () => {
            return babelOrCopy(src, { base: 'app/views/' })
            .pipe(gulp.dest('www/views'))
            .pipe($.browserSync.stream());
        };
    }

    function styles(src) {
        return () => {
            return gulp.src(src)
            .pipe($.concat('main.css'))
            .pipe($.autoprefixer())
            .pipe(gulp.dest('www/css'))
            .pipe($.browserSync.stream());
        };
    }

    function assets(src) {
        return () => {
            return gulp.src(src, { base: 'app' })
            .pipe(gulp.dest('www'))
            .pipe($.browserSync.stream());
        };
    }

    function scripts(src) {
        return () => {
            return gulp.src(src, { base: 'app' })
            .pipe(gulp.dest('www'))
            .pipe($.browserSync.stream());
        };
    }

    watchMap.copy = {
        src: [
            'app/bower_components/**/*',
            'app/assets/vendor/google-blockly/blockly_compressed.js',
            'app/assets/vendor/google-blockly/blocks_compressed.js',
            'app/assets/vendor/google-blockly/javascript_compressed.js',
            'app/assets/vendor/google-blockly/msg/js/en.js',
            'app/assets/vendor/google-blockly/media/**/*',
            'app/assets/vendor/cache-polyfill/cache-polyfill.js',
            'app/scripts/util/dom.js',
            'app/scripts/util/client.js',
            'app/scripts/util/router.js',
            'app/scripts/index.js',
            'app/loading-share.html'
        ],
        process: copy
    };

    watchMap.elements = {
        src: 'app/elements/**/*.{js,html,css}',
        process: elements
    };

    watchMap.scenes = {
        src: 'app/assets/stories/**/*.html',
        process: scenes
    };

    watchMap.views = {
        src: 'app/views/**/*.{js,html,css}',
        process: views
    };

    watchMap.styles = {
        src: 'app/style/*.css',
        process: styles
    };

    watchMap.scripts = {
        src: 'app/scripts/kano/**/*',
        process: scripts
    };

    watchMap.assets = {
        src: [
            'app/assets/**/*',
            'app/assets/**/*',
            'app/manifest.json',
            '!app/assets/stories/**/*.{js,html}',
            '!app/assets/vendor/**/*'
        ],
        process: assets
    };

    gulp.task('elements-dev', ['kano-canvas-api-dev'], elements(watchMap.elements.src));

    gulp.task('scenes-dev', scenes(watchMap.scenes.src));

    gulp.task('views-dev', views(watchMap.views.src));

    gulp.task('style-dev', styles(watchMap.styles.src));

    gulp.task('scripts-dev', scripts(watchMap.scripts.src));

    gulp.task('index-dev', () => {
        return gulp.src('app/index.html')
            .pipe($.htmlReplace($.utils.getHtmlReplaceOptions()))
            .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
            .pipe(gulp.dest('www'));
    });

    gulp.task('copy-dev', ['index-dev', 'polyfill'], copy(watchMap.copy.src));

    gulp.task('assets-dev', ['scenes-dev', 'blockly-media'], assets(watchMap.assets.src));

    gulp.task('watch', ['app-modules-watch', 'parts-module-watch', 'app-watch', 'parts-api-watch', 'workers-watch'], () => {
        Object.keys(watchMap).forEach(key => {
            gulp.watch(watchMap[key].src)
                .on('change', (e) => {
                    $.utils.notifyUpdate(`File ${e.path} was ${e.type}...`);
                    watchMap[key].process(e.path)();
                });
        });
    });

    gulp.task('dev', ['watch', 'serve']);
    gulp.task('build-dev', () => {
        return $.runSequence(['style-dev', 'app-dev', 'elements-dev', 'assets-dev', 'views-dev', 'copy-dev', 'app-modules', 'parts-api', 'parts-module-dev', 'scripts-dev', 'workers'], 'sw-dev');
    });
};
