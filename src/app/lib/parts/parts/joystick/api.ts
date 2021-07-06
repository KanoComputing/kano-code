import { IPartAPI } from '../../api.js';
import { IMetaDefinition } from '../../../meta-api/module.js';
import { TransformAPI } from '../transform/api.js';
import { JoystickPart } from './joystick.js';
import { JoystickInlineDisplay } from './inline.js';
import icon from './icon.js';

export const JoystickAPI : IPartAPI = {
  type: JoystickPart.type,
  label: 'Joystick',
  icon: icon,
  inlineDisplay: JoystickInlineDisplay,
  color: '#ef5284',
  symbols: [
    {
      type: 'variable',
      name: 'left',
      verbose: 'pushed left',
      returnType: Boolean,
    },
    {
      type: 'variable',
      name: 'right',
      verbose: 'pushed right',
      returnType: Boolean,
    },
    {
      type: 'variable',
      name: 'up',
      verbose: 'pushed up',
      returnType: Boolean,
    },
    {
      type: 'variable',
      name: 'down',
      verbose: 'pushed down',
      returnType: Boolean,
    },
    {
      type: 'variable',
      name: 'direction',
      verbose: 'direction',
      returnType: Number
    },
    {
      type: 'variable',
      name: 'force',
      verbose: 'force',
      returnType: Number,
    },
    TransformAPI.find(symbol => symbol.name === 'moveTo') as IMetaDefinition
  ]
};
