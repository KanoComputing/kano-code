module.exports = function () {
    this.World = require('../support/world').World;

    this.Then(/^(the )?(.+) should (not )?be visible$/, function (arg0, arg1, arg2) {
        return this.getEditorElement(arg1)
            .then((dialog) => {
                if (arg2) {
                    return this.ensureElementIsNotVisible(dialog);
                } else {
                    return this.waitForElementToBeVisible(dialog);
                }
            });
    });

    this.Then(/^the part should (not )?exist$/, function (arg1) {
        let partId = this.store.addedPartId;
        if (!partId) {
            return Promise.reject('Could not retrieve added part');
        }
        return this.getEditorElement()
            .then(editor => {
                if (arg1) {
                    return this.ensurePartDoesNotExist(editor, partId);
                } else {
                    return this.ensurePartExists(editor, partId);
                }
            });
    });

};
