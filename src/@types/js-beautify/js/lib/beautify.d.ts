declare module 'js-beautify/js/lib/beautify.js' {
    interface IJsBeautifyOptions {
        indent_size : number;
    }
    global {
        interface Window {
            js_beautify(src : string, opts : IJsBeautifyOptions) : string;
        }
    }
}