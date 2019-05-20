const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<style is="custom-style">
    html {
        --kc-primary-color: #414a51;
        --kc-secondary-color: #292f35;

        --kc-highlight-color: #22272d;

        --kwc-blockly-background: var(--kc-primary-color);
        --kwc-blockly-toolbox-color: white;
        --kwc-blockly-toolbox-selected-color: var(--kc-highlight-color);
        --kano-app-editor-workspace-background: var(--kc-secondary-color);
        --kano-app-editor-workspace-controls: #19111C;
        --kano-app-editor-workspace-controls-hover: #261e2c;
        --kano-app-editor-workspace-border: #22272d;
        --kano-app-part-editor-border: #202428;
        --kano-app-part-editor-icons: #9fa4a8;
        --kwc-blockly-scrollbars-color: var(--kc-secondary-color);
        
        --kwc-blockly-toolbox: {
            padding-top: 0;
            background: var(--kc-secondary-color); 
        };
    }
</style>`;

document.head.appendChild($_documentContainer.content);
