'use strict';
var swPrecache = require('sw-precache'),
    packageJson = require('../package.json'),
    stream = require('stream');

module.exports = (gulp, $) => {
    const MANIFEST_NAME = 'make-apps.manifest',
          APP_ROUTES = ['/make'],
          // Cache everything except the assets folder. but include the svg files as they are quite small
          STATIC_FILE_GLOB = [
              'www/*',
              'www/css/*',
              'www/elements/**/*',
              'www/scripts/**/*',
              'www/views/**/*',
              'www/assets/**/*.svg'
          ];
    function writeServiceWorker(handleFetch, callback) {
        let config = {
            cacheId: packageJson.name,
            logger: $.utils.notifyUpdate,
            staticFileGlobs: STATIC_FILE_GLOB,
            stripPrefix: 'www',
            navigateFallback: '/index.html',
            handleFetch,
            // Max 3Mb
            maximumFileSizeToCacheInBytes: 3145728,
            runtimeCaching: [{
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/css/,
                handler: 'cacheFirst'
            },{
                urlPattern: /assets/,
                handler: 'cacheFirst'
            }]
        };
        swPrecache.write('www/sw.js', config, callback);
    }

    function iframeTemplate(opts) {
        return `<html manifest="${opts.manifest}"><head></head><body></body></html>`;
    }

    function generateAppcacheIframe(manifest) {
        var src = stream.Readable({ objectMode: true });
        src._read = function () {
            this.push(new $.util.File({ cwd: '', base: '', path: 'appcache.html', contents: new Buffer(iframeTemplate({ manifest })) }));
            this.push(null);
        };
        return src;
    }

    function generateAppcacheManifest(manifest, handleFetch) {
        var src = handleFetch ? STATIC_FILE_GLOB : [];
        return gulp.src(src, { base: 'www' })
            .pipe($.manifest({
                hash: true,
                nextwork: ['*'],
                filename: manifest,
                exclude: manifest,
                fallback: APP_ROUTES.map((route) => `${route} /`)
            }));
    }

    gulp.task('sw', ['appcache'], (cb) => {
        writeServiceWorker(true, cb);
    });
    gulp.task('sw-dev', ['appcache-dev'], (cb) => {
        writeServiceWorker(false, cb);
    });

    gulp.task('appcache-iframe', () => {
        return generateAppcacheIframe(MANIFEST_NAME)
            .pipe(gulp.dest('www'));
    });

    gulp.task('appcache', ['appcache-iframe'], () => {
        generateAppcacheManifest(MANIFEST_NAME, true).pipe(gulp.dest('www'));
    });

    gulp.task('appcache-dev', ['appcache-iframe'], () => {
        generateAppcacheManifest(MANIFEST_NAME, false).pipe(gulp.dest('www'));
    });
};
