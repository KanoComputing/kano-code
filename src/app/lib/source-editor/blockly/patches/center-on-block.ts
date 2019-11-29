// The default blockly centerOnBlock uses the full height of the block SVG tree to calculate the center
// This takes All its child blocks too
// This patches the function to really focus on one block
// More here: https://github.com/microsoft/pxt-blockly/commit/8c0ee74aaeccea48b68c6ecbbf68acc3a7e7c879

/**
 * Scroll the workspace to center on the given block.
 * @param {?string} id ID of block center on.
 * @param {boolean} animate If true, transition to the block.
 * @public
 */
// @ts-ignore
Blockly.WorkspaceSvg.prototype.centerOnBlock = function(id, animate) {
    if (!this.scrollbar) {
      console.warn('Tried to scroll a non-scrollable workspace.');
      return;
    }
  
    var block = this.getBlockById(id);
    if (!block) {
      return;
    }
  
    // If we're animating, apply a transition class to the workspace
    if (animate) {
      // @ts-ignore
      Blockly.utils.addClass(this.svgBlockCanvas_, 'blocklyTransitioning');
    }
  
    // XY is in workspace coordinates.
    var xy = block.getRelativeToSurfaceXY();
    // Height/width is in workspace units. Note that getHeightWidth returns the block height AND all subsequent blocks.
    var heightWidth = { height: block.height, width: block.width };
  
    // Find the center of the block in workspace units.
    var blockCenterY = xy.y + heightWidth.height / 2;
  
    // In RTL the block's position is the top right of the block, not top left.
    var multiplier = this.RTL ? -1 : 1;
    var blockCenterX = xy.x + (multiplier * heightWidth.width / 2);
  
    // Workspace scale, used to convert from workspace coordinates to pixels.
    var scale = this.scale;
  
    // Center in pixels.  0, 0 is at the workspace origin.  These numbers may
    // be negative.
    var pixelX = blockCenterX * scale;
    var pixelY = blockCenterY * scale;
  
    var metrics = this.getMetrics();
  
    // Scrolling to here would put the block in the top-left corner of the
    // visible workspace.
    var scrollToBlockX = pixelX - metrics.contentLeft;
    var scrollToBlockY = pixelY - metrics.contentTop;
  
    // viewHeight and viewWidth are in pixels.
    var halfViewWidth = metrics.viewWidth / 2;
    var halfViewHeight = metrics.viewHeight / 2;
  
    // Put the block in the center of the visible workspace instead.
    var scrollToCenterX = scrollToBlockX - halfViewWidth;
    var scrollToCenterY = scrollToBlockY - halfViewHeight;
  
    // @ts-ignore
    Blockly.hideChaff();
    this.scrollbar.set(scrollToCenterX, scrollToCenterY);
  
    var blockCanvas = this.svgBlockCanvas_;
    setTimeout(function() {
      // @ts-ignore
      Blockly.utils.removeClass(blockCanvas, 'blocklyTransitioning');
    // @ts-ignore
    }, 500);
};
