'use strict';

let webdriver = require('selenium-webdriver'),
    {defineSupportCode} = require('cucumber'),
    fs = require('fs'),
    path = require('path'),
    should = require('should'),
    user = null;

const DEFAULT_TIMEOUT = process.env.EXTERNAL_SERVER ? 20000 : 10000,
    // testing user creating in staging env
    USER = {
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAa2Fuby5tZSIsInVzZXJuYW1lIjoiYXV0b21hdGVkLXRlc3QiLCJpYXQiOjE0NjMyMjkxMDR9.-wowXt2oF7iCSuyxxfcJJoirsYsT0-dwbbe9FxhIusU'
    },
    INIT_SCRIPT = fs.readFileSync(path.join(__dirname, '../../scripts/init.js')).toString(),
    ELEMENTS_SELECTORS = {},
    EDITOR_SELECTORS = {};

ELEMENTS_SELECTORS.editor = {
    editor: ['kano-app-editor']
};

EDITOR_SELECTORS['Add Parts'] = ['kano-workspace', 'kano-editor-normal', 'kano-default-workspace', '#add-part-button'];
EDITOR_SELECTORS['Add Parts Dialog'] = ['#parts-modal'];
EDITOR_SELECTORS['done in add parts dialog'] = ['kano-add-parts', 'header button'];
EDITOR_SELECTORS['Confirm part deletion dialog'] = ['#dialog-confirm-delete'];
EDITOR_SELECTORS['Default workspace'] = ['kano-workspace', 'kano-editor-normal', 'kano-default-workspace'];
EDITOR_SELECTORS['Part editor'] = ['#edit-part-dialog-content'];
EDITOR_SELECTORS['flyout'] = ['kc-blockly-editor', 'kwc-blockly', 'kwc-blockly-toolbox', 'kwc-blockly-flyout'];

user = USER;

function buildDriver(capabilities) {
    return new webdriver.Builder()
        .withCapabilities(capabilities)
        .build();
}

