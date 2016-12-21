'use strict';

const shards = require('./shards');

module.exports = (gulp, $) => {

    gulp.task('shards', () => {
        return shards.build({
            endpoints: [
                'elements/elements.html',
                'views/kano-view-editor/kano-view-editor.html',
                'views/kano-view-story/kano-view-story.html',
                'views/kano-view-tutorial/kano-view-tutorial.html',
                'views/kano-view-demo/kano-view-demo.html',
                'views/kano-view-flags/kano-view-flags.html',
                'views/kano-view-onboarding/kano-view-onboarding.html'
            ],
            shared_import: 'elements/shared.html',
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
        let needTranspile = ((file.relative.indexOf('bower_components') === -1 &&
            file.relative.indexOf('assets/vendor/') === -1) ||
            file.relative.indexOf('kano-circle-progress') !== -1 ||
            file.relative.indexOf('Sortable') !== -1);
        return needTranspile;
    }

    function notBowerComponentJs(file) {
        let needTranspile = file.relative.split('.').pop() === 'js' && notBowerComponent(file);
        return needTranspile;
    }

    function notBowerComponentHtml(file) {
        let needTranspile = file.relative.split('.').pop() === 'html' && notBowerComponent(file);
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
            .pipe($.if('*.html', $.utils.htmlAutoprefixerStream()))
            .pipe($.if(notBowerComponentJs, $.babel({ presets: ['es2015'] })))
            .pipe(gulp.dest('.tmp/app'));
    });

    gulp.task('split', () => {
        gulp.src('www/**/*.html', { base: 'www' })
            .pipe($.crisper({ scriptInHead: false }))
            .pipe(gulp.dest('www'));
    });

    gulp.task('build', () => {
        return $.runSequence('copy-all',
            ['kano-canvas-api', 'app'],
            'shards',
            'split',
            ['copy-index', 'blockly-media', 'assets', 'workers'],
            'sw',
            'external-play-bundle');
    });

    gulp.task('copy-index', () => {
        return gulp.src(['app/index.html',
                        'app/scripts/index.js',
                        'app/scripts/splash.js',
                        'app/assets/vendor/cache-polyfill/cache-polyfill.js',
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
            .on('error', $.utils.notifyError)
            .pipe(gulp.dest('www'));
    });

    gulp.task('default', ['build']);
};
