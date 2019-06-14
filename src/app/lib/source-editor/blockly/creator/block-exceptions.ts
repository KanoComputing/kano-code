
// Hardcoded legacy block name conversions

export interface IExceptionMapItem {
    category?: string;
    blocks: Map<string, string>;
}

export const blockExceptions = new Map<string, IExceptionMapItem>([
    ['app', {
        blocks: new Map<string, string>([['app_onStart', 'onStart']]),
    }],
    ['draw', {
        category: 'ctx',
        blocks: new Map<string, string>(),
    }],
]);