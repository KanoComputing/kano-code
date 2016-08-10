/* globals Blockly, goog */
Blockly.Blocks.colour.HUE = '#ffff00';
Blockly.Blocks.logic.HUE = '#7DC242';
Blockly.Blocks.variables.HUE = '#34A836';
Blockly.Blocks.loops.HUE = '#ffff00';
Blockly.Blocks.math.HUE = '#7DC242';
Blockly.Blocks.texts.HUE = '#9C27B0';
Blockly.Blocks.lists.HUE = '#ffff00';
Blockly.Blocks.procedures.HUE = '#ffff00';

Blockly.Scrollbar.scrollbarThickness = 5;

// Reload the custom messages as Blockly overrides them
if (window.CustomBlocklyMsg) {
    Object.assign(Blockly.Msg, window.CustomBlocklyMsg);
}

function lightenColor (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}
function rgbToHex(r,g,b){
    var bin = r << 16 | g << 8 | b;
    return (function(h){
        return new Array(7-h.length).join("0")+h
    })(bin.toString(16).toUpperCase())
}

var injectMethods = {
    bindDocumentEvents_: Blockly.inject.bindDocumentEvents_,
    loadSounds_: Blockly.inject.loadSounds_,
};

/**
 * Sets the state or property of an element.
 * @param {!Element} element DOM node where we set state.
 * @param {!(goog.a11y.aria.State|string)} stateName State attribute being set.
 *     Automatically adds prefix 'aria-' to the state name if the attribute is
 *     not an extra attribute.
 * @param {string|boolean|number|!Array<string>} value Value
 * for the state attribute.
 */
goog.a11y.aria.setState = function(element, stateName, value) {
  if (goog.isArray(value)) {
    value = value.join(' ');
  }
  var attrStateName = goog.a11y.aria.getAriaAttributeName_(stateName);
  if (!element) {
      return;
  }
  if (value === '' || value == undefined) {
    var defaultValueMap = goog.a11y.aria.datatables.getDefaultValuesMap();
    // Work around for browsers that don't properly support ARIA.
    // According to the ARIA W3C standard, user agents should allow
    // setting empty value which results in setting the default value
    // for the ARIA state if such exists. The exact text from the ARIA W3C
    // standard (http://www.w3.org/TR/wai-aria/states_and_properties):
    // "When a value is indicated as the default, the user agent
    // MUST follow the behavior prescribed by this value when the state or
    // property is empty or undefined."
    // The defaultValueMap contains the default values for the ARIA states
    // and has as a key the goog.a11y.aria.State constant for the state.
    if (stateName in defaultValueMap) {
      element.setAttribute(attrStateName, defaultValueMap[stateName]);
    } else {
      element.removeAttribute(attrStateName);
    }
  } else {
    element.setAttribute(attrStateName, value);
  }
};


/**
 * Inject a Blockly editor into the specified container element (usually a div).
 * @param {!Element|string} container Containing element, or its ID,
 *     or a CSS selector.
 * @param {Object=} opt_options Optional dictionary of options.
 * @return {!Blockly.Workspace} Newly created main workspace.
 */
Blockly.inject = function(container, opt_options) {
  if (goog.isString(container)) {
    container = document.getElementById(container) ||
        document.querySelector(container);
  }
  // Verify that the container is in document.
  // No relevant using shadow dom
  /*if (!goog.dom.contains(document, container)) {
    throw 'Error: container is not in current document.';
  }*/
  var options = new Blockly.Options(opt_options || {});
  var svg = Blockly.createDom_(container, options);
  var workspace = Blockly.createMainWorkspace_(svg, options);
  Blockly.init_(workspace);
  workspace.markFocused();
  Blockly.bindEvent_(svg, 'focus', workspace, workspace.markFocused);
  Blockly.svgResize(workspace);
  return workspace;
};

Blockly.inject.bindDocumentEvents_ = injectMethods.bindDocumentEvents_;
Blockly.inject.loadSounds_ = injectMethods.loadSounds_;

/**
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 * @private
 */
Blockly.isTargetInput_ = function(e) {
  // In a shadow DOM the first element of the path is more accurate
  var target = e.path ? e.path[0] : e.target;
  return target.type == 'textarea' || target.type == 'text' ||
         target.type == 'number' || target.type == 'email' ||
         target.type == 'password' || target.type == 'search' ||
         target.type == 'tel' || target.type == 'url' ||
         target.isContentEditable;
};

Blockly.Variables.variablesDB = {};

/**
 * Find all user-created variables.
 * @param {!Blockly.Block|!Blockly.Workspace} root Root block or workspace.
 * @return {!Array.<string>} Array of variable names.
 */
