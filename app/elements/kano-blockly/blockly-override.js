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

if (location.search.match('lookup=true')) {
    Blockly.SEARCH_PLUS_ENABLED = true;
}

const FIELD_COLORS = {
    "black": "#000000",
    "darkgrey": "#213542",
    "steelgrey": "#596870",
    "lightgrey": "#bdccd4",
    "white": "#ffffff",
    "red": "#f6412c",
    "darkorange": "#ff5505",
    "orange": "#ff6b00",
    "lightorange": "#ff9800",
    "darkyellow": "#ffc101",
    "yellow": "#ffec14",
    "ligthgreen": "#ccdd1e",
    "green": "#88c440",
    "forestgreen": "#46af4b",
    "aquamarine": "#019687",
    "cyan": "#01bbd5",
    "blue": "#00a6f6",
    "darkblue": "#3d4db7",
    "darkpurple": "#6633b9",
    "purple": "#9c1ab1",
    "magenta": "#eb1360",
    "pink": "#ff2c82"
};

Blockly.FieldColour.COLOUR_NAMES = Object.keys(FIELD_COLORS);
Blockly.FieldColour.HEX_REGEXP = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
if (Blockly.SEARCH_PLUS_ENABLED) {
    Blockly.FieldColour.COLOURS = Blockly.FieldColour.COLOUR_NAMES.map(key => FIELD_COLORS[key]);
    Blockly.FieldColour.COLUMNS = 7;
}

// Reload the custom messages as Blockly overrides them
if (window.CustomBlocklyMsg) {
    Object.assign(Blockly.Msg, window.CustomBlocklyMsg);
}

Blockly.isAnimationsDisabled = function () {
    return false;
};

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
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 * @private
 */
Blockly.utils.isTargetInput = function(e) {
  // In a shadow DOM the first element of the path is more accurate
  var target = e.path ? e.path[0] : e.target;
  return target.type == 'textarea' || target.type == 'text' ||
         target.type == 'number' || target.type == 'email' ||
         target.type == 'password' || target.type == 'search' ||
         target.type == 'tel' || target.type == 'url' ||
         target.isContentEditable;
};

Blockly.Variables.variablesDB = {};


