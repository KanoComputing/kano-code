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