Blockly.Variables.allVariables = function(root) {
  var blocks;
  if (root.getDescendants) {
    // Root is Block.
    blocks = root.getDescendants();
  } else if (root.getAllBlocks) {
    // Root is Workspace.
    blocks = root.getAllBlocks();
  } else {
    throw 'Not Block or Workspace: ' + root;
  }
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var i = 0; i < blocks.length; i++) {
    var blockVariables = blocks[i].getVars();
    for (var j = 0; j < blockVariables.length; j++) {
      var varName = blockVariables[j];
      // Variable name may be null if the block is only half-built.
      if (varName) {
        variableHash[varName.toLowerCase()] = varName;
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var name in variableHash) {
    variableList.push(variableHash[name]);
  }
  if (Blockly.Variables.variablesDB[root.id]) {
      variableList = variableList.concat(Blockly.Variables.variablesDB[root.id]);
  }
  variableList = variableList.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
  return variableList;
};

Blockly.Variables.addVariable = function(variable, root) {
    if (!Blockly.Variables.variablesDB[root.id]) {
        Blockly.Variables.variablesDB[root.id] = [];
    }
    if (Blockly.Variables.variablesDB[root.id].indexOf(variable) === -1) {
        Blockly.Variables.variablesDB[root.id].push(variable);
    }
};

Blockly.Flyout.blocks = {};
Blockly.Workspace.prototype.getFlyoutBlockByType = (type) => {
    return Blockly.Flyout.blocks[type];
};

/**
 * Initializes the flyout.
 * @param {!Blockly.Workspace} targetWorkspace The workspace in which to create
 *     new blocks.
 */
Blockly.Flyout.prototype.init = function(targetWorkspace) {
    var svg = targetWorkspace.getParentSvg(),
        container = svg.parentNode,
        triangle = document.createElement('div');

    triangle.className = 'blocklyTriangle';
    triangle.setAttribute('id', 'blocklyTriangle');

    container.appendChild(triangle);

    this.triangle = triangle;

    this.targetWorkspace_ = targetWorkspace;
    this.workspace_.targetWorkspace = targetWorkspace;
    // Add scrollbar.
    this.scrollbar_ = new Blockly.Scrollbar(this.workspace_, this.horizontalLayout_, false);

    this.hide();

    Array.prototype.push.apply(this.eventWrappers_, Blockly.bindEvent_(this.svgGroup_, 'wheel', this, this.wheel_));
    if (!this.autoClose) {
        this.filterWrapper_ = this.filterForCapacity_.bind(this);
        this.targetWorkspace_.addChangeListener(this.filterWrapper_);
    }
    // Dragging the flyout up and down.
    Array.prototype.push.apply(this.eventWrappers_, Blockly.bindEvent_(this.svgGroup_, 'mousedown', this, this.onMouseDown_));
};

/**
 * Hide and empty the flyout.
 */
Blockly.Flyout.prototype.hide = function() {
  if (!this.isVisible()) {
    return;
  }
  if (this.animation) {
      this.animation.cancel();
  }
  var translate = this.svgGroup_.style.webkitTransform || this.svgGroup_.style.transform;
  var origin = this.trianglePos_;
  this.svgGroup_.style.transformOrigin = `left ${origin}px`;
  this.animation = this.svgGroup_.animate([{
      transform: `${translate} scale(1)`,
      opacity: 1
  },{
      transform: `${translate} scale(0.5)`,
      opacity: 0
  }], {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
  });
  this.animation.finished.then(() => {
      this.svgGroup_.style.display = 'none';
  }).catch(() => {
      return;
  });
  // Delete all the event listeners.
  for (var x = 0, listen; listen = this.listeners_[x]; x++) {
    Blockly.unbindEvent_(listen);
  }
  this.listeners_.length = 0;
  if (this.reflowWrapper_) {
    this.workspace_.removeChangeListener(this.reflowWrapper_);
    this.reflowWrapper_ = null;
  }
  // Do NOT delete the blocks here.  Wait until Flyout.show.
  // https://neil.fraser.name/news/2014/08/09/
};

/**
 * Show and populate the flyout.
 * @param {!Array|string} xmlList List of blocks to show.
 *     Variables and procedures have a custom set of blocks.
 */
Blockly.Flyout.prototype.show = function(xmlList) {
  this.hide();
  this.clearOldBlocks_();

  if (xmlList == Blockly.Variables.NAME_TYPE) {
    // Special category for variables.
    xmlList =
        Blockly.Variables.flyoutCategory(this.workspace_.targetWorkspace);
  } else if (xmlList == Blockly.Procedures.NAME_TYPE) {
    // Special category for procedures.
    xmlList =
        Blockly.Procedures.flyoutCategory(this.workspace_.targetWorkspace);
  }

  this.svgGroup_.style.display = 'block';
  // Create the blocks to be shown in this flyout.
  var blocks = [];
  var gaps = [];
  this.permanentlyDisabled_.length = 0;
  for (var i = 0, xml; xml = xmlList[i]; i++) {
    if (xml.tagName && xml.tagName.toUpperCase() == 'BLOCK') {
      var curBlock = Blockly.Xml.domToBlock(xml, this.workspace_);
      if (curBlock.disabled) {
        // Record blocks that were initially disabled.
        // Do not enable these blocks as a result of capacity filtering.
        this.permanentlyDisabled_.push(curBlock);
      }
      blocks.push(curBlock);
      Blockly.Flyout.blocks[curBlock.type] = curBlock;
      var gap = parseInt(xml.getAttribute('gap'), 10);
      gaps.push(isNaN(gap) ? this.MARGIN * 3 : gap);
    }
  }

  this.layoutBlocks_(blocks, gaps);

  // IE 11 is an incompetent browser that fails to fire mouseout events.
  // When the mouse is over the background, deselect all blocks.
  var deselectAll = function() {
    var topBlocks = this.workspace_.getTopBlocks(false);
    for (var i = 0, block; block = topBlocks[i]; i++) {
      block.removeSelect();
    }
  };

  this.listeners_.push(Blockly.bindEvent_(this.svgBackground_, 'mouseover',
      this, deselectAll));

  if (this.horizontalLayout_) {
    this.height_ = 0;
  } else {
    this.width_ = 0;
  }
  this.reflow();

  this.filterForCapacity_();

  // Correctly position the flyout's scrollbar when it opens.
  this.position();
  var translate = this.svgGroup_.style.webkitTransform || this.svgGroup_.style.transform;
  var origin = this.trianglePos_;
  this.svgGroup_.style.transformOrigin = `left ${origin}px`;
  if (this.animation) {
      this.animation.cancel();
  }
  this.animation = this.svgGroup_.animate([{
      transform: `${translate} scale(0.5)`,
      opacity: 0
  }, {
      transform: `${translate} scale(1)`,
      opacity: 1
  }], {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
  });

  this.reflowWrapper_ = this.reflow.bind(this);
  this.workspace_.addChangeListener(this.reflowWrapper_);
};

/**
 * Move the toolbox to the edge of the workspace.
 */
Blockly.Flyout.prototype.position = function () {
    var toolbox, selectedItem, rowElement, containerRect, rect, metrics, m,
        height, middle, toolboxRect, offsetLeft, top;
    if (!this.isVisible()) {
        return;
    }
    if (!this.clipPath) {
        var defs = document.createElementNS(Blockly.SVG_NS, "defs");
        var path = document.createElementNS(Blockly.SVG_NS, "path");
        this.clipPath = document.createElementNS(Blockly.SVG_NS, "clipPath");
        this.clipPath.setAttributeNS(null, 'id', 'flyoutClipPath');
        this.clipPath.appendChild(path);
        this.clipPath.path = path;
        defs.appendChild(this.clipPath);
        this.svgGroup_.appendChild(defs);
        this.svgGroup_.style.clipPath = 'url(' + location.href + '#flyoutClipPath)';
    }

    metrics = this.targetWorkspace_.getMetrics();
    m = this.workspace_.getMetrics();
    height = m.contentHeight + 20;

    if (this.targetWorkspace_.toolbox_) {
        toolbox = this.targetWorkspace_.toolbox_;
        selectedItem = toolbox.selectedItem_;

        rowElement = selectedItem.getRowElement();
        containerRect = toolbox.HtmlDiv.getBoundingClientRect();
        rect = rowElement.getBoundingClientRect();
        middle = rect.top - containerRect.top + (rect.height / 2);
        this.trianglePos_ = middle - this.top_;

        toolboxRect = toolbox.HtmlDiv.getBoundingClientRect();
        offsetLeft = toolboxRect.width + 30;
    } else {
        middle = 0;
        offsetLeft = 2;
    }
    if (!metrics) {
        // Hidden components will return null.
        return;
    }
    var edgeWidth = this.width_ - this.CORNER_RADIUS + 10;
    if (this.RTL) {
        edgeWidth *= -1;
    }
    height = Math.min(metrics.viewHeight - 40, Math.max(0, height));

    top = middle - height / 2;

    if (top + height > (metrics.viewHeight - 20)) {
        top = (metrics.viewHeight - 20) - height;
    }

    this.top_ = Math.max(top, 20);

    var path = ['M ' + (this.RTL ? this.width_ : 0) + ',0'];
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, -this.CORNER_RADIUS);
    path.push('h', edgeWidth);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, this.CORNER_RADIUS);
    path.push('v', height);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, this.CORNER_RADIUS);
    path.push('h', -edgeWidth);
    path.push('a', this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, -this.CORNER_RADIUS);
    if (this.targetWorkspace_.toolbox_) {
        path.push('v', -(height - this.trianglePos_ - 12));
        path.push('l', -10, -12);
        path.push('l', 10, -12);
    }
    path.push('z');
    this.svgBackground_.setAttribute('d', path.join(' '));

    this.svgGroup_.style.webkitTransform =
    this.svgGroup_.style.transform =
        `translate(${offsetLeft}px, ${this.top_}px)`;

    this.svgGroup_.setAttribute('transform', `translate(${offsetLeft}, ${this.top_})`);

    this.clipPath.path.setAttributeNS(null, 'd', path.join(' '));

    // Record the height for Blockly.Flyout.getMetrics_.
    this.height_ = height;

    // Update the scrollbar (if one exists).
    if (this.scrollbar_) {
        this.scrollbar_.resize();
    }
};

