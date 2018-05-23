/* <link rel="import" href="./blockly/defaults.html"> */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { CopyManager } from './copy-manager.js';

var Challenge = function () {
    // Namespaces for the unique ids
    this.uidNss = {};

    this.data = {};
    this.data.steps = [];
    this.data.parts = [];
    this.data.modules = [];
    this.data.variables = [];
    this.data.filterBlocks = {};

    this.appParts = {};
    this.partsIds = {};
};
export { Challenge };

Challenge.categoryMap = Kano.MakeApps.Blockly.Defaults.categoryMap;

Challenge.fieldDefaults = {};

let block;

Object.keys(Kano.MakeApps.Blockly.Defaults.values).forEach(blockId => {
    Challenge.fieldDefaults[blockId] = {};
    block = Kano.MakeApps.Blockly.Defaults.values[blockId];
    Object.keys(block).forEach(fieldId => {
        if (block[fieldId].default) {
            Challenge.fieldDefaults[blockId][fieldId] = block[fieldId].default;
        } else {
            Challenge.fieldDefaults[blockId][fieldId] = block[fieldId];
        }
    });
});

Challenge.labels = Kano.MakeApps.Blockly.Defaults.labels;

Challenge.labels.field = {
    'GT': '>',
    'GTE': '>=',
    'LT': '<',
    'LTE': '<=',
    'EQ': '=',
    'DIVIDE': '/',
    'MULTIPLY': 'x',
    'ADD': '+',
    'SUBSTRACT': '-',
    'TRUE': 'true',
    'FALSE': 'false',
    'year': 'Year',
    'month': 'Month',
    'day': 'Day',
    'hour': 'Hour',
    'minute': 'Minute',
    'seconds': 'Seconds'
};

Challenge.parseBlockType = function (type) {
    var pieces = type.split('#'),
        result = {};
    if (pieces.length > 1) {
        result.category = pieces[0];
        result.block = pieces[1];
    } else {
        result.block = pieces[0];
    }
    return result;
};

Challenge.translate = function (type, key) {
    return Challenge.labels[type] && Challenge.labels[type][key] ? Challenge.labels[type][key] : key;
};

Challenge.createFromApp = function (app) {
    var challenge = new Challenge();
    challenge.loadFromApp(app);
    return challenge;
};

Challenge.prototype.translate = function (type, key) {
    var result = Challenge.translate(type, key);
    if (result === key) {
        if (type === 'category') {
            result = this.appParts[key] && this.appParts[key].name ? this.appParts[key].name : result;
        }
    }
    return result;
};

Challenge.prototype.uid = function (ns) {
    if (typeof this.uidNss[ns] === 'undefined') {
        this.uidNss[ns] = 0;
        return this.uidNss[ns];
    }
    return ++this.uidNss[ns];
};

Challenge.prototype.loadFromApp = function (app) {
    var xml = Blockly.Xml.textToDom(app.code.snapshot.blocks),
        mode,
        defaultXml,
        block, i;
    // Support older apps that saved the whole mode
    this.data.mode = app.mode.id || app.mode;
    mode = Kano.MakeApps.Mode.modes[this.data.mode]
    defaultXml = Blockly.Xml.textToDom(mode.defaultBlocks);
    app.parts.map(function (part, index) {
        var location = "parts-panel-" + part.type;
        if (this.data.parts.indexOf(part.type) === -1) {
            this.data.parts.push(part.type);
        }
        this.partsIds[part.id] = "part_" + this.uid('part');
        this.appParts[part.id] = part;

        this.data.steps.push({
            "banner": {
                "text": CopyManager.get('add-parts') + "<br>" + CopyManager.get('open-parts-drawer')
            },
            "beacon": {
                "target": "add-part-button"
            },
            "validation": {
                "open-parts": true
            }
        });
        this.data.steps.push({
            "tooltips": [{
                "location": "parts-panel",
                "position": "top",
                "text": "Click on <b>" + part.name + "</b> to add it to your app"
            }],
            "beacon": {
                "target": location
            },
            "validation": {
                "add-part": {
                    "type": part.type,
                    "id": this.partsIds[part.id]
                }
            }
        });
    }.bind(this));
    this.data.steps = this.data.steps.concat(this.matchDefaultBlocks(xml.children, defaultXml.children));
    this.data.steps.push({
        "banner": {
            "text": "You can now test the app",
            "next_button": true
        },
        "beacon": {
            "target": "banner-button",
            "offset": 0
        }
    });
};

