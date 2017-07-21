module.exports = function () {
    this.World = require('../support/world').World;

    this.When(/^I click on (the )?(.+)$/, function (arg0, arg1) {
        let p;
        if (arg1.endsWith(' of the added part')) {
            let partId = this.store.addedPartId;
            arg1 = arg1.replace(' of the added part', '');
            if (!partId) {
                return Promise.reject('Could not retrieve added part');
            }
            p = this.getEditorElement('Default workspace')
                .then(el => {
                    let selector = `.part-list #part-${partId}`;
                    switch (arg1.toLowerCase()) {
                        case 'remove button':
                            selector += ' .remove';
                            break;
                        default:
                            break;
                    }
                    return this.findElement(el, [selector]);
                });
        } else if (arg1.endsWith(' in the remove part dialog')) {
            let selector = '[dialog-confirm]';
            arg1 = arg1.replace(' in the remove part dialog', '');

            if (arg1 === 'Cancel') {
                selector = '[dialog-dismiss]';
            }

            p = this.getEditorElement('Confirm part deletion dialog')
                .then(dialog => this.findElement(dialog, [selector]));
        } else if (arg1.endsWith(' in the Add Parts Dialog')) {
            arg1 = arg1.replace(' in the Add Parts Dialog', '');
            return this.getEditorElement('Add Parts Dialog')
                // Ensure animations finished
                .then(dialog => {
                    return this.wait(500).then(() => dialog);
                })
                .then(dialog => {
                    if (arg1 === 'a part') {
                        return this.addPart(dialog)
                            .then(partId => this.store.addedPartId = partId);
                    } else if (arg1 === 'done') {
                        return this.getEditorElement('done in add parts dialog')
                            .then(button => button.click());
                    }
                });
        } else {
            p = this.getEditorElement(arg1);
        }
        return p.then(el => el.click());
    });
};
