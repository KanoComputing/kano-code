/* jshint node:true */
'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: false }),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    del = require('del'),
    auth = require('basic-auth'),
    path = require('path'),
    fs = require('fs'),
    config = require('./app/scripts/config'),
    bundler,
    utils;

bundler = browserify('app/scripts/app.js', watchify.args)
        .transform(babelify.configure({ presets: ['es2015'] }));

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
    bundle () {
        utils.notifyUpdate('Browserify: compiling JS...');
        return bundler.bundle()
            .on('error', utils.notifyError)
            .pipe(source('app.js'))
            .pipe(gulp.dest('.tmp/app/scripts'));
    },
    getConfig () {
        let env = process.env.NODE_ENV || 'development',
            target = process.env.TARGET || 'web';

        return Object.assign(config.common, config.target[target],
               config.env[env], {"ENV": env, "TARGET": target});
    }
};

gulp.task('bundle', utils.bundle);

gulp.task('serve', () => {
    return $.connect.server({
        root: 'www',
        port: 4000,
        fallback: './www/index.html',
        livereload: true
    });
});

gulp.task('serve-prod', () => {
    return $.connect.server({
        root: 'www',
        port: process.env.PORT,
        fallback: './www/index.html'
    });
});

// For a build with cordova, add this to html replace
// <meta http-equiv="Content-Security-Policy" content="media-src *">
gulp.task('js', ['babel', 'bundle', 'dom-util'], () => {
    gulp.src('./.tmp/app/index.html')
        .pipe(utils.vulcanize({ inlineScripts: true }))
        .pipe($.crisper({ scriptInHead: false }))
        .pipe($.htmlReplace({ base: `
            <base href="/" target="_blank">
            `,
            config: `
            <script type="text/javascript">
                window.config = ${JSON.stringify(utils.getConfig())};
            </script>
            `
         }))
        .pipe($.connect.reload())
        .pipe(gulp.dest('www'));
});

gulp.task('babel', ['copy'], () => {
    return gulp.src('app/elements/**/*.{js,html}')
        .pipe($.if('*.html', $.crisper({ scriptInHead: false })))
        .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('.tmp/app/elements'));
});

gulp.task('copy', () => {
    return gulp.src([
            'app/index.html',
            'app/bower_components/**/*',
            'app/assets/vendor/google-blockly/blockly_compressed.js',
            'app/assets/vendor/google-blockly/blocks_compressed.js',
            'app/assets/vendor/google-blockly/javascript_compressed.js',
            'app/assets/vendor/google-blockly/msg/js/en.js'
        ], { base: 'app'})
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('assets', ['scenes'], () => {
    gulp.src([
        'app/assets/**/*',
        'app/manifest.json',
        '!app/assets/stories/**/*.{js,html}'
    ], { base: 'app' })
        .pipe(gulp.dest('www'));
});

gulp.task('views', () => {
    // Get the elements common to the whole app to exclude them from the views
    getImports('./app/elements/elements.html').then((common) => {
        return gulp.src('app/views/**/*.html')
            .pipe(utils.vulcanize({
                inlineScripts: true,
                stripExcludes: common
            }))
            .pipe($.crisper({ scriptInHead: false }))
            .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
            .pipe(gulp.dest('www/views'));
    }).catch(utils.notifyError);
});

gulp.task('scenes', () => {
    gulp.src('app/assets/stories/**/*.html')
        .pipe(utils.vulcanize({ inlineScripts: true }))
        .pipe($.crisper({ scriptInHead: false }))
        .pipe($.if('*.js', $.babel({ presets: ['es2015'] })))
        .pipe(gulp.dest('www/assets/stories'));
});

gulp.task('watch', () => {
    let watchers = [
        gulp.watch(['./app/index.html','./app/**/*.{js,html,css}'], ['js']),
        gulp.watch(['./app/views/**/*'], ['views']),
        gulp.watch(['./app/style/**/*'], ['sass']),
        gulp.watch(['./app/assets/stories/**/*'], ['assets'])
    ];
    watchers.forEach((watcher) => {
        watcher.on('change', function (event) {
            utils.notifyUpdate('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });
    bundler = watchify(bundler).on('update', utils.bundle);
});

gulp.task('sass', () => {
    gulp.src('app/style/**/*.sass')
        .pipe($.sass({ includePaths: 'app/bower_components' }).on('error', utils.notifyError))
        .pipe(gulp.dest('www/css'));
});

function getImports(filePath, opts) {
    let found = [];
    opts = opts || {};

    function crawlImports(filePath) {
        return new Promise((resolve, reject) => {
            let dir = path.dirname(filePath);
            fs.readFile(filePath, (err, file) => {
                if (err) {
                    return resolve();
                }
                found.push(filePath);
                let content = file.toString(),
                importRegex = /<link.*rel="import".*>/gi,
                imports = content.match(importRegex),
                fileRegex,
                files,
                tasks;
                if (!imports) {
                    return resolve();
                }
                fileRegex = /href="(.*)"/,
                files = imports.map((importLine) => {
                    let m = importLine.match(fileRegex);
                    if (m && m[1]) {
                        return path.join(dir, m[1]);
                    }
                    return null;
                }).filter((f) => {
                    if (!f) {
                        return false;
                    }
                    if (found.indexOf(f) === -1) {
                        return true;
                    }
                });
                tasks = files.map((f) => {
                    return crawlImports(f);
                });
                return Promise.all(tasks).then(() => {
                    return resolve(found);
                }).catch(reject);
            });
        });
    }
    return crawlImports(filePath).then((files) => {
        files = files.filter((item, pos, self) => {
            return self.indexOf(item) == pos;
        });
        if (opts.base) {
            files = files.map((filePath) => {
                return path.relative(opts.base, filePath);
            });
        }
        return files;
    });
}

let DOMUtilBundler = browserify('app/scripts/util/dom.js', { standalone: 'DOMUtil' })
                        .transform(babelify.configure({ presets: ['es2015'] }));

gulp.task('dom-util', () => {
    DOMUtilBundler.bundle()
        .on('error', utils.notifyError)
        .pipe(source('dom.js'))
        .pipe(gulp.dest('.tmp/app/scripts/util/'));
});

gulp.task('dev', ['watch', 'serve']);

gulp.task('default', ['build']);
gulp.task('build', ['views', 'js', 'sass', 'assets']);
gulp.task('prod', ['build']);
