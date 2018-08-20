export const getAPI = (part) => {
    const api = {
        type: 'module',
        name: part.id,
        verbose: part.name,
        symbols: [{
            type: 'function',
            aliases: [`${part.id}#ui_move_by`],
            name: 'moveAlong',
            verbose: `${part.name}: Move by`,
            parameters: [{
                name: 'pixels',
                returnType: Number,
                default: 0,
            }],
        }],
    };
    return api;
};

export default getAPI;
