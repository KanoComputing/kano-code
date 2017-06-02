Blockly.WorkspaceSvg.prototype.scrollBlockIntoView = function (block, animate) {
    block.select();      // *block* is the block to scroll into view.
    var xy = block.getRelativeToSurfaceXY();
    var metrics = this.getMetrics();
    var transitionCallback;
    if (animate) {
        transitionCallback = function () {
            this.svgBlockCanvas_.removeEventListener('transitionend', transitionCallback);
            Blockly.utils.removeClass(this.svgBlockCanvas_, 'smoothScroll');
        }.bind(this);
        Blockly.utils.addClass(this.svgBlockCanvas_, 'smoothScroll');
        this.svgBlockCanvas_.addEventListener('transitionend', transitionCallback);
    }
    this.scrollbar.set(xy.x * this.scale - metrics.contentLeft - metrics.viewWidth  * 0.2,
                        xy.y * this.scale - metrics.contentTop  - metrics.viewHeight * 0.3);
};