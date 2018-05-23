let MARGIN = 10,
    MIN_WIDTH = 15,
    SPACE_LIMIT = 100,
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
    ];

class BlockAnimation {
    constructor (targetEl) {
        this.targetEl = targetEl;
        this.current = {
            line: 0,
            block: 0
        };
        this.colour = 0;
        this.blockCache = [];
        this.state = [];
        this.space = SPACE_LIMIT;
    }

    cancel () {
        clearTimeout(this.timeoutId);
        while (this.targetEl.firstChild) {
            this.targetEl.removeChild(this.targetEl.firstChild);
        }
    }

    setBlockStyle (block, conf) {
        if (conf.width) {
            block.style.width = conf.width;
        }

        if (conf.colour) {
            block.style.backgroundColor = conf.colour;
        }
    }

    newLine() {
        let stateLine = [],
            c;

        this.current.line++;
        this.current.block = 0;
        if (this.current.line > LINES - 1) {
            this.current.line = LINES - 1;
            this.state.shift();
            for (c = 0; c < BLOCKS_PER_LINE; c++) {
                stateLine.push(DEFAULT_CONF);
            }
            this.state.push(stateLine);
            this.rerender();
        }
    }

    animationStep() {
        let w;

        if (this.space < MARGIN + MIN_WIDTH || this.current.block > 4) {
            this.space = SPACE_LIMIT;
            this.newLine();
        }

        w = Math.random() * (this.space - MARGIN - MIN_WIDTH) + MIN_WIDTH;
        if (w > SPACE_LIMIT * 0.75) {
            w = w * (Math.random() * 0.25 + 0.5);
        }
        w = Math.floor(w);

        this.space -= w;
        this.space -= MARGIN;

        this.state[this.current.line][this.current.block] = {
            width: w + 'px',
            colour: COLOURS[this.colour]
        };
        this.setBlockStyle(
            this.blockCache[this.current.line][this.current.block],
            this.state[this.current.line][this.current.block]
        );
        this.blockCache[this.current.line][this.current.block].className = 'block last';

        this.colour = (this.colour + 1) % COLOURS.length;
        this.current.block++;
    }

    loop() {
        let to = Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN;

        this.animationStep();
        this.timeoutId = setTimeout(this.loop.bind(this), to);
    }

    init () {
        let root = this.targetEl,
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
                this.setBlockStyle(block, DEFAULT_CONF);
                block.className = 'block last';

                blockCacheLine.push(block);
                line.appendChild(block);
                stateLine.push(DEFAULT_CONF);
            }
            this.state.push(stateLine);
            this.blockCache.push(blockCacheLine);
        }

        for (s = 0; s < PREFILLED_BLOCKS; s++) {
            this.animationStep();
        }

        this.loop();
    }

    rerender () {
        let block, l, c;
        for (l = 0; l < LINES; l++) {
            for (c = 0; c < BLOCKS_PER_LINE; c++) {
                block = this.blockCache[l][c];
                if (block.className !== 'block') {
                    block.className = 'block';
                }
                this.setBlockStyle(block, this.state[l][c]);
            }
        }
    }
}

export { BlockAnimation };
