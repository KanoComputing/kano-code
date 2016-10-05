/* jshint node:true */
'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: false }),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    es = require('event-stream'),
    htmlAutoprefixer = require("html-autoprefixer"),
    browserSync = require('browser-sync').create(),
    historyApiFallback = require('connect-history-api-fallback'),
    runSequence = require('run-sequence'),
    configs = require('./config.json'),
    env = process.env.NODE_ENV || 'development',
    target = process.env.TARGET || 'web',
    config = Object.assign(configs.COMMON, configs.TARGET[target], configs.ENV[env], { ENV: env,  TARGET: target }),
    utils;

utils = {
    notifyError: $.notify.onError((error) => {
        $.util.beep();
        return error.message || error;
    }),
    notifyUpdate (message) {
        return $.util.log($.util.colors.blue(message));
    },
    // Wrap vulcanize to automatically add error reporting
    vulcanize (options) {
        return $.vulcanize(options)
            .on('error', utils.notifyError);
    },
    /*
     * gulp-html-autoprefixer points to an outdated version.
     * Putting this here until they fix it.
     */
    htmlAutoprefixerStream () {
        return es.map(function (file, done) {
            let htmlString = file.contents.toString(),
                prefixed = htmlAutoprefixer.process(htmlString);
            file.contents = new Buffer(prefixed);

            next();

            function next(err) {
                done(err, file);
            }
        });
    },
    getEnvVars () {
        let code = '';

        code += `window.Kano = window.Kano || {};`;
        code += `window.Kano.MakeApps = window.Kano.MakeApps || {};`;
        code += `window.Kano.MakeApps.config = ${JSON.stringify(config)};`;

        return code;
    },
    isEnv (env) {
        return process.env.NODE_ENV === env;
    },
    getHtmlReplaceOptions () {

        let mapping = {
            config: `<script type="text/javascript">
                    ${utils.getEnvVars()}
                </script>`,
            base: `<base href="/" />`,
            meta: {
                src: config.DEFAULT_META_DATA,
                tpl: '<meta name="%s" content="%s">'
            }
        };

        if (process.env.TARGET === 'rpi' || process.env.TARGET === 'osonline') {
            mapping.style = `<style>
                .animatable {
                    animation: none !important;
                    transition: none !important;
                }
            </style>`;
        }

        if (process.env.NODE_ENV === 'production') {
            mapping.gtm = `<noscript><iframe src='//www.googletagmanager.com/ns.html?id=GTM-WMGKFR' height='0' width='0' style='display: none; visibility: hidden;'></iframe></noscript>
            <script>window.addEventListener('load',function(){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WMGKFR')});</script>`;
        }

        return mapping;
    }
};

$.browserify = browserify;
$.babelify = babelify;
$.utils = utils;
$.source = source;
$.watchify = watchify;
$.runSequence = runSequence;
$.browserSync = browserSync;
$.historyApiFallback = historyApiFallback;
$.debug = env === 'development' || process.env.DEBUG;

gulp.task('serve', () => {
    return $.browserSync.init({
        server: {
            baseDir: './www',
            middleware: [$.historyApiFallback()]
        },
        port: 4000,
        open: false,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        }
    });
});

// Copy the webcomponents polyfill to the vendor folder
gulp.task('polyfill', () => {
    return gulp.src('app/bower_components/webcomponentsjs/webcomponents-lite.min.js')
        .pipe(gulp.dest('www/assets/vendor/webcomponentsjs/'));
});

require('./tasks/service-worker')(gulp, $);
require('./tasks/workers')(gulp, $);
require('./tasks/parts-api')(gulp, $);
require('./tasks/app-modules')(gulp, $);
require('./tasks/parts-module')(gulp, $);
require('./tasks/app')(gulp, $);
require('./tasks/kano-canvas-api')(gulp, $);
require('./tasks/dev')(gulp, $);
require('./tasks/build')(gulp, $);
require('./tasks/test')(gulp, $);
require('./tasks/doc')(gulp, $);