Blockly.Variables.allUsedVariables = function(root) {
  var blocks;
  if (root instanceof Blockly.Block) {
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
  for (var x = 0; x < blocks.length; x++) {
    var blockVariables = blocks[x].getVars();
    if (blockVariables) {
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          variableHash[varName.toLowerCase()] = varName;
        }
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

Blockly.getSvgXY_ = function(element, workspace) {
  var x = 0;
  var y = 0;
  var scale = 1;
  if (goog.dom.contains(workspace.getCanvas(), element) ||
      goog.dom.contains(workspace.getBubbleCanvas(), element)) {
    // Before the SVG canvas, scale the coordinates.
    scale = workspace.scale;
  }
  do {
    if (!element.getAttribute) {
        break;
    } 
    // Loop through this block and every parent.
    var xy = Blockly.utils.getRelativeXY(element);
    if (element == workspace.getCanvas() ||
        element == workspace.getBubbleCanvas()) {
      // After the SVG canvas, don't scale the coordinates.
      scale = 1;
    }
    x += xy.x * scale;
    y += xy.y * scale;
    element = element.parentNode;
  } while (element && element != workspace.getParentSvg());
  return new goog.math.Coordinate(x, y);
};

/**
 * Move the zoom controls to the bottom-right corner.
 */
Blockly.ZoomControls.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  this.left_ = metrics.viewWidth + metrics.absoluteLeft - this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

  this.top_ = 0;
  this.svgGroup_.setAttribute('transform', 'translate(' + this.left_ + ',' + this.top_ + ')');
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

/**
 * Overrides Blockly color computation to use HEX colors instead of
 * fixed saturation and value
 */
Blockly.hueToRgb = function(color) {
    return color;
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
      this.svgGroup_ = Blockly.utils.createSvgElement('g',
          {'class': 'blocklyZoom'}, null);
      var rnd = String(Math.random()).substring(2);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyZoomoutClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': 32, 'height': 32, 'y': 77},
          clip);
      var zoomoutSvg = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height, 'x': -64,
           'y': -15,
           'clip-path': 'url(' + location.href + '#blocklyZoomoutClipPath' + rnd + ')'},
          this.svgGroup_);
      zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyZoominClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': 32, 'height': 32, 'y': 43},
          clip);
      var zoominSvg = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width,
           'height': Blockly.SPRITE.height,
           'x': -32,
           'y': -49,
           'clip-path': 'url(' + location.href + '#blocklyZoominClipPath' + rnd + ')'},
          this.svgGroup_);
      zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          workspace.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyZoomresetClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': 32, 'height': 32},
          clip);
      var zoomresetSvg = Blockly.utils.createSvgElement('image',
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
     * Move the zoom controls to the bottom-right corner.
     */
    Blockly.ZoomControls.prototype.position = function() {
        var metrics = this.workspace_.getMetrics();
        if (!metrics) {
            // There are no metrics available (workspace is probably not visible).
            return;
        }
        if (this.workspace_.RTL) {
            this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
            if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
            this.left_ += metrics.flyoutWidth;
            if (this.workspace_.toolbox_) {
                this.left_ += metrics.absoluteLeft;
            }
            }
        } else {
            this.left_ = metrics.viewWidth + metrics.absoluteLeft -
                this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

            if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
            this.left_ -= metrics.flyoutWidth;
            }
        }
        this.top_ = metrics.viewHeight + metrics.absoluteTop -
            this.HEIGHT_ - this.bottom_;
        if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
            this.top_ -= metrics.flyoutHeight;
        }
        this.svgGroup_.setAttribute('transform',
            'translate(' + this.left_ + ',' + this.top_ + ')');
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
      this.svgGroup_ = Blockly.utils.createSvgElement('g',
          {'class': 'blocklyTrash'}, null);
      var rnd = String(Math.random()).substring(2);
      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyTrashBodyClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.BODY_HEIGHT_,
           'y': this.LID_HEIGHT_},
          clip);
      var body = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashBodyClipPath' + rnd + ')'},
          this.svgGroup_);
      body.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      var clip = Blockly.utils.createSvgElement('clipPath',
          {'id': 'blocklyTrashLidClipPath' + rnd},
          this.svgGroup_);
      Blockly.utils.createSvgElement('rect',
          {'width': this.WIDTH_, 'height': this.LID_HEIGHT_}, clip);
      this.svgLid_ = Blockly.utils.createSvgElement('image',
          {'width': Blockly.SPRITE.width, 'height': Blockly.SPRITE.height, 'y': -32,
           'clip-path': 'url(' + location.href + '#blocklyTrashLidClipPath' + rnd + ')'},
          this.svgGroup_);
      this.svgLid_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          this.workspace_.options.pathToMedia + Blockly.SPRITE.url);

      Blockly.bindEvent_(this.svgGroup_, 'mouseup', this, this.click);
      this.animateLid_();
      return this.svgGroup_;
    };


Blockly.Variables.asyncPromptName = function (workspace, promptText, defaultText) {
    var promptFunction;
    // Default prompt behavior from Blockly
    function defaultPromptFunction (promptText, defaultText) {
        return Promise.resolve(Blockly.Variables.promptName(promptText, defaultText));
    }
    promptFunction = workspace.options.modalFunction || defaultPromptFunction;

    return promptFunction(promptText, defaultText).then((newVar) => {
        // Merge runs of whitespace.  Strip leading and trailing whitespace.
        // Beyond this, all names are legal.
        if (newVar) {
            newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
            if (newVar == Blockly.Msg.RENAME_VARIABLE ||
                newVar == Blockly.Msg.NEW_VARIABLE) {
            // Ok, not ALL names are legal...
            newVar = null;
            }
        }
        return newVar;
    });
};

/**
 * Create a new variable on the given workspace.
 * @param {!Blockly.Workspace} workspace The workspace on which to create the
 *     variable.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be aborted (cancel button), or undefined if an existing
 *     variable was chosen.
 */
Blockly.Variables.createVariable = function(workspace) {
    return Blockly.Variables.asyncPromptName(workspace, Blockly.Msg.NEW_VARIABLE_TITLE, '').then(text => {
        if (text) {
            workspace.createVariable(text);
        }
    });
};

/**
 * Event handler for a change in variable name.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be either aborted (cancel button) or has been already
 *     handled (rename), or undefined if an existing variable was chosen.
 */
