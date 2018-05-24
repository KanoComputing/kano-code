import '@kano/kwc-blockly/blockly_built/blockly_compressed.js';
import '@kano/kwc-blockly/blockly_built/msg/js/en.js';
import '@kano/kwc-blockly/blockly_built/blocks_compressed.js';
import '@kano/kwc-blockly/blockly_built/javascript_compressed.js';
// Reload the custom messages as Blockly overrides them
if (window.CustomBlocklyMsg) {
    Object.assign(Blockly.Msg, window.CustomBlocklyMsg);
}
