/**
 * Override this function to allow normal blocks in shadow blocks. Commented code is line 165
 */



/**
 * Decode an XML block tag and create a block (and possibly sub blocks) on the
 * workspace.
 * @param {!Element} xmlBlock XML block element.
 * @param {!Blockly.Workspace} workspace The workspace.
 * @return {!Blockly.Block} The root block created.
 * @private
 */
Blockly.Xml.domToBlockHeadless_ = function(xmlBlock, workspace) {
    var block = null;
    var prototypeName = xmlBlock.getAttribute('type');
    if (!prototypeName) {
      throw TypeError('Block type unspecified: ' + xmlBlock.outerHTML);
    }
    var id = xmlBlock.getAttribute('id');
    block = workspace.newBlock(prototypeName, id);
  
    var blockChild = null;
    for (var i = 0, xmlChild; xmlChild = xmlBlock.childNodes[i]; i++) {
      if (xmlChild.nodeType == 3) {
        // Ignore any text at the <block> level.  It's all whitespace anyway.
        continue;
      }
      var input;
  
      // Find any enclosed blocks or shadows in this tag.
      var childBlockElement = null;
      var childShadowElement = null;
      for (var j = 0, grandchild; grandchild = xmlChild.childNodes[j]; j++) {
        if (grandchild.nodeType == 1) {
          if (grandchild.nodeName.toLowerCase() == 'block') {
            childBlockElement = /** @type {!Element} */ (grandchild);
          } else if (grandchild.nodeName.toLowerCase() == 'shadow') {
            childShadowElement = /** @type {!Element} */ (grandchild);
          }
        }
      }
      // Use the shadow block if there is no child block.
      if (!childBlockElement && childShadowElement) {
        childBlockElement = childShadowElement;
      }
  
      var name = xmlChild.getAttribute('name');
      switch (xmlChild.nodeName.toLowerCase()) {
        case 'mutation':
          // Custom data for an advanced block.
          if (block.domToMutation) {
            block.domToMutation(xmlChild);
            if (block.initSvg) {
              // Mutation may have added some elements that need initializing.
              block.initSvg();
            }
          }
          break;
        case 'comment':
          block.setCommentText(xmlChild.textContent);
          var visible = xmlChild.getAttribute('pinned');
          if (visible && !block.isInFlyout) {
            // Give the renderer a millisecond to render and position the block
            // before positioning the comment bubble.
            setTimeout(function() {
              if (block.comment && block.comment.setVisible) {
                block.comment.setVisible(visible == 'true');
              }
            }, 1);
          }
          var bubbleW = parseInt(xmlChild.getAttribute('w'), 10);
          var bubbleH = parseInt(xmlChild.getAttribute('h'), 10);
          if (!isNaN(bubbleW) && !isNaN(bubbleH) &&
              block.comment && block.comment.setVisible) {
            block.comment.setBubbleSize(bubbleW, bubbleH);
          }
          break;
        case 'data':
          block.data = xmlChild.textContent;
          break;
        case 'title':
          // Titles were renamed to field in December 2013.
          // Fall through.
        case 'field':
          Blockly.Xml.domToField_(block, name, xmlChild);
          break;
        case 'value':
        case 'statement':
          input = block.getInput(name);
          if (!input) {
            console.warn('Ignoring non-existent input ' + name + ' in block ' +
                         prototypeName);
            break;
          }
          if (childShadowElement) {
            input.connection.setShadowDom(childShadowElement);
          }
          if (childBlockElement) {
            blockChild = Blockly.Xml.domToBlockHeadless_(childBlockElement,
                workspace);
            if (blockChild.outputConnection) {
              input.connection.connect(blockChild.outputConnection);
            } else if (blockChild.previousConnection) {
              input.connection.connect(blockChild.previousConnection);
            } else {
              throw TypeError(
                  'Child block does not have output or previous statement.');
            }
          }
          break;
        case 'next':
          if (childShadowElement && block.nextConnection) {
            block.nextConnection.setShadowDom(childShadowElement);
          }
          if (childBlockElement) {
            if (!block.nextConnection) {
              throw TypeError('Next statement does not exist.');
            }
            // If there is more than one XML 'next' tag.
            if (block.nextConnection.isConnected()) {
              throw TypeError('Next statement is already connected.');
            }
            blockChild = Blockly.Xml.domToBlockHeadless_(childBlockElement,
                workspace);
            if (!blockChild.previousConnection) {
              throw TypeError('Next block does not have previous statement.');
            }
            block.nextConnection.connect(blockChild.previousConnection);
          }
          break;
        default:
          // Unknown tag; ignore.  Same principle as HTML parsers.
          console.warn('Ignoring unknown tag: ' + xmlChild.nodeName);
      }
    }
  
    var inline = xmlBlock.getAttribute('inline');
    if (inline) {
      block.setInputsInline(inline == 'true');
    }
    var disabled = xmlBlock.getAttribute('disabled');
    if (disabled) {
      block.setDisabled(disabled == 'true' || disabled == 'disabled');
    }
    var deletable = xmlBlock.getAttribute('deletable');
    if (deletable) {
      block.setDeletable(deletable == 'true');
    }
    var movable = xmlBlock.getAttribute('movable');
    if (movable) {
      block.setMovable(movable == 'true');
    }
    var editable = xmlBlock.getAttribute('editable');
    if (editable) {
      block.setEditable(editable == 'true');
    }
    var collapsed = xmlBlock.getAttribute('collapsed');
    if (collapsed) {
      block.setCollapsed(collapsed == 'true');
    }
    if (xmlBlock.nodeName.toLowerCase() == 'shadow') {
      // Ensure all children are also shadows.
    //   var children = block.getChildren(false);
    //   for (var i = 0, child; child = children[i]; i++) {
    //     if (!child.isShadow()) {
    //       throw TypeError('Shadow block not allowed non-shadow child.');
    //     }
    //   }
      // Ensure this block doesn't have any variable inputs.
      if (block.getVarModels().length) {
        throw TypeError('Shadow blocks cannot have variable references.');
      }
      block.setShadow(true);
    }
    return block;
  };