Blockly.FieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  if (text == Blockly.Msg.RENAME_VARIABLE) {
    var oldVar = this.getText();
    Blockly.hideChaff();
    Blockly.Variables.asyncPromptName(workspace, Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar)
        .then(t => {
            if (text) {
            workspace.renameVariable(oldVar, t);
            }
        });
    return null;
  } else if (text == 'New variable') {
      Blockly.hideChaff();
      Blockly.Variables.asyncPromptName(workspace, 'Give your variable a name', oldVar)
          .then(t => {
              if (text) {
                workspace.createVariable(t);
                this.setValue(t);
              }
         });
      return null;
  } else if (text == Blockly.Msg.DELETE_VARIABLE.replace('%1', this.getText())) {
    workspace.deleteVariable(this.getText());
    return null;
  }
  return undefined;
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function() {
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
    var variableList = this.sourceBlock_.workspace.variableList.slice(0);
  } else {
    var variableList = [];
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && variableList.indexOf(name) == -1) {
    variableList.push(name);
  }
  variableList.sort(goog.string.caseInsensitiveCompare);
  variableList.push('New variable');
  variableList.push(Blockly.Msg.RENAME_VARIABLE);
  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var i = 0; i < variableList.length; i++) {
    options[i] = [variableList[i], variableList[i]];
  }
  return options;
};

/**
 * Handle a mouse up event on an editable field.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Field.prototype.onMouseUp_ = function(e) {
  if ((goog.userAgent.IPHONE || goog.userAgent.IPAD) &&
      !goog.userAgent.isVersionOrHigher('537.51.2') &&
      e.layerX !== 0 && e.layerY !== 0) {
    // Old iOS spawns a bogus event on the next touch after a 'prompt()' edit.
    // Unlike the real events, these have a layerX and layerY set.
    return;
  } else if (Blockly.utils.isRightButton(e)) {
    // Right-click.
    return;
  } else if (this.sourceBlock_.workspace.isDragging() || this.sourceBlock_.isInFlyout) {
    // Drag operation is concluding.  Don't open the editor.
    return;
  } else if (this.sourceBlock_.isEditable()) {
    // Non-abstract sub-classes must define a showEditor_ method.
    this.showEditor_();
    // The field is handling the touch, but we also want the blockSvg onMouseUp
    // handler to fire, so we will leave the touch identifier as it is.
    // The next onMouseUp is responsible for nulling it out.
  }
};

/**
 * Install this field on a block.
 */
Blockly.Field.prototype.init = function() {
  if (this.fieldGroup_) {
    // Field has already been initialized once.
    return;
  }
  // Build the DOM.
  this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
  if (!this.visible_) {
    this.fieldGroup_.style.display = 'none';
  }
  this.borderRect_ = Blockly.utils.createSvgElement('rect',
      {'rx': 2,
       'ry': 2,
       'x': -Blockly.BlockSvg.SEP_SPACE_X / 2,
       'y': 0,
       'height': 16}, this.fieldGroup_, this.sourceBlock_.workspace);
  /** @type {!Element} */
  this.textElement_ = Blockly.utils.createSvgElement('text',
      {'class': 'blocklyText', 'y': this.size_.height - 12.5},
      this.fieldGroup_);

  this.updateEditable();
  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
  this.mouseUpWrapper_ =
      Blockly.bindEventWithChecks_(this.fieldGroup_, 'mouseup', this,
      this.onMouseUp_);
  // Force a render.
  this.render_();
};

