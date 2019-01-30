// @polymerBehavior
export const AppEditorBehavior = {
    notifyChange (type, data={}) {
        data.type = type;
        this.fire('change', data);
    }
};