/**
 * Initializes the toolbox.
 */
Blockly.Toolbox.prototype.init = function() {
  var workspace = this.workspace_,
    svg = workspace.getParentSvg(),
    container = svg.parentNode;

  // Create an HTML container for the Toolbox menu.
  this.HtmlDiv = goog.dom.createDom('div', 'blocklyToolboxDiv');
  this.HtmlDiv.setAttribute('dir', workspace.RTL ? 'RTL' : 'LTR');
  container.appendChild(this.HtmlDiv);

  // Clicking on toolbar closes popups.
  Blockly.bindEvent_(this.HtmlDiv, 'mousedown', this,
      function(e) {
        if (Blockly.isRightButton(e) || e.target == this.HtmlDiv) {
          // Close flyout.
          Blockly.hideChaff(false);
        } else {
          // Just close popups.
          Blockly.hideChaff(true);
        }
      });
  var workspaceOptions = {
    disabledPatternId: workspace.options.disabledPatternId,
    parentWorkspace: workspace,
    RTL: workspace.RTL,
    horizontalLayout: workspace.horizontalLayout,
    toolboxPosition: workspace.options.toolboxPosition
  };
  /**
   * @type {!Blockly.Flyout}
   * @private
   */
  this.flyout_ = new Blockly.Flyout(workspaceOptions);
  goog.dom.insertSiblingAfter(this.flyout_.createDom(), workspace.svgGroup_);
  this.flyout_.init(workspace);

  this.config_['cleardotPath'] = workspace.options.pathToMedia + '1x1.gif';
  this.config_['cssCollapsedFolderIcon'] =
      'blocklyTreeIconClosed' + (workspace.RTL ? 'Rtl' : 'Ltr');
  var tree = new Blockly.Toolbox.TreeControl(this, this.config_);
  this.tree_ = tree;
  tree.setShowRootNode(false);
  tree.setShowLines(false);
  tree.setShowExpandIcons(false);
  tree.setSelectedItem(null);
  this.populate_(workspace.options.languageTree);
  tree.render(this.HtmlDiv);
  this.addColour_();
  this.HtmlDiv.addEventListener('scroll', (e) => {
      this.flyout_.position();
  });
  this.position();
};