Challenge.prototype.matchDefaultBlocks = function (blocks, defaultBlocks) {
    let steps = [];
    for (let i = 0; i < blocks.length; i++) {
        steps = steps.concat(this.matchDefaultNode(blocks[i], defaultBlocks[i]));
    }
    return steps;
};

Challenge.prototype.matchDefaultNode = function (node, defaultNode) {
    let steps = [];
    switch (node.tagName) {
        /**
         * Compare the blocks. Jump to children if they match, add a delete step to remove the existing the default block
         * if the block from the challenge is different from the one defined in the mode
         */
        case 'block': {
            if (!defaultNode) {
                steps = steps.concat(this.blockToSteps(node));
            } else if (node.getAttribute('type') === defaultNode.getAttribute('type') &&
                node.getAttribute('id') === defaultNode.getAttribute('id')) {
                steps = steps.concat(this.matchDefaultBlocks(node.children, defaultNode.children));
            } else {
                steps.push({
                    "tooltips": [{
                        "text": "You can remove this block we won't need it for this app",
                        "position": "right",
                        "location": {
                            "block": {
                                "rawId": defaultNode.getAttribute('id')
                            }
                        }
                    }],
                    "arrow": {
                        "target": 'blockly-bin',
                        "angle": 210,
                        "size": 80
                    },
                    "validation": {
                        "blockly": {
                            "delete": {
                                "target": {
                                    "rawId": defaultNode.getAttribute('id')
                                }
                            }
                        }
                    }
                });
                steps = steps.concat(this.blockToSteps(node));
            }
            break;
        }
        /**
         * Adds a change step if the value is different
         */
        case 'field': {
            if (node.firstChild.nodeValue !== defaultNode.firstChild.nodeValue ||
                node.firstChild.nodeValue !== node.firstChild.nodeValue) {
                steps = steps.concat(this.fieldToSteps(node, defaultNode.firstChild.nodeValue));
            }
            break;
        }
        case 'statement': {
            if (defaultNode) {
                steps = steps.concat(this.matchDefaultNode(node.firstChild, defaultNode.firstChild));
            }
            if (node) {
                steps = steps.concat(this.blockToSteps(node.firstChild));
            }
            break;
        }
        case 'next': {
            if (!defaultNode) {
                steps = steps.concat(this.blockToSteps(node.firstChild));
            } else {
                steps = steps.concat(this.matchDefaultNode(node.firstChild, defaultNode.firstChild));
            }
            break;
        }
    }
    return steps;
};

