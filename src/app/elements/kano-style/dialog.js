const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kano-style-dialog">
    <template>
        <style>
            paper-dialog {
                display: flex;
flex-direction: row;
                z-index: 10;
                background-color: #fff;
                border-radius: 3px;
                overflow: auto;
                color: #292f35;
                font-family: var(--font-body);
            }
            paper-dialog#dialog>* {
                margin: 0px;
                padding: 18px 24px 12px;
            }
            paper-dialog #dialog-content {
                flex: 1;
flex-basis: 0.000000001px;
            }
            paper-dialog #badge {
                padding: 12px;
                margin: 6px 28px 6px 4px;
                box-sizing: border-box;
                border-radius: 50%;
                background: #ea0923;
            }
            paper-dialog #badge iron-icon {
                transform: rotate(-9deg);
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
            }
            paper-dialog#dialog h2,
            paper-dialog#dialog h2 {
                font-family: var(--font-body);
                margin: 0px;
                font-weight: bold;
                color: #000;
            }
            paper-dialog div#buttons {
                padding: 18px 0px 0px;
                justify-content: flex-start;
            }
            paper-dialog .buttons button {
                @apply --kano-button;
                border-radius: 3px;
                padding: 12px 22px;
                text-shadow: none;
                font-size: 14px;
                min-height: 32px;
                font-weight: bold;
                min-width: 80px;
                color: #8d8d8d;
                background: #e1e1e1;
            }
            paper-dialog .buttons button:not(:first-of-type) {
                margin-left: 7px;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