/**
 * Move the toolbox to the edge.
 */
Blockly.Toolbox.prototype.position = function() {
    var treeDiv = this.HtmlDiv;
    if (!treeDiv) {
        // Not initialized yet.
        return;
    }
    var svg = this.workspace_.getParentSvg();
    var svgPosition = goog.style.getPageOffset(svg);
    var svgSize = Blockly.svgSize(svg);
    if (this.workspace_.RTL) {
        treeDiv.style.left =
            (svgPosition.x + svgSize.width - treeDiv.offsetWidth) + 'px';
    } else {
        treeDiv.style.left = svgPosition.x + 'px';
    }
    treeDiv.style.top = '0px';
    treeDiv.style.left = '20px';
    treeDiv.style.paddingTop = '20px';
    treeDiv.style.paddingBottom = '20px';
    treeDiv.style.boxSizing = 'border-box';
    treeDiv.style.width = '110px';
    treeDiv.style.maxHeight = '100%';
    this.width = treeDiv.offsetWidth;
    if (!this.workspace_.RTL) {
        // For some reason the LTR toolbox now reports as 1px too wide.
        this.width -= 1;
    }
    this.flyout_.position();
};
Blockly.Toolbox.prototype.addColour_ = function(opt_tree) {
    var tree = opt_tree || this.tree_;
    var children = tree.getChildren();
    var next, previous;
    for (var i = 0, child; child = children[i]; i++) {
        var element = child.getRowElement();
        if (element) {
            if (element.classList.contains('blocklyTreeRow')) {
                next = element.parentNode.nextSibling;
                previous = element.parentNode.previousSibling;
                if (!next || next.classList.contains('goog-tree-item') || next.getAttribute('role') !== "treeitem") {
                    element.style.borderBottomLeftRadius = '8px';
                    element.style.borderBottomRightRadius = '8px';
                }
                if (!previous || previous.classList.contains('goog-tree-item') || previous.getAttribute('role') !== "treeitem") {
                    element.style.borderTopLeftRadius = '8px';
                    element.style.borderTopRightRadius = '8px';
                }
            }
            element.style.background = (child.hexColour || '#ddd');
        }
        this.addColour_(child);
    }
};

Blockly.Block.colourCache = {};

/**
 * Change the colour of a block.
 * @param {number|string} colour HSV hue value, or #RRGGBB string.
 */
Blockly.Block.prototype.setColour = function(colour) {
    var hslRegex = /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\).*/,
        hue = parseFloat(colour);

    if (Blockly.Block.colourCache[colour]) {
        colour = Blockly.Block.colourCache[colour];
    } else {
        var m = colour.match(hslRegex),
            newColour;
        if (m) {
            newColour = hslToRgb(parseInt(m[1], 10) / 360, parseInt(m[2], 10) / 100, parseInt(m[3], 10) / 100);
            newColour = '#' + rgbToHex(Math.round(newColour[0]), Math.round(newColour[1]), Math.round(newColour[2]));
            Blockly.Block.colourCache[colour] = newColour;
            colour = newColour;
        }
    }

    if (!isNaN(hue)) {
        this.colour_ = Blockly.hueToRgb(hue);
    } else {
        this.colour_ = colour;
    }
    if (this.rendered) {
        this.updateColour();
    }
};

Blockly.Events.DROP_BLOCK = 'drop-block';
Blockly.Events.OPEN_FLYOUT = 'open-flyout';
Blockly.Events.CLOSE_FLYOUT = 'close-flyout';

/**
 * Display/hide the flyout when an item is selected.
 * @param {goog.ui.tree.BaseNode} node The item to select.
 * @override
 */
Blockly.Toolbox.TreeControl.prototype.setSelectedItem = function(node) {
    var toolbox = this.toolbox_,
        hexColour,
        containerRect,
        rect,
        rowElement;
    if (node == this.selectedItem_ || node == toolbox.tree_) {
        return;
    }
    if (toolbox.lastCategory_) {

    }
    if (node) {
        toolbox.selectedItem_ = node;
        rowElement = node.getRowElement();
        hexColour = node.hexColour || '#57e';
        containerRect = toolbox.HtmlDiv.getBoundingClientRect();
        rect = rowElement.getBoundingClientRect();
        rowElement.style.background = hexColour;
        rowElement.className += ' selected';

        // Add colours to child nodes which may have been collapsed and thus
        // not rendered.
        toolbox.addColour_(node);
        let e = {
            type: Blockly.Events.OPEN_FLYOUT,
            categoryId: node.categoryId
        };
        toolbox.workspace_.fireChangeListener(e);
    }
    goog.ui.tree.TreeControl.prototype.setSelectedItem.call(this, node);
    if (node && node.blocks && node.blocks.length) {
        toolbox.flyout_.show(node.blocks);
        // Scroll the flyout to the top if the category has changed.
        if (toolbox.lastCategory_ != node) {
            toolbox.flyout_.scrollToStart();
        }
    } else {
        let e = {
            type: Blockly.Events.CLOSE_FLYOUT
        };
        toolbox.workspace_.fireChangeListener(e);
        // Hide the flyout.
        toolbox.flyout_.hide();
    }
    if (node) {
        toolbox.lastCategory_ = node;
    }
};

