#!/usr/bin/env node
const args = process.argv,
      file = args[2],
      fs = require('fs'),
      path = require('path');

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(process.cwd(), file), 'utf-8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString('utf-8'));
        });
    });
}

function writeFile(file, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(process.cwd(), file), content, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

function fixLocation(location) {
    if (typeof location === 'string') {
        location = location.replace('parts-panel-part-', 'parts-panel-');
    }
    return location;
}

function processChallenge(file) {
    // Move back the backup if reprocessing
    file = file.replace('.bckp', '');
    return readFile(file).then(content => {
        return writeFile(file + '.bckp', content).then(() => {
            return content;
        });
    })
    .then(content => {
        let root = JSON.parse(content);
        root.steps.forEach(step => {
            let tooltip;
            if (step.tooltips && step.tooltips[0]) {
                tooltip = step.tooltips[0];
                step.beacon = {
                    target: fixLocation(tooltip.location)
                };
                step.banner = {
                    text: tooltip.text
                };
                if (tooltip.next_button) {
                    step.banner.next_button = true;
                }
                step.tooltips.shift();
                if (!step.tooltips.length) {
                    delete step.tooltips;
                }
            }
            if (step.arrow) {
                if (!step.arrow.source) {
                    step.beacon = {
                        target: fixLocation(step.arrow.target),
                        angle: step.arrow.angle
                    }
                }
                delete step.arrow;
            }
            if (step.highlight) {
                step.arrow = {
                    target: fixLocation(step.highlight)
                }
                delete step.highlight;
            }
        });
        return root;
    }).then(root => {
        let s = JSON.stringify(root, null, 4);
        return writeFile(file, s);
    });
}

processChallenge(file)
    .then(() => {
        console.log('Success');
        console.log(`Backup saved under ${file + '.bckp'}`);
    })
    .catch(e => {
        console.log(e);
    });
