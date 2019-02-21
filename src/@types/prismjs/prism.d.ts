declare module 'prismjs/prism.js' {
    global {
        interface PrismLanguage {}
        interface Window {
            Prism : {
                languages : {
                    [K : string] : PrismLanguage;
                }
                highlight(cod : string, language : PrismLanguage) : string;
            }
        }
    }
}