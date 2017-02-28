/* jshint node:true */
'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: false }),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    es = require('event-stream'),
    htmlAutoprefixer = require("html-autoprefixer"),
    connect = require('connect'),
    livereload = require('livereload'),
    serveStatic = require('serve-static'),
    history = require('connect-history-api-fallback'),
    validateChallenges = require('./tasks/validate-challenges-locales'),
    runSequence = require('run-sequence'),
    env = process.env.NODE_ENV || 'development',
    target = process.env.TARGET || 'web',
    utils;

const DEFAULT_META_DATA = [
    ["og:title", "Kano Code"],
    ["og:description", "Make real apps, real fast"],
    ["og:site-name", "Kano Code"],
    ["og:url", "https://apps.kano.me/"],
    ["og:image", ""],
    ["twitter:card", "summary_large_image"],
    ["twitter:site", "@teamkano"],
    ["theme-color", "#ff842a"]
];

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

        code += 'window.Kano = {};';
        code += 'window.Kano.MakeApps = {};';
        code += 'window.Kano.MakeApps.config = {};';
        code += `window.Kano.MakeApps.config.ENV = '${env}';`;
        code += `window.Kano.MakeApps.config.TARGET = '${target}';`;
        code += 'window.AudioContext = window.AudioContext || window.webkitAudioContext;';

        return code;
    },
    isEnv (env) {
        return process.env.NODE_ENV === env;
    },
    getHtmlReplaceOptions () {

        let mapping = {
            env: `<script type="text/javascript">
                    ${utils.getEnvVars()}
                </script>`,
            config: `<link rel="import" href="./${env}.html">
                <link rel="import" href="./${target}.html">`,
            base: `<base href="/" />`,
            meta: {
                src: DEFAULT_META_DATA,
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

        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
            mapping.gtm = `<noscript><iframe src='//www.googletagmanager.com/ns.html?id=GTM-WMGKFR' height='0' width='0' style='display: none; visibility: hidden;'></iframe></noscript>
            <script>window.addEventListener('load',function(){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WMGKFR')});</script>`;
        }

        return mapping;
    }
};

$.utils = utils;
$.source = source;
$.watchify = watchify;
$.runSequence = runSequence;
$.connect = connect;
$.serveStatic = serveStatic;
$.history = history;
$.debug = env === 'development' || process.env.DEBUG;

$.transpile = () => {
    return $.babel({
        presets: [
            ['env', {
                targets: {
                    browsers: ["last 2 versions"]
                },
                modules: false
            }]
        ],
        sourceMaps: $.debug ? 'inline' : false
    });
};

$.startServer = (lr) => {
    let server = $.connect();
    if (lr) {
        server = server.use(require('connect-livereload')());
    }
    return server.use($.serveStatic(__dirname + '/app'))
        .use($.history())
        .listen(4000);
}

gulp.task('serve', () => {
    return $.startServer();
});

gulp.task('watch', () => {
    $.startServer(true);
    livereload.createServer().watch(__dirname + "/app");
});

// Copy the webcomponents polyfill to the vendor folder
gulp.task('polyfill', () => {
    return gulp.src('app/bower_components/webcomponentsjs/webcomponents-lite.min.js')
        .pipe(gulp.dest('www/assets/vendor/webcomponentsjs/'));
});

gulp.task('validate-challenges', () => {
    return validateChallenges.validateChallenges(true);
});

require('./tasks/service-worker')(gulp, $);
require('./tasks/workers')(gulp, $);
require('./tasks/parts-api')(gulp, $);
require('./tasks/build')(gulp, $);
require('./tasks/test')(gulp, $);
require('./tasks/doc')(gulp, $);
require('./tasks/i18n')(gulp, $);
