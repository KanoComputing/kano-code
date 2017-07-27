/* global Blockly, goog */

/**
 * The menu item index for the rename variable option.
 * @type {number}
 * @private
 */
Blockly.FieldVariable.prototype.newVarItemIndex_ = -1;

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function () {
    var options = [],
        variableList, name;
    if (this.sourceBlock_ && this.sourceBlock_.workspace) {
        // Get a copy of the list, so that adding rename and new variable options
        // doesn't modify the workspace's list.
        variableList = Blockly.Variables.allVariables(this.sourceBlock_.workspace).map(variableModel => variableModel.name);
    } else {
        variableList = [];
    }
    // Ensure that the currently selected variable is an option.
    name = this.getText();
    if (name && variableList.indexOf(name) == -1) {
        variableList.push(name);
    }
    variableList.sort(goog.string.caseInsensitiveCompare);

    this.newVarItemIndex_ = variableList.length;
    variableList.push(Blockly.Msg.NEW_VARIABLE);

    this.renameVarItemIndex_ = variableList.length;
    variableList.push(Blockly.Msg.RENAME_VARIABLE);

    this.deleteVarItemIndex_ = variableList.length;
    variableList.push(Blockly.Msg.DELETE_VARIABLE.replace('%1', name));
    // Variables are not language-specific, use the name as both the user-facing
    // text and the internal representation.
    for (let i = 0; i < variableList.length; i++) {
        options[i] = [variableList[i], variableList[i]];
    }
    return options;
};

/**
 * Handle the selection of an item in the variable dropdown menu.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {!goog.ui.Menu} menu The Menu component clicked.
 * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
 */
Blockly.FieldVariable.prototype.onItemSelected = function (menu, menuItem) {
    var itemText = menuItem.getValue(),
        oldName, workspace;
    if (this.sourceBlock_) {
        workspace = this.sourceBlock_.workspace;
        if (this.renameVarItemIndex_ >= 0 &&
            menu.getChildAt(this.renameVarItemIndex_) === menuItem) {
            // Rename variable.
            oldName = this.getText();
            Blockly.hideChaff();
            Blockly.Variables.promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldName), oldName, (newName) => {
                if (newName) {
                    workspace.renameVariable(oldName, newName);
                }
            });
            return;
        } else if (this.newVarItemIndex_ >= 0 &&
            menu.getChildAt(this.newVarItemIndex_) === menuItem) {
            Blockly.hideChaff();
            Blockly.Variables.promptName(Blockly.Msg.NEW_VARIABLE_TITLE, '', (newName) => {
                if (newName) {
                    workspace.createVariable(newName);
                    this.setValue(newName);
                }
            });
            return;
        } else if (this.deleteVarItemIndex_ >= 0 &&
            menu.getChildAt(this.deleteVarItemIndex_) === menuItem) {
            // Delete variable.
            workspace.deleteVariable(this.getText());
            return;
        }

        // Call any validation function, and allow it to override.
        itemText = this.callValidator(itemText);
    }
    if (itemText !== null) {
        this.setValue(itemText);
    }
};