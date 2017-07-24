/* globals Blockly, goog */
Blockly.OriginalScrollbar = Blockly.Scrollbar;
/**
 * Class for a pure SVG scrollbar.
 * This technique offers a scrollbar that is guaranteed to work, but may not
 * look or behave like the system's scrollbars.
 * @param {!Blockly.Workspace} workspace Workspace to bind the scrollbar to.
 * @param {boolean} horizontal True if horizontal, false if vertical.
 * @param {boolean=} opt_pair True if scrollbar is part of a horiz/vert pair.
 * @param {string} opt_class A class to be applied to this scrollbar.
 * @constructor
 */
Blockly.Scrollbar = function(workspace, horizontal, opt_pair, opt_class) {
  Blockly.Scrollbar.superClass_.constructor.call(this, workspace, horizontal, opt_pair, opt_class);

  if (horizontal) {
    this.svgHandle_.setAttribute('height',
        Blockly.Scrollbar.scrollbarThickness - 7);
    this.svgHandle_.setAttribute('y', 0);

  } else {
    this.svgHandle_.setAttribute('width',
        Blockly.Scrollbar.scrollbarThickness - 7);
    this.svgHandle_.setAttribute('x', 0);
  }
};

goog.inherits(Blockly.Scrollbar, Blockly.OriginalScrollbar);

Blockly.Scrollbar.scrollbarThickness = 12;
Blockly.Scrollbar.metricsAreEquivalent_ = Blockly.OriginalScrollbar.metricsAreEquivalent_;

/**
 * Set the sliders of both scrollbars to be at a certain position.
 * @param {number} x Horizontal scroll value.
 * @param {number} y Vertical scroll value.
 */
Blockly.ScrollbarPair.prototype.set = function(x, y) {
  // This function is equivalent to:
  //   this.hScroll.set(x);
  //   this.vScroll.set(y);
  // However, that calls setMetrics twice which causes a chain of
  // getAttribute->setAttribute->getAttribute resulting in an extra layout pass.
  // Combining them speeds up rendering.
  var xyRatio = {};

  var hHandlePosition = x * this.hScroll.ratio_;
  var vHandlePosition = y * this.vScroll.ratio_;

  var hBarLength = this.hScroll.scrollViewSize_;
  var vBarLength = this.vScroll.scrollViewSize_;

  xyRatio.x = this.getRatio_(hHandlePosition, hBarLength);
  xyRatio.y = this.getRatio_(vHandlePosition, vBarLength);
  this.workspace_.setMetrics(xyRatio);

  this.hScroll.setHandlePosition(hHandlePosition);
  this.vScroll.setHandlePosition(vHandlePosition);
  Blockly.Events.fire(new Blockly.Events.Scroll(this.workspace_));
};


