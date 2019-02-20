import { css } from 'lit-element/lit-element.js';

export const challengeStyles = css`
    .toolbox-entry {
        width: 128px;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #292f35;
        color: white;
        font-family: var(--font-body);
        font-weight: bold;
        height: 32px;
        text-align: left;
        padding: 2px 32px 3px 12px;
        box-sizing: border-box;
    }
    .toolbox-entry .color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: none;
        margin: 0 8px 0 2px;
    }
`;
