export const labelMap = new Map();

export const setupFieldProxy = (Blockly) => {
    const OriginalFieldDropdown = Blockly.FieldDropdown;

    Blockly.FieldDropdown = class FieldDropdownLabels extends OriginalFieldDropdown {
        constructor(options, ...args) {
            super(options, ...args);
            if (typeof options !== 'function') {
                options.forEach((opt) => {
                    labelMap.set(opt[1], opt[0]);
                });
            }
        }
    };
};


export default labelMap;