Blockly.setPhantomBlock = function (connection, targetBlock) {
    let sourceBlock = connection.getSourceBlock(),
        targetConnection = targetBlock.outputConnection ? targetBlock.outputConnection : targetBlock.previousConnection,
        phantomSvgGroup = document.createElementNS(Blockly.SVG_NS, 'g'),
        phantomSvgPath = document.createElementNS(Blockly.SVG_NS, 'path'),
        phantomSvgText = document.createElementNS(Blockly.SVG_NS, 'text'),
        xy = sourceBlock.getRelativeToSurfaceXY(),
        position = {},
        breathingAnimation, dx, dy;

    if (Blockly.dragMode_ !== 0) {
        dx = connection.x_ - (targetConnection.x_ - targetBlock.dragStartXY_.x);
        dy = connection.y_ - (targetConnection.y_ - targetBlock.dragStartXY_.y);
    } else {
        dx = connection.x_ - (targetConnection.x_ - targetBlock.getBoundingRectangle().topLeft.x) + 8;
        dy = connection.y_ - (targetConnection.y_ - targetBlock.getBoundingRectangle().topLeft.y);
    }
    position.x = dx - xy.x;
    position.y = dy - xy.y;

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

Blockly.Workspace.prototype.openOmnibox = function () {
    if (!this._omnibox) {
        var svg = this.getParentSvg();
        this._omniboxContainer = document.createElement('div');
        this._omniboxContainer.style.position = 'fixed';
        this._omniboxContainer.style.top = 0;
        this._omniboxContainer.style.left = 0;
        this._omniboxContainer.style.width = '100%';
        this._omniboxContainer.style.height = '100%';
        this._omniboxContainer.addEventListener('mousedown', (e) => {
            var target = e.path ? e.path[0] : e.target;
            if (target === this._omniboxContainer) {
                this.closeOmnibox();
            }
        });
        this._omnibox = document.createElement('kano-blockly-omnibox');
        this._omnibox.targetWorkspace = this;
        this._omnibox.noDrag = true;
        this._omniboxContainer.appendChild(this._omnibox);
        svg.parentNode.appendChild(this._omniboxContainer);
        this._omnibox.style.position = 'fixed';
        this._omnibox.style.maxHeight = '345px';
        this._omnibox.style.boxShadow = 'initial';
    } else {
        this._omniboxContainer.style.display = 'block';
    }
    this._omnibox.focus();
    return this._omnibox;
};

Blockly.Workspace.prototype.closeOmnibox = function (doNotNotify) {
    if (this._omnibox) {
        this._omnibox.clear();
        this._omniboxContainer.style.display = 'none';
        if (!doNotNotify) {
            this._omnibox.dispatchEvent(new CustomEvent('close'));
        }
    }
}

Blockly.Block.prototype.renderSearchPlus_ = function () {
    var inputList = this.inputList,
        connections;

    // Only add the listener once, trick to avoid overriding the constructor
    if (!this.listenerAdded) {
        this.listenerAdded = true;
        // Don't do it if in flyout
        if (this.isInFlyout || !this.rendered) {
            return;
        }

        // Grab all the input connections that are eligible for search plus buttons
        connections = inputList.filter(input => input.type === Blockly.INPUT_VALUE || input.type === Blockly.NEXT_STATEMENT)
                                .map(input => input.connection);
        // Create the buttons
        connections.forEach(connection => this.attachSearchToConnection_(connection));
        // Create a button for the nextConnection if exists and store the created block
        this.shadowSearch_ = this.attachSearchToConnection_(this.nextConnection);
        this.workspace.addChangeListener((e) => {
            // On a move event, we might need to remove/add a button to the next connection as it is not dealt with the `shadow block` paradigm
            if (e.type === Blockly.Events.MOVE) {
                // A block was connected to this one and the next connection now contains a block that is not the search plus button
                if (e.newParentId === this.id
                    && this.shadowSearch_
                    && this.nextConnection.targetConnection
                    && this.nextConnection.targetConnection.getSourceBlock() !== this.shadowSearch_) {
                    // Remove the search plus button and dereference it
                    this.shadowSearch_.dispose();
                    this.shadowSearch_ = null;
                } else if (e.oldParentId === this.id
                        && this.nextConnection
                        && !this.nextConnection.targetConnection
                        && this.workspace) {
                    // A block disconnected from this block and the nextConnection is now empty
                    this.attachSearchToConnection_(this.nextConnection);
                }
            }
        });
    }
};

Blockly.Block.prototype.attachSearchToConnection_ = function (connection) {
    // Do not attach if a block is already connected
    if (connection && !connection.targetConnection && this.workspace) {
        let type, block, connectionName;
        // Prevent this manipulation to trigger events
        Blockly.Events.disable();
        // Select the right type of search plus and connection for the current connection
        if (connection.type === Blockly.INPUT_VALUE) {
            type = 'search_output';
            connectionName = 'outputConnection';
        } else if (connection.type === Blockly.NEXT_STATEMENT) {
            type = 'search_statement';
            connectionName = 'previousConnection';
        }
        // Create the search plus block
        block = this.workspace.newBlock(type);
        block.initSvg();
        block.render();
        // Connect to the given connection
        connection.connect(block[connectionName]);
        Blockly.Events.enable();
        return block;
    }
};

/**
 * Create a virtual workspace where virtual blocks will be added
 * This is used to grab instances of blocks and extract data from them, without the need of rendering them
 */
Blockly._dataWorkspace = new Blockly.Workspace();
Blockly._dataBlocks = {};

Blockly.getDataBlock = function (type) {
    if (!Blockly._dataBlocks[type]) {
        Blockly._dataBlocks[type] = new Blockly.Block(Blockly._dataWorkspace, type);
    }
    return Blockly._dataBlocks[type];
};

Blockly.stringMatch = function (s, lookup) {
    return s.toLowerCase().indexOf(lookup.toLowerCase()) !== -1;
};

Blockly.stringMatchScore = function (s, lookup) {
    let matches = s.toLowerCase().match(lookup.toLowerCase());
    if (!matches) {
        return 0;
    }
    return matches[0].length / matches.input.length;
};

Blockly.Block.prototype.matches = function (qs, workspace) {
    let score = 0;
    this.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
            score += (field.matches(qs, workspace) ? 1 : 0);
        });
    });
    return score;
};

