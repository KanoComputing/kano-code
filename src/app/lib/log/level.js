const LEVEL = {
    TRACE: 0,
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
    OFF: -1,
};

const LEVEL_NAMES = {
    [LEVEL.TRACE]: 'TRACE',
    [LEVEL.DEBUG]: 'DEBUG',
    [LEVEL.INFO]: 'INFO',
    [LEVEL.WARN]: 'WARN',
    [LEVEL.ERROR]: 'ERROR',
    [LEVEL.OFF]: 'OFF',
};

const LEVEL_STYLES = {
    [LEVEL.TRACE]: 'color: lightgrey',
    [LEVEL.DEBUG]: 'color: green',
    [LEVEL.INFO]: 'color: cyan',
    [LEVEL.WARN]: 'color: orange',
    [LEVEL.ERROR]: 'color: red',
    [LEVEL.OFF]: 'color: transparent',
};

export default LEVEL;
export { LEVEL, LEVEL_NAMES, LEVEL_STYLES };
