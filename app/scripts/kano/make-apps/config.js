(function (Kano) {
    let flags;

    Kano.MakeApps = Kano.MakeApps || {};

    Kano.MakeApps.config = Kano.MakeApps.config || {};

    // Read the flags from the localStorage and merge them into the config object
    flags = JSON.parse(localStorage.getItem('flags'));
    Object.assign(Kano.MakeApps.config, { "FLAGS": flags });

    Kano.MakeApps.config.updateFlags = function (flags) {
        this.FLAGS = flags;
        localStorage.setItem('flags', JSON.stringify(flags));
    }

    Kano.MakeApps.config.addExperiments = function (type, experiments) {
        var experiment,
            flags = this.getFlags();
        experiments.forEach(key => {
            flags.available[key] = flags.available[key] || [];
            experiment = flags.available[key];
            if (experiment.indexOf(type) === -1) {
                experiment.push(type);
            }
        });
    }

    Kano.MakeApps.config.getFlags = function () {
        this.FLAGS = this.FLAGS || {};
        this.FLAGS.experiments = this.FLAGS.experiments || [];
        this.FLAGS.available = this.FLAGS.available || {};
        return this.FLAGS;
    }

})(window.Kano = window.Kano || {});
