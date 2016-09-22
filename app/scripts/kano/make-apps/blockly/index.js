(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Blockly = Kano.MakeApps.Blockly || {};

    Kano.MakeApps.Blockly.lookupStrings = {};
    Kano.MakeApps.Blockly.modules = {};
    Kano.MakeApps.Blockly.categories = {};

    Kano.MakeApps.Blockly.experiments = {};
    Kano.MakeApps.Blockly.available = Object.keys(Kano.MakeApps.Blockly.modules)
        .filter(key => Kano.MakeApps.Blockly.modules[key].experiments)
        .reduce((acc, key) => {
            return acc.concat(Object.keys(Kano.MakeApps.Blockly.modules[key].experiments));
        }, []);

    /**
     * Except for the natural declaration of language, each module will return a
     * definition of the category and blocks. We put these definitions on
     * an array and return all the categories;
     * @param  {[type]} Blockly [description]
     * @return {[type]}         [description]
     */
    Kano.MakeApps.Blockly.registered = false;
    Kano.MakeApps.Blockly.register = function (Blockly) {
        if (this.registered) {
            return;
        }
        Object.keys(this.modules).forEach(key => this.modules[key].register(Blockly));
        this.registered = true;
    };
    Kano.MakeApps.Blockly.init = function (c) {
        let flags = c.getFlags();
        flags.experiments.forEach(exp => {
            if (this.experiments[exp]) {
                this.experiments[exp].forEach(m => {
                    this.categories[exp] = m.category;
                });
            }
            Object.keys(this.modules).forEach(key => {
                if (this.modules[key].experiments && this.modules[key].experiments[exp]) {
                    this.categories[key].blocks = this.categories[key].blocks.concat(this.modules[key].experiments[exp]);
                }
            });
        });
        c.addExperiments('blocks', this.available.concat(Object.keys(this.experiments)));
    };

    Kano.MakeApps.Blockly.addModule = function (name, module, experiment) {
        experiment = typeof experiment === 'undefined' ? false : experiment;
        this.modules[name] = module;
        if (experiment) {
            this.experiments[name] = this.experiments[name] || [];
            this.experiments[name].push(module);
        } else if (module.category) {
            this.categories[name] = module.category;
        }
        if (module.experiments) {
            this.available = this.available.concat(Object.keys(module.experiments));
        }
    };

    Kano.MakeApps.Blockly.setLookupString = function (blockType, lookupString) {
        this.lookupStrings[lookupString] = this.lookupStrings[lookupString] || [];
        if (this.lookupStrings[lookupString].indexOf(blockType) === -1) {
            this.lookupStrings[lookupString].push(blockType);
        }
    };

    Kano.MakeApps.Blockly.removeLookupString = function (blockType) {
        Object.keys(this.lookupStrings).forEach((key) => {
            let index = this.lookupStrings[key].indexOf(blockType);
            if (index >= 0) {
                delete this.lookupStrings[key];
            }
        });
    };

    Kano.MakeApps.Blockly.lookupBlock = function (query) {
        let keys = Object.keys(this.lookupStrings),
            blocks,
            match;
        if (query.length) {
            keys = keys.filter(lookupString => lookupString.indexOf(query) !== -1);
        }
        blocks = keys.reduce((acc, key, index) => {
            if (index === 0) {
                match = key;
            }
            return acc.concat(this.lookupStrings[key]);
        }, [])
        .map(key => {
            return {
                type: key,
                shadow: this.Defaults.shadowMap[key]
            };
        });
        return { blocks, match };
    }

})(window.Kano = window.Kano || {});
