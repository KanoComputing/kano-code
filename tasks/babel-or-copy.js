'use strict';
module.exports = (gulp, $) => {

   function hasExt(ext) {
       return (file) => {
           return file.relative.split('.').pop() === ext;
       }
   }

   /**
    * Skip babel if the target env is ES6 capable
    */
   function babelOrCopy(src, opts) {
       let stream = gulp.src(src, opts);
       if (!process.env.ES6) {
           stream = stream
               .pipe($.vulcanize())
               .pipe($.if(hasExt('html'), $.crisper({ scriptInHead: false })))
               .pipe($.if(hasExt('js'), $.babel({ presets: ['es2015'], sourceMaps: $.debug ? 'inline' : false })));
       }
       return stream;
   }
   return babelOrCopy;
};
