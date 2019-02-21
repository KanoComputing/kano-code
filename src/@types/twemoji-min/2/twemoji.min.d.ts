declare module 'twemoji-min/2/twemoji.min.js' {
    global {
        interface Window {
            twemoji : {
                parse(input : string) : string;
            };
        }
    }
}