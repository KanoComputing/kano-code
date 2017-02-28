'use strict';

const shards = require('./shards');

module.exports = (gulp, $) => {

    gulp.task('treemap', () => {
        return shards.generateTreeMap({
            shell: 'elements/elements.html',
            root: '.tmp/app',
            dest: 'www'
        });
    });

    gulp.task('shards', () => {
        return shards.build({
            shell: 'elements/elements.html',
            root: '.tmp/app',
            dest: 'www'
        });
    });

    gulp.task('serve-doc', () => {
        return $.connect.server({
            root: 'app',
            port: process.env.PORT || 5000
        });
    });

    gulp.task('serve-prod', () => {
        return $.connect.server({
            root: 'www',
            port: process.env.PORT,
            fallback: './www/index.html'
        });
    });

    function notBowerComponent(file) {
        let needTranspile = ((file.path.indexOf('bower_components') === -1 &&
            file.path.indexOf('assets/vendor/') === -1) ||
            file.path.indexOf('web-components') !== -1 ||
            file.path.indexOf('lazy-imports') !== -1 ||
            file.path.indexOf('Sortable') !== -1) ||
            file.path.indexOf('polymer-sortablejs') !== -1;
        return needTranspile;
    }

    function notBowerComponentJs(file) {
        let needTranspile = file.path.split('.').pop() === 'js' && notBowerComponent(file);
        return needTranspile;
    }

    function isConfig(file) {
        return file.path.indexOf('config.html') !== -1;
    }

    function notBowerComponentHtml(file) {
        let needTranspile = file.path.split('.').pop() === 'html' && notBowerComponent(file);
        return needTranspile;
    }

    gulp.task('external-play-bundle', () => {
        return gulp.src('app/elements/play-bundle.html', { base: 'app' })
            .pipe($.htmlReplace($.utils.getHtmlReplaceOptions()))
            .pipe($.rename('external-play-bundle.html'))
            .pipe(gulp.dest('app/elements'));
    });

    gulp.task('copy-all', () => {
        return gulp.src('app/**/*', { base: 'app' })
            .pipe($.if(notBowerComponentHtml, $.crisper({ scriptInHead: false })))
            .pipe($.if(isConfig, $.htmlReplace($.utils.getHtmlReplaceOptions())))
            .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
            .pipe($.if(notBowerComponentJs, $.transpile()))
            .pipe(gulp.dest('.tmp/app'));
    });

    gulp.task('i18n', () => {
        return gulp.src('.tmp/app/elements/msg/*.html', { base: '.tmp/app' })
            .pipe($.vulcanize({
                inlineScripts: true,
                inlineCss: true,
                stripComments: true
            }))
            .pipe(gulp.dest('www'));
    });

    gulp.task('split', () => {
        gulp.src('www/**/*.html', { base: 'www' })
            .pipe($.crisper({ scriptInHead: false }))
            .pipe(gulp.dest('www'));
    });

    gulp.task('build', (done) => {
        return $.runSequence(
            'copy-all',
            'shards',
            'split',
            ['copy-index', 'blockly-media', 'assets', 'workers', 'i18n'],
            'compress',
            'sw',
            'external-play-bundle', done);
    });

    gulp.task('copy-index', () => {
        return gulp.src(['app/index.html',
                        'app/scripts/index.js',
                        'app/scripts/splash.js',
                        'app/assets/vendor/cache-polyfill/cache-polyfill.js',
                        'app/assets/vendor/object-assign/object-assign.js',
                        'app/bower_components/webcomponentsjs/webcomponents-lite.min.js'
                        ], { base: 'app' })
            .pipe($.if('index.html', $.htmlReplace($.utils.getHtmlReplaceOptions())))
            .pipe($.if('index.html', $.inlineSource()))
            .pipe($.if('index.html', $.utils.htmlAutoprefixerStream()))
            .pipe(gulp.dest('www'));
    });

    gulp.task('blockly-media', () => {
        return gulp.src([
            'app/assets/vendor/google-blockly/media/**/*'
        ], { base: 'app' })
            .pipe(gulp.dest('www'));
    });

    gulp.task('assets', () => {
        return gulp.src([
            'app/assets/**/*',
            'app/manifest.json',
            'app/bower_components/web-components/kano-style/fonts/*',
            '!app/assets/stories/**/*.{js,html}',
            '!app/assets/vendor/**/*'
        ], { base: 'app' })
            .pipe(gulp.dest('www'));
    });

    gulp.task('compress', () => {
        return gulp.src(['www/**/*.{js,html}', '!www/scripts/kano/make-apps/parts-api/parts-api.js'])
            .pipe($.if('*.html', $.htmlmin({
                collapseWhitespace: true,
                minifyCSS: true,
                removeComments: true
            })))
            .pipe($.if('*.js', $.uglify()))
            .on('error', (e) => {
                $.utils.notifyError(e);
                throw e;
            })
            .pipe(gulp.dest('www'));
    });

    gulp.task('default', ['build']);
};
