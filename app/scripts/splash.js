/* To be able to cancel the timeout from outside the module */
var splashTimeoutId;

(function () {
    var MARGIN = 10,
        MIN_WIDTH = 15,
        SPACE_LIMIT = 120,
        DELAY_MIN = 100,
        DELAY_MAX = 400,
        LINES = 7,
        BLOCKS_PER_LINE = 5,
        PREFILLED_BLOCKS = 20,
        DEFAULT_CONF = {
            width: '0px'
        },
        COLOURS = [
            '#3d50b4', '#1f93f3', '#fd9626', '#fc5522',
            '#6638b5', '#1ea8f3', '#fcc02d', '#795348',
            '#9b26ae', '#1fbad1', '#fee839', '#9d9d9d',
            '#e81c62', '#169487', '#ccdb37', '#5f7b88',
            '#f34335', '#4bad50', '#8ac349', '#444444'
        ],
        current = {
            line: 0,
            block: 0
        },
        colour = 0,
        blockCache = [],
        state = [],
        space = SPACE_LIMIT;


    function setBlockStyle(block, conf) {
        if (conf.width) {
            block.style.width = conf.width;
        }

        if (conf.colour) {
            block.style.backgroundColor = conf.colour;
        }
    }

    function newLine() {
        var stateLine = [],
            c;

        current.line++;
        current.block = 0;
        if (current.line > LINES - 1) {
            current.line = LINES - 1;
            state.shift();
            for (c = 0; c < BLOCKS_PER_LINE; c++) {
                stateLine.push(DEFAULT_CONF);
            }
            state.push(stateLine);
            rerender();
        }
    }

    function animationStep() {
        var w;

        if (space < MARGIN + MIN_WIDTH || current.block > 4) {
            space = SPACE_LIMIT;
            newLine();
        }

        w = Math.random() * (space - MARGIN - MIN_WIDTH) + MIN_WIDTH;
        if (w > SPACE_LIMIT * 0.75) {
            w = w * (Math.random() * 0.25 + 0.5);
        }
        w = Math.floor(w);

        space -= w;
        space -= MARGIN;

        state[current.line][current.block] = {
            width: w + 'px',
            colour: COLOURS[colour]
        };
        setBlockStyle(blockCache[current.line][current.block],
                      state[current.line][current.block]);
        blockCache[current.line][current.block].className = 'block last';

        colour = (colour + 1) % COLOURS.length;
        current.block++;
    }

    function loop() {
        var to = Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN;

        animationStep();
        splashTimeoutId = setTimeout(loop, to);
    }

    function init() {
        var root = document.getElementById('blocks'),
            line,
            block,
            l, c, s,
            stateLine,
            blockCacheLine;

        for (l = 0; l < LINES; l++) {
            line = document.createElement('div');
            stateLine = [];
            blockCacheLine = [];
            line.className = 'line';
            root.appendChild(line);

            for (c = 0; c < BLOCKS_PER_LINE; c++) {
                block = document.createElement('div');
                setBlockStyle(block, DEFAULT_CONF);
                block.className = 'block last';

                blockCacheLine.push(block);
                line.appendChild(block);
                stateLine.push(DEFAULT_CONF);
            }
            state.push(stateLine);
            blockCache.push(blockCacheLine);
        }

        for (s = 0; s < PREFILLED_BLOCKS; s++) {
            animationStep();
        }

        loop();
    }

    function rerender() {
        var block, l, c;
        for (l = 0; l < LINES; l++) {
            for (c = 0; c < BLOCKS_PER_LINE; c++) {
                block = blockCache[l][c];
                if (block.className !== 'block') {
                    block.className = 'block';
                }
                setBlockStyle(block, state[l][c]);
            }
        }
    }


    init();
})();
