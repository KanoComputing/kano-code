export const experiments = {};

// Read the flags from the localStorage and merge them into the config object
const storedFlags = JSON.parse(localStorage.getItem('flags'));
Object.assign(experiments, { FLAGS: storedFlags });

experiments.updateFlags = function updateFlags(f) {
    this.FLAGS = f;
    localStorage.setItem('flags', JSON.stringify(f));
};

experiments.addExperiments = function addExperiments(type, experiments) {
    let experiment;
    const flags = this.getFlags();
    experiments.forEach((key) => {
        flags.available[key] = flags.available[key] || [];
        experiment = flags.available[key];
        if (experiment.indexOf(type) === -1) {
            experiment.push(type);
        }
    });
};

experiments.getFlags = function getFlags() {
    this.FLAGS = this.FLAGS || {};
    this.FLAGS.experiments = this.FLAGS.experiments || [];
    this.FLAGS.available = this.FLAGS.available || {};
    return this.FLAGS;
};