Blockly.Toolbox.CategoryElements = {};

Blockly.Workspace.prototype.getCategoryElementById = (id) => {
    return Blockly.Toolbox.CategoryElements[id];
};

/**
 * Fill the toolbox with categories and blocks.
 * @param {Node} newTree DOM tree of blocks, or null.
 * @private
 */
Blockly.Toolbox.prototype.populate_ = function(newTree) {
  var rootOut = this.tree_;
  rootOut.removeChildren();  // Delete any existing content.
  rootOut.blocks = [];
  var hasColours = false;
  function syncTrees(treeIn, treeOut) {
    var lastElement = null;
    for (var i = 0, childIn; childIn = treeIn.childNodes[i]; i++) {
      if (!childIn.tagName) {
        // Skip over text.
        continue;
      }
      switch (childIn.tagName.toUpperCase()) {
        case 'CATEGORY':
          var childOut = rootOut.createNode(childIn.getAttribute('name').toLowerCase()),
            catId = childIn.getAttribute('id');
          childOut.blocks = [];
          childOut.categoryId = catId;
          treeOut.add(childOut);
          Blockly.Toolbox.CategoryElements[catId] = childOut.getRowElement();
          var custom = childIn.getAttribute('custom');
          if (custom) {
            // Variables and procedures are special dynamic categories.
            childOut.blocks = custom;
          } else {
            syncTrees(childIn, childOut);
          }
          var colour = childIn.getAttribute('colour');
          if (goog.isString(colour)) {
            if (colour.match(/^#[0-9a-fA-F]{6}$/)) {
              childOut.hexColour = colour;
            } else {
              childOut.hexColour = Blockly.hueToRgb(colour);
            }
            hasColours = true;
          } else {
            childOut.hexColour = '';
          }
          if (childIn.getAttribute('expanded') == 'true') {
            if (childOut.blocks.length) {
              rootOut.setSelectedItem(childOut);
            }
            childOut.setExpanded(true);
          } else {
            childOut.setExpanded(false);
          }
          lastElement = childIn;
          break;
        case 'SEP':
          if (lastElement) {
            if (lastElement.tagName.toUpperCase() == 'CATEGORY') {
              // Separator between two categories.
              // <sep></sep>
              treeOut.add(new Blockly.Toolbox.TreeSeparator());
            } else {
              // Change the gap between two blocks.
              // <sep gap="36"></sep>
              // The default gap is 24, can be set larger or smaller.
              // Note that a deprecated method is to add a gap to a block.
              // <block type="math_arithmetic" gap="8"></block>
              var newGap = parseFloat(childIn.getAttribute('gap'));
              if (!isNaN(newGap)) {
                var oldGap = parseFloat(lastElement.getAttribute('gap'));
                var gap = isNaN(oldGap) ? newGap : oldGap + newGap;
                lastElement.setAttribute('gap', gap);
              }
            }
          }
          break;
        case 'BLOCK':
        case 'SHADOW':
          treeOut.blocks.push(childIn);
          lastElement = childIn;
          break;
      }
    }
  }
  syncTrees(newTree, this.tree_);
  this.hasColours_ = hasColours;

  if (rootOut.blocks.length) {
    throw 'Toolbox cannot have both blocks and categories in the root level.';
  }

  // Fire a resize event since the toolbox may have changed width and height.
  Blockly.resizeSvgContents(this.workspace_);
};

/**
 * Create a copy of this block on the workspace.
 * @param {!Blockly.Block} originBlock The flyout block to copy.
 * @return {!Function} Function to call when block is clicked.
 * @private
 */
Blockly.Flyout.prototype.createBlockFunc_ = function(originBlock) {
  var flyout = this;
  var workspace = this.targetWorkspace_;
  return function(e) {
    if (Blockly.isRightButton(e)) {
      // Right-click.  Don't create a block, let the context menu show.
      return;
    }
    if (originBlock.disabled) {
      // Beyond capacity.
      return;
    }
    Blockly.Events.disable();
    // Create the new block by cloning the block in the flyout (via XML).
    var xml = Blockly.Xml.blockToDom(originBlock);
    var block = Blockly.Xml.domToBlock(xml, workspace);
    // Place it in the same spot as the flyout copy.
    var svgRootOld = originBlock.getSvgRoot();
    if (!svgRootOld) {
      throw 'originBlock is not rendered.';
    }
    var xyOld = Blockly.getSvgXY_(svgRootOld, workspace);
    // Scale the scroll (getSvgXY_ did not do this).
    if (flyout.RTL) {
      var width = workspace.getMetrics().viewWidth - flyout.width_;
      xyOld.x += width / workspace.scale - width;
    } else {
      xyOld.x += flyout.workspace_.scrollX / flyout.workspace_.scale -
          flyout.workspace_.scrollX;
    }
    xyOld.y += flyout.workspace_.scrollY / flyout.workspace_.scale -
        flyout.workspace_.scrollY;
    var svgRootNew = block.getSvgRoot();
    if (!svgRootNew) {
      throw 'block is not rendered.';
    }
    var xyNew = Blockly.getSvgXY_(svgRootNew, workspace);
    // Scale the scroll (getSvgXY_ did not do this).
    xyNew.x += workspace.scrollX / workspace.scale - workspace.scrollX;
    xyNew.y += workspace.scrollY / workspace.scale - workspace.scrollY;
    if (workspace.toolbox_ && !workspace.scrollbar) {
      xyNew.x += workspace.toolbox_.width / workspace.scale;
    }
    block.moveBy(xyOld.x - xyNew.x, xyOld.y - xyNew.y);
    Blockly.Events.enable();
    if (Blockly.Events.isEnabled() && !block.isShadow()) {
      Blockly.Events.fire(new Blockly.Events.Create(block));
    }
    if (flyout.autoClose) {
      flyout.hide();
    } else {
      flyout.filterForCapacity_();
    }
    // Start a dragging operation on the new block.
    block.onMouseDown_(e);
    block.setColour(originBlock.getColour());
  };
};

/**
 * Overrides Blockly color computation to use HEX colors instead of
 * fixed saturation and value
 */
Blockly.hueToRgb = function(color) {
    return color;
};



// UI constants for rendering blocks.
/**
 * Horizontal space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 10;
/**
 * Vertical space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_Y = 10;
/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_Y = 5;
/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 25;
/**
 * Height of horizontal puzzle tab.
 * @const
 */
Blockly.BlockSvg.TAB_HEIGHT = 20;
/**
 * Width of horizontal puzzle tab.
 * @const
 */
Blockly.BlockSvg.TAB_WIDTH = 8;
/**
 * Width of vertical tab (inc left margin).
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 30;
/**
 * Rounded corner radius.
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 4;
/**
 * Do blocks with no previous or output connections have a 'hat' on top?
 * @const
 */
Blockly.BlockSvg.START_HAT = false;
/**
 * Path of the top hat's curve.
 * @const
 */
Blockly.BlockSvg.START_HAT_PATH = 'c 30,-15 70,-15 100,0';
/**
 * Path of the top hat's curve's highlight in LTR.
 * @const
 */
Blockly.BlockSvg.START_HAT_HIGHLIGHT_LTR =
    'c 17.8,-9.2 45.3,-14.9 75,-8.7 M 100.5,0.5';
/**
 * Path of the top hat's curve's highlight in RTL.
 * @const
 */
Blockly.BlockSvg.START_HAT_HIGHLIGHT_RTL =
    'm 25,-8.7 c 29.7,-6.2 57.2,-0.5 75,8.7';
/**
 * Distance from shape edge to intersect with a curved corner at 45 degrees.
 * Applies to highlighting on around the inside of a curve.
 * @const
 */
Blockly.BlockSvg.DISTANCE_45_INSIDE = (1 - Math.SQRT1_2) *
      (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + 0.5;
/**
 * Distance from shape edge to intersect with a curved corner at 45 degrees.
 * Applies to highlighting on around the outside of a curve.
 * @const
 */
Blockly.BlockSvg.DISTANCE_45_OUTSIDE = (1 - Math.SQRT1_2) *
      (Blockly.BlockSvg.CORNER_RADIUS + 0.5) - 0.5;
/**
* SVG path for drawing next/previous notch from left to right.
* @const
*/
Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l 1,0 3,5 q 2.5 2.5 5 0 l 3,-5 l 3, 0';

/**
 * SVG path for drawing next/previous notch from left to right with
 * highlighting.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT = 'l 8,6 8,-6';
/**
 * SVG path for drawing next/previous notch from right to left.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l -2,0 -3,5 q -2.5 2.5 -5 0 l -3,-5 l -2, 0';
/**
 * SVG path for drawing jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH = 'l 8,0 0,4 8,4 -16,8 8,4';
/**
 * Height of SVG path for jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH_HEIGHT = 20;
/**
 * Width of SVG path for jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH_WIDTH = 15;
/**
 * SVG path for drawing a horizontal puzzle tab from top to bottom.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN = 'v 6 c 0,8 -' + Blockly.BlockSvg.TAB_WIDTH +
    ',-4 -' + Blockly.BlockSvg.TAB_WIDTH + ',6 s ' +
    Blockly.BlockSvg.TAB_WIDTH + ',-2.5 ' + Blockly.BlockSvg.TAB_WIDTH + ',6 v 2';

/**
 * SVG path for drawing a horizontal puzzle tab from top to bottom with
 * highlighting from the upper-right.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL = 'v 6.5 m -' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.97) + ',3 q -' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.05) + ',10 ' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.3) + ',9.5 m ' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.67) + ',-1.9 v 1.4';

/**
 * SVG path for drawing the top-left corner of a statement input.
 * Includes the top notch, a horizontal space, and the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
    Blockly.BlockSvg.NOTCH_PATH_RIGHT + ' h -' +
    (Blockly.BlockSvg.NOTCH_WIDTH - 15 - Blockly.BlockSvg.CORNER_RADIUS) +
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the bottom-left corner of a statement input.
 * Includes the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing highlight on the top-left corner of a statement
 * input in RTL.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER_HIGHLIGHT_RTL =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    (-Blockly.BlockSvg.DISTANCE_45_OUTSIDE - 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS -
    Blockly.BlockSvg.DISTANCE_45_OUTSIDE);


Blockly.BlockSvg.TOP_LEFT_CORNER_START = `m 0, 4`;
/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
    'A ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ', 0';
/**
 * SVG path for drawing highlight on the bottom-left corner of a statement
 * input in RTL.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_RTL =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ' 0 0,0 ' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5);
/**
 * SVG path for drawing highlight on the bottom-left corner of a statement
 * input in LTR.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ' 0 0,0 ' +
    (Blockly.BlockSvg.CORNER_RADIUS -
    Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
    (Blockly.BlockSvg.DISTANCE_45_OUTSIDE + 0.5);


/**
 * Render the left edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} highlightSteps Path of block highlights.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawLeft_ =
    function(steps, highlightSteps, connectionsXY, cursorY) {
  if (this.outputConnection) {
    // Create output connection.
    this.outputConnection.setOffsetInBlock(0, 0);
    // This connection will be tightened when the parent renders.
    steps.push('V', Blockly.BlockSvg.TAB_HEIGHT - 2);
    steps.push('c 0,-8 -' + Blockly.BlockSvg.TAB_WIDTH + ',4 -' +
        Blockly.BlockSvg.TAB_WIDTH + ',-6 s ' + Blockly.BlockSvg.TAB_WIDTH +
        ',2.5 ' + Blockly.BlockSvg.TAB_WIDTH + ',-6, v -1.5');

    if (this.RTL) {
      highlightSteps.push('M', (Blockly.BlockSvg.TAB_WIDTH * -0.25) + ',8.4');
      highlightSteps.push('l', (Blockly.BlockSvg.TAB_WIDTH * -0.45) + ',-2.1');
    } else {
      highlightSteps.push('V', Blockly.BlockSvg.TAB_HEIGHT - 1.5);
      highlightSteps.push('m', (Blockly.BlockSvg.TAB_WIDTH * -0.92) +
                          ',-0.5 q ' + (Blockly.BlockSvg.TAB_WIDTH * -0.19) +
                          ',-5.5 0,-11');
      highlightSteps.push('m', (Blockly.BlockSvg.TAB_WIDTH * 0.92) +
                          ',1 V 0.5 H 1');
    }
    this.width += Blockly.BlockSvg.TAB_WIDTH;
  } else if (!this.RTL) {
    if (this.squareTopLeftCorner_) {
      // Statement block in a stack.
      highlightSteps.push('V', 0.5);
    } else {
      highlightSteps.push('V', Blockly.BlockSvg.CORNER_RADIUS);
    }
  }
  steps.push('z');
};



    /**
     * Create the zoom controls.
     * @return {!Element} The zoom controls SVG group.
     */
    Blockly.ZoomControls.prototype.createDom = function() {
      var workspace = this.workspace_;
      /* Here's the markup that will be generated:
      <g class="blocklyZoom">
        <clippath id="blocklyZoomoutClipPath837493">
          <rect width="32" height="32" y="77"></rect>
        </clippath>
        <image width="96" height="124" x="-64" y="-15" xlink:href="media/sprites.png"
            clip-path="url(#blocklyZoomoutClipPath837493)"></image>
        <clippath id="blocklyZoominClipPath837493">
          <rect width="32" height="32" y="43"></rect>
        </clippath>
        <image width="96" height="124" x="-32" y="-49" xlink:href="media/sprites.png"
            clip-path="url(#blocklyZoominClipPath837493)"></image>
        <clippath id="blocklyZoomresetClipPath837493">
          <rect width="32" height="32"></rect>
        </clippath>
        <image width="96" height="124" y="-92" xlink:href="media/sprites.png"
            clip-path="url(#blocklyZoomresetClipPath837493)"></image>
      </g>
      */
      this.svgGroup_ = Blockly.createSvgElement('g',
          {'class': 'blocklyZoom'}, null);
      var rnd = String(Math.random()).substring(2);

      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyZoomoutClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': 32, 'height': 32, 'y': 77},
          clip);
      var zoomoutSvg = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height, 'x': -64,
           'y': -15,
           'clip-path': 'url(' + location.href + '#blocklyZoomoutClipPath' + rnd + ')'},
          this.svgGroup_);
      zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyZoominClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': 32, 'height': 32, 'y': 43},
          clip);
      var zoominSvg = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height,
           'x': -32,
           'y': -49,
           'clip-path': 'url(' + location.href + '#blocklyZoominClipPath' + rnd + ')'},
          this.svgGroup_);
      zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyZoomresetClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': 32, 'height': 32},
          clip);
      var zoomresetSvg = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height, 'y': -92,
           'clip-path': 'url(' + location.href + '#blocklyZoomresetClipPath' + rnd + ')'},
          this.svgGroup_);
      zoomresetSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      // Attach event listeners.
      Blockly.bindEvent_(zoomresetSvg, 'mousedown',  workspace, workspace.zoomReset);
      Blockly.bindEvent_(zoominSvg, 'mousedown', null, function(e) {
        workspace.zoomCenter(1);
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
      });
      Blockly.bindEvent_(zoomoutSvg, 'mousedown', null, function(e) {
        workspace.zoomCenter(-1);
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
      });

      return this.svgGroup_;
    };



    /**
     * Create the trash can elements.
     * @return {!Element} The trash can's SVG group.
     */
    Blockly.Trashcan.prototype.createDom = function() {
      /* Here's the markup that will be generated:
      <g class="blocklyTrash">
        <clippath id="blocklyTrashBodyClipPath837493">
          <rect width="47" height="45" y="15"></rect>
        </clippath>
        <image width="64" height="92" y="-32" xlink:href="media/sprites.png"
            clip-path="url(#blocklyTrashBodyClipPath837493)"></image>
        <clippath id="blocklyTrashLidClipPath837493">
          <rect width="47" height="15"></rect>
        </clippath>
        <image width="84" height="92" y="-32" xlink:href="media/sprites.png"
            clip-path="url(#blocklyTrashLidClipPath837493)"></image>
      </g>
      */
      this.svgGroup_ = Blockly.createSvgElement('g',
          {'class': 'blocklyTrash'}, null);
      var rnd = String(Math.random()).substring(2);
      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyTrashBodyClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.BODY_HEIGHT_,
           'y': this.LID_HEIGHT_},
          clip);
      var body = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashBodyClipPath' + rnd + ')'},
          this.svgGroup_);
      body.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.createSvgElement('clipPath',
          {'id': 'blocklyTrashLidClipPath' + rnd},
          this.svgGroup_);
      Blockly.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.LID_HEIGHT_}, clip);
      this.svgLid_ = Blockly.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashLidClipPath' + rnd + ')'},
          this.svgGroup_);
      this.svgLid_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      Blockly.bindEvent_(this.svgGroup_, 'mouseup', this, this.click);
      this.animateLid_();
      return this.svgGroup_;
    };

