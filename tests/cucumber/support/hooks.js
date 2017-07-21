'use strict';

let world = require('./world'),
    server = require('../../server'),
    hooks;

hooks = function () {

    // Start a server to deliver make-apps files
    this.BeforeFeatures((e, callback) => {
        if (!process.env.EXTERNAL_SERVER) {
            server.listen(world.getPort(), callback);
        } else {
            callback();
        }
    });

    this.Before({ order: 1 }, () => {
        world.loginUser();
    });
    // Logout the user on the the tagged scenarios
    this.Before({ tags: ["@loggedout"], order: 2 }, () => {
        world.logoutUser();
    });

    // Take a screeshot if the scenario failed and attach it to the scenario report
    this.After((scenario, callback) => {
        if (scenario.isFailed()) {
            world.getDriver().takeScreenshot().then((stream) => {
                scenario.attach(stream, 'image/png', callback);
            }).catch(callback);
        } else {
            callback();
        }
    });

    this.After((scenario, callback) => {
        let driver = world.getDriver();
        if (scenario.isFailed()) {
            driver.manage().logs().get('browser')
                .then((logs) => {
                    logs.forEach((log) => console.log(`${log.level.name_}: ${log.message}`));
                    callback();
                }).catch(callback);
        } else {
            callback();
        }
    });

    // Close the browser
    this.AfterFeatures((e, callback) => {
        world.getDriver().quit().then(() => {
            callback();
        });
    });
};

module.exports = hooks;