Blockly.Block.prototype.fromQuery = function (qs, workspace) {
    if (!qs) {
        return;
    }
    this.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
            field.fromQuery(qs, workspace);
        });
    });
};

Blockly.Field.prototype.getAPIText = function () {
    return this.getText();
};

Blockly.Field.prototype.matches = function (qs) {
    return qs.split(' ').some(piece => Blockly.stringMatch(this.text_, piece));
};

Blockly.Field.prototype.fromQuery = function () {};

Blockly.FieldDropdown.prototype.getAPIText = function () {
    let options = this.getOptions_().map(options => options[0]);
    return `[${options.join('|')}]`;
};

Blockly.FieldDropdown.prototype.matches = function (qs) {
    let options = this.getOptions_().map(options => options[0]);
    // As soon as we find an option containing a piece of the query string
    return options.some(option => {
        return qs.split(' ').some(piece => Blockly.stringMatch(option, piece));
    });
};

Blockly.FieldDropdown.prototype.fromQuery = function (qs) {
    let options = this.getOptions_();
    // As soon as we find an option containing a piece of the query string
    return options.some(option => {
        return qs.split(' ').forEach(piece => {
            if (Blockly.stringMatch(option[0], piece)) {
                this.setValue(option[1]);
            }
        });
    });
};

Blockly.FieldVariable.prototype.getAPIText = function (qs, workspace) {
    let variables = workspace.variableList.slice(0);
    if (qs.split(' ').some(piece => Blockly.stringMatch('variable', piece))) {
        return `<variable>`;
    }
    for (let i = 0; i < variables.length; i++) {
        if (qs.split(' ').some(piece => Blockly.stringMatch(variables[i], piece))) {
            return `(${variables[i]})`;
        }
    }
    return `<variable>`;
};

Blockly.FieldVariable.prototype.matches = function (qs, workspace) {
    let variables = workspace.variableList.slice(0);
    if (qs.split(' ').some(piece => Blockly.stringMatch('variable', piece))) {
        return `<variable>`;
    }
    // As soon as we find an option containing a piece of the query string
    return variables.some(variable => {
        return qs.split(' ').some(piece => Blockly.stringMatch(variable, piece));
    });
};

Blockly.FieldVariable.prototype.fromQuery = function (qs, workspace) {
    let variables = workspace.variableList.slice(0);
    // As soon as we find an option containing a piece of the query string
    for (let i = 0; i < variables.length; i++) {
        if (qs.split(' ').some(piece => Blockly.stringMatch(variables[i], piece))) {
            this.setValue(variables[i]);
            return;
        }
    }
};

Blockly.FieldNumber.prototype.getAPIText = function (qs) {
    return !isNaN(qs) ? `(${qs})` : '<number>';
};

Blockly.FieldNumber.prototype.matches = function (s) {
    return !isNaN(s) || 'number'.indexOf(s) !== -1;
};

Blockly.FieldNumber.prototype.fromQuery = function (qs) {
    let n = parseInt(qs, 10);
    if (!isNaN(n)) {
        this.setValue(n);
    }
};

Blockly.FieldColour.prototype.getAPIText = function (qs) {
    let colors = Blockly.FieldColour.COLOUR_NAMES,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(qs)) {
        return `Color: ${qs}`;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], qs);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    return highestColor ? highestColor : '<color>';
};

