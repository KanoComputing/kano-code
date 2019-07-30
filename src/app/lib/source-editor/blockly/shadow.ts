import { MetaParameter } from '../../meta-api/module';

export function resolveLegacyShadowTree(value : string|{ shadow : string }) {
    switch (typeof value) {
        case 'number': {
            return `<shadow type="math_number"><field name="NUM">${value}</field></shadow>`;
        }
        case 'string': {
            // Check if it is a color
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                return `<shadow type="colour_picker"><field name="COLOUR">${value}</field></shadow>`;
            } else {
                return `<shadow type="text"><field name="TEXT">${value}</field></shadow>`;
            }
        }
        case 'object': {
            if (value.shadow) {
                return value.shadow;
            }
            break;
        }
        case 'boolean': {
            return `<shadow type="logic_boolean"><field name="BOOL">${value ? 'TRUE' : 'FALSE'}</field></shadow>`;
        }
        default: {
            break;
        }
    }
}

export function resolveShadowTree(param : MetaParameter) {
    if (param.def.blockly && (param.def.blockly.field || param.def.blockly.customField)) {
        return null;
    }
    switch(param.getReturnType()) {
        case Number: {
            return `<shadow type="math_number"><field name="NUM">${param.def.default.toString()}</field></shadow>`
        }
        case String: {
            return `<shadow type="text"><field name="TEXT">${param.def.default}</field></shadow>`;
        }
        case 'Color': {
            return `<shadow type="colour_picker"><field name="COLOUR">${param.def.default}</field></shadow>`;
        }
    }
}
