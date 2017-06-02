/**
 * Name of event that records a UI change.
 * @const
 */
Blockly.Events.SCROLL = 'scroll';

Blockly.Events.DROP_BLOCK = 'drop-block';
Blockly.Events.OPEN_FLYOUT = 'open-flyout';
Blockly.Events.CLOSE_FLYOUT = 'close-flyout';

/**
 * Class for a Scroll event.
 * @param {Blockly.Workspace} workspace The affected block.
 * @extends {Blockly.Events.Abstract}
 * @constructor
 */
Blockly.Events.Scroll = function(workspace) {
  Blockly.Events.Scroll.superClass_.constructor.call(this);
  this.workspaceId = workspace.id;
  this.recordUndo = false;
};
goog.inherits(Blockly.Events.Scroll, Blockly.Events.Abstract);

/**
 * Type of this event.
 * @type {string}
 */
Blockly.Events.Scroll.prototype.type = Blockly.Events.SCROLL;