Blockly.FieldColour.prototype.matches = function (s) {
    let colors = Blockly.FieldColour.COLOUR_NAMES,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(s)) {
        return true;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], s);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    return !!highestColor || Blockly.stringMatch('color', s);
};

Blockly.FieldColour.prototype.fromQuery = function (qs) {
    let colors = Blockly.FieldColour.COLOUR_NAMES,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(qs)) {
        this.setValue(qs);
        return;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], qs);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    this.setValue(FIELD_COLORS[highestColor]);
};

Blockly.Input.prototype.toAPIString = function (qs, workspace) {
    let s = '';
    s += this.fieldRow.map(field => {
        return field.getAPIText(qs, workspace);
    }).join(' ');
    // Deal with connection displays
    if (this.type === Blockly.INPUT_VALUE) {
        s += ' [ ]';
    } else if (this.type === Blockly.NEXT_STATEMENT) {
        s += ' ...';
    }
    return s;
};

Blockly.Block.prototype.getFirstAvailableSearch = function () {
    let input;
    for (let i = 0; i < this.inputList.length; i++) {
        input = this.inputList[i];
        if (input.connection && input.connection.targetConnection) {
            let block = input.connection.targetConnection.sourceBlock_;
            if (input.connection.type === Blockly.INPUT_VALUE && block.type === 'search_output'
                || input.connection.type === Blockly.NEXT_STATEMENT && block.type === 'search_statement') {
                return block;
            }
        }
    }
};

Blockly.Block.prototype.toAPIString = function (qs, workspace) {
    return this.inputList.map(input => {
        return input.toAPIString(qs, workspace);
    }).join(' ');
};

Blockly.Workspace.prototype.search = function (qs) {
    let blocks = [];
    // lookup blocks in the toolbox
    this.toolbox.toolbox.forEach(category => {
        blocks = blocks.concat(category.blocks.map(block => block.id));
    });
    // Lookup all blocks registered
    //blocks = Object.keys(Blockly.Blocks);
    return blocks
        .map(Blockly.getDataBlock)
        .filter(block => {
            return block.matches(qs, this) > 0;
        });
};

Blockly.FieldLookup = function (text, c) {
    this._text = text;
    this._c = c || '';
    this.size_ = new goog.math.Size(0, Blockly.BlockSvg.MIN_BLOCK_Y);
};
goog.inherits(Blockly.FieldLookup, Blockly.Field);
Blockly.FieldLookup.prototype.init = function () {
    if (this._container) {
        // Field has already been initialized once.
        return;
    }
    // Build the DOM.
    this._container = Blockly.utils.createSvgElement('g', {
        class: 'blocklyLookupField ' + this._c
    }, null);
    this._textEl = Blockly.utils.createSvgElement('text', {
        transform: `translate(0, 12)`
    }, this._container);
    this._textEl.appendChild(document.createTextNode(this._text));
    this.sourceBlock_.getSvgRoot().appendChild(this._container);
    Blockly.bindEvent_(this._container, 'mousedown', this, this._onMouseDown);
};

/**
 * Draws the border with the correct width.
 * Saves the computed width in a property.
 * @private
 */
Blockly.FieldLookup.prototype.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0;
    return;
  }
  // Replace the text.
  goog.dom.removeChildren(/** @type {!Element} */ (this._textEl));
  var textNode = document.createTextNode(this._text);
  this._textEl.appendChild(textNode);

  var width = Blockly.Field.getCachedWidth(this._textEl);
  this.size_.width = width;
};

