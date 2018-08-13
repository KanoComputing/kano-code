/* jshint node:true */

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: false });
const source = require('vinyl-source-stream');
const es = require('event-stream');
const htmlAutoprefixer = require('html-autoprefixer');
const validateChallenges = require('./tasks/validate-challenges-locales');
const runSequence = require('run-sequence');
const { version } = require('./package.json');

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';
let utils;

const DEFAULT_META_DATA = [
    ['og:title', 'Kano Code'],
    ['og:description', 'Make real apps, real fast'],
    ['og:site-name', 'Kano Code'],
    ['og:url', 'https://apps.kano.me/'],
    ['og:image', ''],
    ['twitter:card', 'summary_large_image'],
    ['twitter:site', '@teamkano'],
    ['theme-color', '#ff842a'],
];

utils = {
    notifyError: $.notify.onError((error) => {
        $.util.beep();
        return error.message || error;
    }),
    notifyUpdate(message) {
        return $.util.log($.util.colors.blue(message));
    },
    // Wrap vulcanize to automatically add error reporting
    vulcanize(options) {
        return $.vulcanize(options)
            .on('error', utils.notifyError);
    },
    /*
     * gulp-html-autoprefixer points to an outdated version.
     * Putting this here until they fix it.
     */
    htmlAutoprefixerStream() {
        return es.map((file, done) => {
            let htmlString = file.contents.toString(),
                prefixed = htmlAutoprefixer.process(htmlString);
            file.contents = new Buffer(prefixed);

            next();

            function next(err) {
                done(err, file);
            }
        });
    },
    getEnvVars() {
        let code = '';

        code += 'window.Kano = {};';
        code += 'window.Kano.MakeApps = {};';
        code += 'window.Kano.MakeApps.config = {};';
        code += `window.Kano.MakeApps.config.ENV = '${env}';`;
        code += `window.Kano.MakeApps.config.TARGET = '${target}';`;
        code += `window.Kano.MakeApps.config.VERSION = '${version}';`;
        code += 'window.AudioContext = window.AudioContext || window.webkitAudioContext;';

        return code;
    },
    isEnv(env) {
        return process.env.NODE_ENV === env;
    },
    getHtmlReplaceOptions() {
        const mapping = {
            env: `<script type="text/javascript">
                    ${utils.getEnvVars()}
                </script>`,
            config: `<link rel="import" href="./${env}.html">
                <link rel="import" href="./${target}.html">`,
            base: '<base href="/" />',
            meta: {
                src: DEFAULT_META_DATA,
                tpl: '<meta name="%s" content="%s">',
            },
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
    },
};

$.pump = require('pump');

$.utils = utils;
$.source = source;
$.runSequence = runSequence;
$.debug = env === 'development' || process.env.DEBUG;

$.transpile = () => $.babel({
    presets: [
        ['env', {
            targets: {
                browsers: ['last 2 versions'],
            },
            modules: false,
        }],
    ],
    sourceMaps: $.debug ? 'inline' : false,
});

// Copy the webcomponents polyfill to the vendor folder
gulp.task('polyfill', () => gulp.src('app/bower_components/webcomponentsjs/webcomponents-lite.min.js')
    .pipe(gulp.dest('www/assets/vendor/webcomponentsjs/')));

gulp.task('validate-challenges', () => validateChallenges.validateChallenges(true));

gulp.task('build-engine', () => gulp.src([
    'app/elements/**/*',
    'app/lib/**/*',
    'app/locale/**/*',
    'app/scripts/**/*',
    'app/assets/vendor/**/*',
], { base: './' })
    .pipe(gulp.dest('kc')));

require('./tasks/service-worker')(gulp, $);
require('./tasks/workers')(gulp, $);
require('./tasks/kano-code-lib')(gulp, $);
require('./tasks/build')(gulp, $);
require('./tasks/test')(gulp, $);
require('./tasks/doc')(gulp, $);
require('./tasks/i18n')(gulp, $);