/**
* Event handler for a change in variable name.
* Special case the 'New variable...' and 'Rename variable...' options.
* In both of these special cases, prompt the user for a new name.
* @param {string} text The selected dropdown menu option.
* @return {null|undefined|string} An acceptable new variable name, or null if
*     change is to be either aborted (cancel button) or has been already
*     handled (rename), or undefined if an existing variable was chosen.
* @this {!Blockly.FieldVariable}
*/
Blockly.FieldVariable.dropdownChange = function(text) {
    // Default prompt behavior from Blockly
    function defaultPromptFunction (promptText, defaultText) {
        return Promise.resolve(window.prompt(promptText, defaultText));
    }
    var workspace = this.sourceBlock_.workspace,
        // Get optional custom prompt behavior
        promptFunction = workspace.options.modalFunction || defaultPromptFunction,
        // generate new name for 'New variable...'
        newVarName = Blockly.Variables.generateUniqueName(workspace),
        // Get current value
        oldVar = this.getText();
    // Callback of the async prompt
    function promptCallback(newVar) {
        Blockly.hideChaff();
        // Merge runs of whitespace.  Strip leading and trailing whitespace.
        // Beyond this, all names are legal.
        if (newVar) {
            newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
            if (newVar == Blockly.Msg.RENAME_VARIABLE || newVar == Blockly.Msg.NEW_VARIABLE) {
                // Ok, not ALL names are legal...
                newVar = null;
            }
        }
        if (text == Blockly.Msg.RENAME_VARIABLE) {
            Blockly.Variables.renameVariable(oldVar, newVar, workspace);
        } else if (text == Blockly.Msg.NEW_VARIABLE) {
            // If the prompt was canceled, restore old value
            newVar = newVar || oldVar;
            Blockly.Variables.renameVariable(newVarName, newVar, workspace);
        }
    }
    if (text == Blockly.Msg.RENAME_VARIABLE) {
        promptFunction(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar).then(promptCallback);
        return null;
    } else if (text == Blockly.Msg.NEW_VARIABLE) {
        promptFunction(Blockly.Msg.NEW_VARIABLE_TITLE, '').then(promptCallback);
        // Preemptively update the value to simulate a sync behavior. Will be renamed by the callback
        return newVarName;
    }
    return undefined;
};

