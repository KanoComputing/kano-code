export const generate = {
    string(length : number = 20) {
        let str = '';
        const min = 0;
        const max = 62;
        for(let i = 0; i < length; i += 1){
            let r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r+=r>9?r<36?55:61:48);
        }
        return str;
    },
    rgb() {
        return [generate.number(0, 255), generate.number(0, 255), generate.number(0, 255)];
    },
    number(min : number = 0, max : number = 512) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rgbString() {
        return `rgb(${generate.rgb().join(', ')})`;
    }
};
