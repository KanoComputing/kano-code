(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Blockly = Kano.MakeApps.Blockly || {};

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
        console.log(flags.experiments, this.experiments);
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
})(window.Kano = window.Kano || {});