Blockly.setPhantomBlock = function (connection, targetBlock) {
    let sourceBlock = connection.getSourceBlock(),
        targetConnection = targetBlock.outputConnection ? targetBlock.outputConnection : targetBlock.previousConnection,
        phantomSvgGroup = document.createElementNS(Blockly.SVG_NS, 'g'),
        phantomSvgPath = document.createElementNS(Blockly.SVG_NS, 'path'),
        phantomSvgText = document.createElementNS(Blockly.SVG_NS, 'text'),
        dx = connection.x_ - (targetConnection.x_ - targetBlock.dragStartXY_.x),
        dy = connection.y_ - (targetConnection.y_ - targetBlock.dragStartXY_.y),
        xy = sourceBlock.getRelativeToSurfaceXY(),
        position = {
            x: dx - xy.x,
            y: dy - xy.y
        },
        breathingAnimation;

    phantomSvgPath.setAttribute('d', targetBlock.svgPath_.getAttribute('d'));
    phantomSvgPath.setAttribute('fill', targetBlock.getColour());
    phantomSvgPath.setAttribute('fill-opacity', 0.25);
    phantomSvgPath.setAttribute('stroke', targetBlock.getColour());
    phantomSvgPath.setAttribute('stroke-width', 1);
    phantomSvgPath.setAttribute('stroke-dasharray', 6);

    phantomSvgGroup.appendChild(phantomSvgPath);
    phantomSvgGroup.appendChild(phantomSvgText);
    phantomSvgGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);

    Blockly.removePhantomBlock();

    sourceBlock.svgGroup_.appendChild(phantomSvgGroup);

    phantomSvgGroup.animate([{
        opacity: 0
    }, {
        opacity: 1
    }], {
        duration: 400,
        easing: 'ease-out'
    });

    breathingAnimation = phantomSvgGroup.animate([{
        opacity: 0.7
    }, {
        opacity: 1
    }, {
        opacity: 0.7
    }], {
        delay: 400,
        duration: 1200,
        easing: 'ease-in-out',
        iterations: Infinity
    });

    Blockly.phantomBlock_ = {
        svgRoot: phantomSvgGroup,
        position,
        animation: breathingAnimation
    };
};

Blockly.removePhantomBlock = function (connection, targetBlock) {
    if (Blockly.phantomBlock_) {
        let translate = `translate(${Blockly.phantomBlock_.position.x}px, ${Blockly.phantomBlock_.position.y}px)`,
            root = Blockly.phantomBlock_.svgRoot;
        // Stop the breathing animation
        Blockly.phantomBlock_.animation.cancel();
        root.style.transformOrigin = 'center center';
        root.animate([{
            transform: `${translate} scale(1)`,
            opacity: 1
        }, {
            transform: `${translate} scale(4)`,
            opacity: 0
        }], {
            duration: 300,
            easing: 'ease-in'
        }).finished.then(() => {
            root.parentNode.removeChild(root);
        });
        Blockly.phantomBlock_ = null;
    }
};