Challenge.prototype.parseComment = function (node) {
    let commentNode = node.getElementsByTagName('comment')[0],
        data = {},
        lines, pieces, property, args;
    if (commentNode) {
        // Matches line return outside of quotes
        lines = commentNode.innerText.split(/\n(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        lines.forEach(line => {
            // Space outside of quotes
            pieces = line.split(/\s(?=(?:[^"]*"[^"]*")*[^"]*$)/);
            if (pieces[0]) {
                property = pieces.shift();
                property = property.replace('@', '');
                args = pieces.map(piece => {
                    let m = piece.match(/^"(.+)"$/);
                    if (m) {
                        return m[1];
                    }
                    return piece;
                });
                data[property] = args;
            }
        });
    }

    return data;
};

/**
 * Generate the steps matching a `field` node in a Blockly XML tree
 */
Challenge.prototype.fieldToSteps = function (node, fieldDefault) {
    let parent = node.parentNode,
        parentBlockType = Challenge.parseBlockType(parent.getAttribute('type')),
        parentTagName = parent.tagName,
        steps = [],
        fieldValue,
        inputName,
        fieldName, commentData,
        shadowSelector, absoluteParentId;

    let ptag = parentTagName;
    let absParent = parent;
    // Lookup the absolute parent. We can have a chain of nested shadow block and need to build the shadow selector
    // from the parent block
    while (ptag !== 'block') {
        absParent = absParent.parentNode;
        ptag = absParent.tagName;
        if (ptag === 'value') {
            if (!shadowSelector) {
                shadowSelector = absParent.getAttribute('name')
            } else {
                shadowSelector = {
                    name: absParent.getAttribute('name'),
                    shadow: shadowSelector.shadow || shadowSelector
                };
            }
        }
    }


    commentData = this.parseComment(parent);

    if (commentData.bannerText) {
        commentData.bannerText = commentData.bannerText[0];
    }

    if (commentData.freeWill) {
        commentData.freeWill = commentData.freeWill[0];
    }

    if (parentBlockType.block === 'variables_set' && this.data.variables.indexOf(node.firstChild.nodeValue) === -1) {
        this.data.variables.push(node.firstChild.nodeValue);
    }
    if (!!node.firstChild && node.firstChild.nodeValue !== null) {
        if (parentTagName === 'shadow') {
            inputName = parent.parentNode.getAttribute('name');
            fieldName = inputName;
            parent = parent.parentNode.parentNode;
            parentBlockType = Challenge.parseBlockType(parent.getAttribute('type'));
        } else {
            fieldName = node.getAttribute('name');
        }
        if (fieldName && !fieldDefault) {
            if (!Challenge.fieldDefaults[parentBlockType.block]) {
                console.log('missing default field: ', parentBlockType.block, fieldName);
            } else {
                fieldDefault = Challenge.fieldDefaults[parentBlockType.block][fieldName];
                while (typeof fieldDefault === 'object' && 'shadow' in fieldDefault && 'default' in fieldDefault) {
                    fieldDefault = fieldDefault.default;
                }
            }
        }
        // Loose check of the value
        if (node.firstChild.nodeValue != fieldDefault) {
            let challengeId = absParent.getAttribute('challengeId'),
                rawId = absParent.getAttribute('id'),
                bannerText, fieldPreview, currentFieldPreview;
            let selector = {
                    shadow: shadowSelector
                },
                step;
            if (challengeId) {
                selector.id = challengeId
            } else {
                selector.rawId = rawId;
            }
            fieldValue = this.translate('field', node.firstChild.nodeValue);
            fieldPreview = this.generateFieldPreview(node, fieldValue);
            currentFieldPreview = this.generateFieldPreview(node, fieldDefault);
            bannerText = commentData.bannerText || `Change $currentFieldPreview to $fieldPreview`;
            bannerText = bannerText.replace(/\$fieldPreview/g, fieldPreview);
            bannerText = bannerText.replace(/\$currentFieldPreview/g, currentFieldPreview);
            // Add a `change value` step to get the right value
            const uiLocation = Object.assign({ inputName: fieldName }, selector);
            step = {
                "banner": {
                    "text": bannerText
                },
                "beacon": {
                    "target": {
                        "block": uiLocation
                    }
                },
                "validation": {
                    "blockly": {
                        "value": {
                            "target": selector
                        }
                    }
                }
            };
            if (commentData.freeWill !== fieldName) {
                step.validation.blockly.value.value = node.firstChild.nodeValue;
            }
            steps.push(step);
        }
    }
    return steps;
};

/**
 * Generate the steps matching a `block` node in a Blockly XML tree
 */
Challenge.prototype.blockToSteps = function (node) {
    // Defines the location of the toolbox category. Can be the category itself or from a previously added part
    var blockChallengeId = 'block_' + this.uid('block'),
        type = node.getAttribute('type'),
        blockType = Challenge.parseBlockType(type),
        steps = [],
        parent = node.parentNode,
        parentTagName,
        categoryLocation,
        blockLocation,
        markdownType,
        creationType,
        categoryLabel,
        inputName,
        commentData;

    commentData = this.parseComment(node);

    if (commentData.openTrayText) {
        commentData.openTrayText = commentData.openTrayText[0].replace('\n', '<br>');
    }

    if (commentData.createText) {
        commentData.createText = commentData.createText[0].replace('\n', '<br>');
    }

    if (commentData.connectText) {
        commentData.connectText = commentData.connectText[0].replace('\n', '<br>');
    }

    node.setAttribute('challengeId', blockChallengeId);

    parentTagName = parent.tagName;

    // The block from the original app isn't from a created part, thus doens't contain a category field
    if (!blockType.category) {
        categoryLocation = blockType.category = Challenge.categoryMap[blockType.block];
        blockLocation = markdownType = blockType.block;
        creationType = {
            type: blockLocation,
            id: blockChallengeId
        };
        if (this.data.modules.indexOf(blockType.category) === -1) {
            this.data.modules.push(blockType.category);
        }
    } else if (this.partsIds[blockType.category]) {
        blockLocation = {
            part: this.partsIds[blockType.category],
            type: blockType.block
        };
        categoryLocation = {
            part: blockLocation.part
        };
        creationType = {
            target: blockLocation.part,
            type: blockLocation.type,
            id: blockChallengeId
        };
        markdownType = blockLocation.part + "#" + blockLocation.type;
    } else {
        blockLocation = creationType = markdownType = type;
        categoryLocation = blockType.category;
        creationType = {
            type: blockLocation,
            id: blockChallengeId
        };
    }

    // Adds the block to the whitelist
    this.data.filterBlocks[blockType.category] = this.data.filterBlocks[blockType.category] || [];
    if (this.data.filterBlocks[blockType.category].indexOf(blockType.block) === -1) {
        this.data.filterBlocks[blockType.category].push(blockType.block)
    }

    categoryLabel = this.translate('category', blockType.category);
    if (categoryLabel !== blockType.category) {
        categoryLabel = "the " + categoryLabel;
    } else {
        categoryLabel = "this";
    }

    if (commentData.createText) {
        commentData.createText = commentData.createText.replace(/\$blockPreview/g, `<kano-blockly-block type="${markdownType}"></kano-blockly-block>`);
    }

    steps.push({
        "banner": {
            "text": commentData.openTrayText || "Open " + categoryLabel + " tray"
        },
        "beacon": {
            "target": {
                "category": categoryLocation
            }
        },
        "validation": {
            "blockly": {
                "open-flyout": categoryLocation
            }
        }
    });
    steps.push({
        "banner": {
            "text": commentData.createText || 'Drag the block onto your code space'
        },
        "beacon": {
            "target": {
                "flyout_block": blockLocation
            }
        },
        "validation": {
            "blockly": {
                "create": creationType
            }
        }
    });
    if (parentTagName === 'next') {
        parent = parent.parentNode;
    } else if (parentTagName === 'statement' || parentTagName === 'value') {
        inputName = parent.getAttribute('name');
        parent = parent.parentNode;
    } else {
        parent = null;
    }
    if (parent) {
        let step = {
            "banner": {
                "text": commentData.connectText || CopyManager.get('connect-blocks')
            },
            "beacon": {
                "target": {
                    "block": {
                        id: parent.getAttribute('challengeId'),
                        rawId: parent.getAttribute('id')
                    }
                }
            },
            "validation": {
                "blockly": {
                    "connect": {
                        "parent": {
                            id: parent.getAttribute('challengeId'),
                            rawId: parent.getAttribute('id'),
                            inputName
                        },
                        "target": blockChallengeId
                    }
                }
            }
        };
        step.phantom_block = {
            "location": {
                "block": {
                    id: parent.getAttribute('challengeId'),
                    rawId: parent.getAttribute('id')
                }
            },
            "target": inputName
        };
        steps.push(step);
    } else {
        steps.push({
            "banner": {
                "text": CopyManager.get('drop-codespace')
            },
            "beacon": {
                "target": "blocks-panel",
                "offset": 300,
                "angle": 200
            },
            "validation": {
                "blockly": {
                    "drop": {
                        "target": blockChallengeId
                    }
                }
            }
        });
    }

    for (let i = 0; i < node.children.length; i++) {
        steps = steps.concat(this.nodeToSteps(node.children[i]));
    }

    return steps;
};

/**
 * Generate the steps matching a `value` node in a Blockly XML tree
 */
Challenge.prototype.valueToSteps = function (node) {
    let steps = [],
        child;
    for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].tagName === 'block') {
            child = node.children[i];
            break;
        }
    }
    if (!child) {
        child = node.firstChild;
    }
    steps = steps.concat(this.nodeToSteps(child));

    return steps;
};

Challenge.prototype.nodeToSteps = function (node) {
    var steps = [],
        child,
        i;

    switch (node.tagName) {
        case 'field': {
            steps = steps.concat(this.fieldToSteps(node));
            break;
        }
        case 'next':
        case 'value': {
            steps = steps.concat(this.valueToSteps(node));
            break;
        }
        case 'statement': {
            steps = steps.concat(this.nodeToSteps(node.firstChild));
            break;
        }
        case 'shadow': {
            for (i = 0; i < node.children.length; i++) {
                child = node.children[i];
                steps = steps.concat(this.nodeToSteps(child));
            }
            break;
        }
        case 'block': {
            steps = steps.concat(this.blockToSteps(node));
            break;
        }
    }
    return steps;
};

Challenge.prototype.generateFieldPreview = function (node, fieldValue) {
    return '<kano-value-preview><span>' + fieldValue + '</span></kano-value-preview>';
};