Blockly.FieldLookup.prototype._onMouseDown = function (e) {
    if (Blockly.WidgetDiv.isVisible()) {
        Blockly.WidgetDiv.hide();
    } else if (!this.sourceBlock_.isInFlyout) {
        this.showEditor_();
        e.preventDefault();
        e.stopPropagation();
    }
};
Blockly.FieldLookup.prototype.getSvgRoot = function () {
    return this._container;
};
Blockly.FieldLookup.prototype.showEditor_ = function () {
    var block = this.sourceBlock_;
    var xy = Blockly.getSvgXY_(block.svgGroup_, block.workspace);
    var connection = block.outputConnection ? block.outputConnection : block.previousConnection;
    var targetConnection = connection.targetConnection;
    var workspace = this.sourceBlock_.workspace;

    var omnibox = workspace.openOmnibox();
    omnibox.style.top = `${xy.y}px`;
    omnibox.style.left = `${xy.x}px`;

    omnibox.filter = (block) => {
        let blockConnection;
        if (targetConnection.type === Blockly.NEXT_STATEMENT) {
            blockConnection = block.previousConnection;
        } else if (targetConnection.type === Blockly.INPUT_VALUE) {
            blockConnection = block.outputConnection;
        }
        // The connection exists on the block found and it matches the type of the input
        return blockConnection  && (!targetConnection.check_ || !blockConnection.check_
                || targetConnection.check_.some(inputCheck => blockConnection.check_.indexOf(inputCheck) !== -1));
    };
    var onConfirm = (e) => {
        let type;
        omnibox.removeEventListener('confirm', onConfirm);
        omnibox.removeEventListener('close', onConfirm);
        if (e.detail && e.detail.selected) {
            type = e.detail.selected.type;
            if (type) {
                let block = workspace.newBlock(type),
                    searchBlock;
                block.fromQuery(omnibox.query, workspace);
                block.initSvg();
                block.render();
                if (targetConnection.type === Blockly.NEXT_STATEMENT) {
                    targetConnection.connect(block.previousConnection);
                } else if (targetConnection.type === Blockly.INPUT_VALUE) {
                    targetConnection.connect(block.outputConnection);
                }
                setTimeout(() => {
                    // Focus on the first available search block of the inserted block
                    searchBlock = block.getFirstAvailableSearch();
                    if (searchBlock) {
                        searchBlock.getField('SEARCH').focus();
                    }
                });
            }
        }
        workspace.closeOmnibox(true);
    };
    omnibox.addEventListener('confirm', onConfirm);
    omnibox.addEventListener('close', onConfirm);
    if ('animate' in HTMLElement.prototype) {
        let rect = omnibox.getBoundingClientRect(),
            hw = block.getHeightWidth();
        omnibox.style.transformOrigin = '0 0';
        omnibox.animate({
            transform: [`scale(${hw.width / rect.width}, ${hw.height / rect.height})`, 'scale(1, 1)']
        }, {
            duration: 170,
            easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
        });
    }
};

Blockly.FieldLookup.prototype.focus = function () {
    let onKeyDown = (e) => {
        window.removeEventListener('keydown', onKeyDown);
        if (e.keyCode === 13) {
            this.showEditor_();
        }
    };
    window.addEventListener('keydown', onKeyDown);
    this._container.classList.add('selected');
};

Blockly.Blocks.search_statement = {
    init: function () {
        let searchField = new Blockly.FieldLookup('Type: __________', 'blocklySearchStatement');
        this.setColour('#bdbdbd');
        this.appendDummyInput('SEARCH')
            .appendField(searchField, 'SEARCH');
        this.setPreviousStatement(true);
        this.setPaddingY(0);
        this.setPaddingX(0);
        this.setShadow(true);
        this.workspace.addChangeListener(() => {
            if (!this.previousConnection.targetConnection) {
                this.dispose();
            }
        });
    }
};

Blockly.Blocks.search_output = {
    init: function () {
        let searchField = new Blockly.FieldLookup('+', 'blocklySearchOutput');
        this.setColour('#bdbdbd');
        this.appendDummyInput('SEARCH')
            .appendField(searchField, 'SEARCH');
        this.setOutput(true);
        this.setShadow(true);
    }
};

Blockly.JavaScript.search_output = function () {
    return '';
};

Blockly.JavaScript.search_statement = function () {
    return '';
};


/**
 * Set the workspace to have focus in the browser.
 * @private
 */
Blockly.WorkspaceSvg.prototype.setBrowserFocus = function() {
  // Blur whatever was focused since explcitly grabbing focus below does not
  // work in Edge.
//   if (document.activeElement) {
//     document.activeElement.blur();
//   }
  try {
    // Focus the workspace SVG - this is for Chrome and Firefox.
    this.getParentSvg().focus();
  }  catch (e) {
    // IE and Edge do not support focus on SVG elements. When that fails
    // above, get the injectionDiv (the workspace's parent) and focus that
    // instead.  This doesn't work in Chrome.
    try {
      // In IE11, use setActive (which is IE only) so the page doesn't scroll
      // to the workspace gaining focus.
      this.getParentSvg().parentNode.setActive();
    } catch (e) {
      // setActive support was discontinued in Edge so when that fails, call
      // focus instead.
      this.getParentSvg().parentNode.focus();
    }
  }
};