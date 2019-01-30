import { html } from '@polymer/polymer/lib/utils/html-tag.js';

export const button = html`
    <style>
        button.tool {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --layout-center-justified;
            @apply --kano-button;
            background-color: rgba(255, 255, 255, 0.25);
            border-radius: 3px;
            margin: 0 8px 0 0;
            font-size: 12px;
            font-weight: normal;
            text-shadow: none;
            font-family: var(--font-body);
            width: 32px;
            height: 32px;
            padding: 0px;
            cursor: pointer;
        }
        button.tool:hover,
        button.tool:focus {
            background-color: #ff842a;
            outline: 0;
        }
        button.tool>* {
            margin: 0 auto;
        }
    </style>
`;

export default { button };
