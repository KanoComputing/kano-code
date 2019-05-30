import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kc-asset-picker-style">
    <template>
        <style>
            iron-icon {
                width: 8px;
                height: 8px;
                fill: rgba(255, 255, 255, 0.4);
                --iron-icon-fill-color: rgba(116, 39, 39, 0.4);
            }
            .files {
                display: flex;
flex-direction: column;
                padding: 16px 40px;
                overflow-y: auto;
            }
            .files iron-pages {
                flex: 1;
flex-basis: 0.000000001px;
            }
            .bread-item {
                display: inline-block;
                font-size: 16px;
                opacity: 0.5;
            }
            .bread-item:last-of-type, .bread-item:hover {
                opacity: 1;
            }
            kwc-file-breadcrumbs {
                font-weight: bold;
                --kwc-file-breadcrumbs: {
                    display: flex;
flex-direction: row;
                    align-items: center;
                };
            }
            .header button,
            .files button {
                border: 0px;
                background: none;
                font-family: var(--font-body);
                color: white;
                font-weight: bold;
                text-align: left;
                cursor: pointer;
                display: block;
            }
            .header button:focus,
            .files button:focus {
                outline: none;
            }
            .files .dir {
                display: flex;
flex-direction: row;
                align-items: center;
                flex: 1 0 auto;
                font-size: 16px;
                padding: 0px 16px 0px 8px;
                margin-bottom: 8px;
                background: var(--color-chateau);
                border-radius: 6px;
                height: 56px;
                cursor: pointer;
            }
            .files .dir.directory {
                padding: 0px 24px;
            }
            .files .dir.directory:hover {
                background: #6E7377;
            }
            .files .dir.file {
                border: 1px solid transparent;
            }
            .files .dir.file:hover {
                background: var(--kc-asset-picker-highlight-color, var(--color-grassland));
            }
            .files .dir.file[selected] {
                border-color: var(--kc-asset-picker-highlight-color, var(--color-grassland));
            }
            .files .dir.file .label {
                flex: 1;
flex-basis: 0.000000001px;
            }
            .files .dir.file .add {
                display: flex;
flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: var(--font-body);
                font-size: 18px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                padding: 0px;
                width: 22px;
                height: 22px;
            }
            .files .dir.file .add iron-icon {
                width: 12px;
                height: 12px;
                fill: white;
            }
            .files .dir .name {
                flex: 1;
flex-basis: 0.000000001px;
            }
            .files .dir .number {
                display: flex;
flex-direction: row;
                align-items: center;
                justify-content: center;
                margin: 0px 12px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 24px;
            }
            .files .dir .number span {
                text-align: center;
                font-size: 14px;
                padding: 2px 9px;
            }
            .files .directory * {
                pointer-events: none;
            }
            .header {
                padding: 0px 28px;
                height: 40px;
                min-height: 40px;
                border-top: 1px solid var(--kc-asset-picker-separator-color, var(--kc-border-color));
                border-bottom: 1px solid var(--kc-asset-picker-separator-color, var(--kc-border-color));
                display: flex;
flex-direction: row;
                align-items: center;
                background: rgba(0, 0, 0, 0.1);
            }
            .icon-button {
                padding: 0px;
            }
            .icon-button iron-icon {
                fill: white;
                opacity: 0.4;
                width: 18px;
                height: 18px;
            }
            .icon-button:hover iron-icon {
                opacity: 1;
            }
            [name="samples"] {
                display: flex;
flex-direction: row;
            }
            .files button.play {
                display: flex;
flex-direction: row;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                margin-right: 12px;
                padding: 0px;
            }
            .files button.play kano-animated-svg {
                width: 20px;
                height: 20px;
                --kano-animated-path: {
                    fill: var(--color-porcelain);
                    stroke: var(--color-porcelain);
                    stroke-width: 2px;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    transition: all ease-in-out 200ms;
                }
            }
            [hidden] {
                display: none !important;
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
