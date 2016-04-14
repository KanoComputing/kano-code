function hexToRGB(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

window.Kano = window.Kano || {};

window.Kano.patterns = [{
    generator (args) {
        return `linear-gradient(${args.backgroundColor}, ${args.backgroundColor})`;
    },
    backgroundColor: '#70c222'
},{
    generator (args) {
        return `linear-gradient(rgba(255, 255, 255, .2) 50%, transparent 50%, transparent) 0px 0px/${args.size} ${args.size}`;
    },
    size: '50px',
    backgroundColor: '#0ae'
},{
    generator (args) {
        return `linear-gradient(90deg, rgba(255, 255, 255, .2) 50%, transparent 50%, transparent) 0px 0px/${args.size} ${args.size}`;
    },
    size: '50px',
    backgroundColor: '#f90'
},{
    generator (args) {
        let rgb = hexToRGB(args.color),
            rgbString;
        if (!rgb) {
            return '';
        }
        rgbString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.g}, 0.5)`;
        return `linear-gradient(transparent 50%, ${rgbString} 50%, ${rgbString}) 0 0/${args.size} ${args.size},
                  linear-gradient(90deg, transparent 50%, ${rgbString} 50%, ${rgbString}) 0 0/${args.size} ${args.size}`;
    },
    color: '#c80000',
    size: '50px',
    backgroundColor: 'white'
},{
    generator (args) {
        return `linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%,
                              transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%,
                              transparent 75%, transparent) 0 0/${args.size} ${args.size}`;
    },
    size: '50px',
    backgroundColor: '#ac0'
},{
    generator (args) {
        return `linear-gradient(135deg, rgba(255, 255, 255, .2) 25%, transparent 25%,
                              transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%,
                              transparent 75%, transparent) 0 0/${args.size} ${args.size}`;
    },
    size: '50px',
    backgroundColor: '#c16'
},{
    generator (args) {
        return `linear-gradient(45deg, ${args.color} 25%, transparent 25%, transparent 75%, ${args.color} 75%, ${args.color}) 0 0/${args.size} ${args.size},
                linear-gradient(45deg, ${args.color} 25%, transparent 25%, transparent 75%, ${args.color} 75%, ${args.color}) calc(${args.size} / 2) calc(${args.size} / 2)/${args.size} ${args.size}`;
    },
    color: 'black',
    size: '50px',
    backgroundColor: 'white'
},{
    generator (args) {
        return `linear-gradient(324deg, ${args.backgroundColor} 4%,   transparent 4%)    -70px 43px/100px 100px,
                linear-gradient( 36deg, ${args.backgroundColor} 4%,   transparent 4%)    30px 43px/100px 100px,
                linear-gradient( 72deg, ${args.color} 8.5%, transparent 8.5%)  30px 43px/100px 100px,
                linear-gradient(288deg, ${args.color} 8.5%, transparent 8.5%)  -70px 43px/100px 100px,
                linear-gradient(216deg, ${args.color} 7.5%, transparent 7.5%)  -70px 23px/100px 100px,
                linear-gradient(144deg, ${args.color} 7.5%, transparent 7.5%)  30px 23px/100px 100px,
                linear-gradient(324deg, ${args.backgroundColor} 4%,   transparent 4%)    -20px 93px/100px 100px,
                linear-gradient( 36deg, ${args.backgroundColor} 4%,   transparent 4%)    80px 93px/100px 100px,
                linear-gradient( 72deg, ${args.color} 8.5%, transparent 8.5%)  80px 93px/100px 100px,
                linear-gradient(288deg, ${args.color} 8.5%, transparent 8.5%)  -20px 93px/100px 100px,
                linear-gradient(216deg, ${args.color} 7.5%, transparent 7.5%)  -20px 73px/100px 100px,
                linear-gradient(144deg, ${args.color} 7.5%, transparent 7.5%)  80px 73px/100px 100px`;
    },
    color: '#e3d7bf',
    backgroundColor: '#232927'
},{
    generator () {
        return `linear-gradient(90deg, rgba(255,255,255,.07) 50%, transparent 50%) 0 0/13px 13px,
                  linear-gradient(90deg, rgba(255,255,255,.13) 50%, transparent 50%) 0 0/29px 29px,
                  linear-gradient(90deg, transparent 50%, rgba(255,255,255,.17) 50%) 0 0/37px 37px,
                  linear-gradient(90deg, transparent 50%, rgba(255,255,255,.19) 50%) 0 0/53px 53px`;
    },
    backgroundColor: '#026873'
},{
    generator () {
        return `radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 9%, hsla(0, 100%, 20%, 0) 9%) 0 0/100px 100px,
                radial-gradient(hsl(0, 100%, 27%) 4%, hsl(0, 100%, 18%) 8%, hsla(0, 100%, 20%, 0) 10%) 50px 50px/100px 100px,
                radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 50px 0/100px 100px,
                radial-gradient(hsla(0, 100%, 30%, 0.8) 20%, hsla(0, 100%, 20%, 0)) 0 50px/100px 100px,
                radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 50px 0/100px 100px,
                radial-gradient(hsla(0, 100%, 20%, 1) 35%, hsla(0, 100%, 20%, 0) 60%) 100px 50px/100px 100px,
                radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 0 0/100px 100px,
                radial-gradient(hsla(0, 100%, 15%, 0.7), hsla(0, 100%, 20%, 0)) 50px 50px/100px 100px,
                linear-gradient(45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0/100px 100px,
                linear-gradient(-45deg, hsla(0, 100%, 20%, 0) 49%, hsla(0, 100%, 0%, 1) 50%, hsla(0, 100%, 20%, 0) 70%) 0 0/100px 100px`;
    }
},{
    generator () {
        return `repeating-linear-gradient(120deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px) 0 0/70px 120px,
                repeating-linear-gradient(60deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px) 0 0/70px 120px,
                linear-gradient(60deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)) 0 0/70px 120px,
                linear-gradient(120deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)) 0 0/70px 120px`;
    },
    backgroundColor: '#6d695c'
}];