class CustomWorld {
    constructor () {
        this.shadowEnabled = false;
        this.routeMap = {
            'editor': '/',
            'story': '/story'
        };

        this.driver = CustomWorld.createDriver();

        this.store = {};
    }
    static createDriver () {
        if (!CustomWorld.driver) {
            let capabilities = webdriver.Capabilities.chrome(),
                chromeOptions = {
                'args': ['--test-type', '--start-maximized', '--disable-popup-blocking']
            };
            capabilities.set('build', `${process.env.JOB_NAME}__${process.env.BUILD_NUMBER}`);
            capabilities.set('chromeOptions', chromeOptions);
            CustomWorld.driver = buildDriver(capabilities);
        }
        return CustomWorld.driver;
    }
    static getPort () {
        return process.env.TEST_PORT || 4444;
    }
    setup () {
        this.driver.executeScript(INIT_SCRIPT);
    }
    loginUser () {
        user = USER;
        return Promise.resolve();
    }
    logoutUser () {
        user = null;
        return Promise.resolve();
    }
    getLogs () {
        return this.driver.manage().logs().get('browser');
    }
    getEditorFromPage (page) {
        return ELEMENTS_SELECTORS[page].editor;
    }
    getEditorElement (element) {
        return this.waitForEditorReady()
            .then(() => this.getCurrentViewElement())
            .then(viewElement => {
                let selectors = this.getEditorFromPage(this.page)
                if (element) {
                    selectors = selectors.concat(EDITOR_SELECTORS[element]);
                }
                return this.findElement(viewElement, selectors);
            });
    }
    getPartEditor () {
        return this.getEditorElement('Part editor').then(partEditorElement => {
            return this.driver.executeScript(`return arguments[0].shadowRoot.querySelector('#config-panel-container').firstChild`, partEditorElement);
        });
    }
    waitForEditorReady () {
        return this.driver.wait(() => {
            return this.getCurrentViewElement()
                .then(viewElement => {
                    return this.findElement(viewElement, this.getEditorFromPage(this.page));
                }).then(editorElement => {
                    return this.driver.executeScript('return arguments[0].modeReady', editorElement);
                })
        }, 4000);
    }
    isRouteLoaded () {
        return this.driver.executeScript(`return window.__routeLoaded__;`);
    }
    waitForRouteLoad () {
        this.driver.wait(() => {
            return this.isRouteLoaded();
        }, 8000, `Page didn't load`);
    }
    waitForPage (page, timeout=2000) {
        return this.driver.wait(() => {
            return this.driver.executeScript(`return window.__currentPage__ === '${page}';`);
        }, timeout, `Page '${page}' not displayed`)
            .then(() => this.wait(500));
    }
    getCurrentViewElement () {
        let element;
        return this.driver.wait(() => {
            return this.driver.executeScript(`return window.__routingEl__.$$('.iron-lazy-selected');`)
                .then(e => {
                    element = e;
                    return !!element;
                });
        }, 2000)
            .then(() => this.wait(500))
            .then(() => element);
    }
    findElement (root, selectors) {
        return this.driver.executeScript('return window.__findElement__(arguments[0], arguments[1])', root, selectors);
    }
    findElements (root, selector) {
        return this.driver.executeScript(`return arguments[0].querySelectorAll('${selector}')`, root);
    }
    waitForElementToBeVisible (element, timeout=2000) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__isVisible__(arguments[0])', element)
                .then(visible => visible.should.be.true());
        }, timeout, 'Element is not visible');
    }
    ensureElementIsNotVisible (element, timeout=200) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__isVisible__(arguments[0])', element)
            .then(visible => visible.should.be.false());
        }, timeout, 'Element is visible');
    }
    getPartById (editorEl, partId) {
        return this.driver.executeScript('return window.__getPartByIdFromEditor__(arguments[0], arguments[1]);', editorEl, partId);
    }
    getBlocks (editorEl, blockType) {
        return this.driver.executeScript('return window.__getBlockByTypeFromEditor__(arguments[0], arguments[1]);', editorEl, blockType);
    }
    ensurePartDoesNotExist (editorEl, partId) {
        return this.getPartById(editorEl, partId)
            .then(part => should.not.exist(part));
    }
    ensurePartExists (editorEl, partId) {
        return this.getPartById(editorEl, partId)
            .then(part => should.exist(part));
    }
    ensureBlockExists (editorEl, blockType) {
        return this.getBlocks(editorEl, blockType).then(blocks => {
            return blocks.length.should.be.greaterThanOrEqual(1);
        });
    }
    /**
     * Empty the localStorage
     */
    clearStorage () {
        return this.driver.executeScript(`localStorage.clear('KW_TOKEN', arguments[0]);`, this.user);
    }
    loadAppInStorage (filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, contents) => {
                if (err) {
                    return reject(err);
                }
                resolve(contents);
            });
        }).then(contents => {
            this.loadedApp = contents.toString();
        });
    }
    /**
     * Open the app to a speficied route
     */
    openApp (page, ext) {
        let route,
            viewPath;
        ext = ext || '';
        page = page || 'editor';
        route = this.routeMap[page];
        if (!route) {
            return Promise.reject(new Error(`Tried to open a non registered page: ${page}`));
        }
        this.page = page;
        return this.driver.get(`http://localhost:${CustomWorld.getPort()}${route}${ext}`)
            .then(() => this.clearStorage())
            .then(() => {
                let tasks = [];
                if (user) {
                    tasks.push(this.driver.executeScript(`localStorage.setItem('KW_TOKEN', '${user.token}');`));
                }
                if (this.loadedApp) {
                    tasks.push(this.driver.executeScript(`return localStorage.setItem('savedApp-normal', arguments[0])`, this.loadedApp));
                }
                return Promise.all(tasks);
            })
            .then(() => this.setup())
            .then(() => this.waitForRouteLoad(viewPath))
            .then(() => this.waitForPage(page));
    }
    openAddPartsDialog () {
        return this.getEditorElement('Add Parts')
            .then(button => button.click())
            .then(() => this.getEditorElement('Add Parts Dialog'))
            .then(dialog => {
                return this.wait(500)
                    .then(() => this.waitForElementToBeVisible(dialog))
                    .then(() => dialog);
            });
    }
    getPartsInAddPartsDialog (dialog) {
        return this.driver.executeScript(`return arguments[0].querySelector('kano-add-parts').shadowRoot`, dialog)
            .then(addPartsEl => this.findElements(addPartsEl, '.categories  kano-add-parts-item'));
    }
    addPart (dialog) {
        let key = `__addedPart__${Date.now()}__`;
        return this.getEditorElement()
            .then(editorEl => {
                return this.driver.executeScript(`arguments[0].addEventListener('added-parts-changed', function (e) {
                    if (e.detail.path === 'addedParts.#0') {
                        window.${key} = e.detail.value.id;
                    }
                })`, editorEl);
            })
            .then(() => this.getPartsInAddPartsDialog(dialog))
            .then(partsEls => {
                let idx = Math.floor(Math.random() * partsEls.length);
                return partsEls[idx].click();
            })
            .then(() => {
                return this.driver.wait(() => {
                    return this.driver.executeScript(`return window.${key};`);
                }, 2000);
            });
    }
    getCategoryButton (id) {
        return this.getEditorElement()
            .then(el => {
                return this.driver.executeScript(`return arguments[0].getBlocklyWorkspace().toolbox.getCategoryElement(arguments[1])`, el, id);
            });
    }
    wait (duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }
}

defineSupportCode(({setWorldConstructor, setDefaultTimeout}) => {
    setDefaultTimeout(60 * 10000);
    setWorldConstructor(CustomWorld);
});

module.exports = CustomWorld;
