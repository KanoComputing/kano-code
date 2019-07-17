import '@kano/styles/typography.js'
import '@kano/styles/color.js'
import { html } from 'lit-html/lit-html.js';
import { close } from '@kano/icons/ui.js';
import { DismissableTooltip } from '../../widget/dismissable-tooltip.js';
import { templateContent } from '../../directives/template-content.js';
import { EventEmitter } from '@kano/common/index.js';

export class RemixTooltip extends DismissableTooltip {}
