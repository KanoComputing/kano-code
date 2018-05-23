import { UIBehavior } from './kano-ui-behavior.js';

(function(Kano) {
  /**
   * Behavior common to all ui parts that displays a shape on the lightboard
   * Update the coordinates methods to match leds instead of screen pixels
   * @polymerBehavior
   */
  Kano.Behaviors.LightShapeBehaviorImpl = {
      PIXEL_SIZE: 27,
      OFFSET_X: 14,
      OFFSET_Y: 33,
      BOARD_WIDTH: 16,
      BOARD_HEIGHT: 8,
      applyTransform () {
          if (!this.model || this.isRunning) {
              return;
          }
          let x = Math.min(Math.max(this.OFFSET_X, this.OFFSET_X + this.PIXEL_SIZE * this.getX()), this.OFFSET_X + (this.BOARD_WIDTH - parseInt(this.model.userProperties.width)) * this.PIXEL_SIZE),
              y = Math.min(Math.max(this.OFFSET_Y, this.OFFSET_Y + this.PIXEL_SIZE * this.getY()), this.OFFSET_Y + (this.BOARD_HEIGHT - parseInt(this.model.userProperties.height)) * this.PIXEL_SIZE);

          this.transform(`translate(${x}px, ${y}px)`);
      }
  };

  Kano.Behaviors.LightShapeBehavior = [UIBehavior, Kano.Behaviors.LightShapeBehaviorImpl];
})();
