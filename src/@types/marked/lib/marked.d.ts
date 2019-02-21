declare module 'marked/lib/marked.js' {
    global {
        interface Window {
            marked(src : string) : string;
        }
    }
}

