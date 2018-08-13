import { Base } from './base.js';

const Prism = {
    transform (ctx, image, width, height, imageWidth, imageHeight, slices, zoom, offsetRotation, offsetScale, offsetX, offsetY) {
        let step = 2 * Math.PI / slices,
            radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
            scale = zoom * (radius / Math.min(imageWidth, imageHeight)),
            cx = imageWidth / 2,
            centerX = width / 2 - radius,
            centerY = height / 2 - radius;
        if (slices === 0) {
            ctx.drawImage(image, 0, 0, width, height);
            return;
        }
        // Image could be in a broken state
        try {
            ctx.fillStyle = ctx.createPattern(image, 'repeat');
            for (let i = 0; i < slices; i++) {
                ctx.save();
                ctx.translate(radius, radius);
                ctx.translate(centerX, centerY);
                ctx.rotate(i * step);
                ctx.beginPath();
                ctx.moveTo(-0.5, -0.5);
                ctx.arc(0, 0, radius, step * -0.51, step * 0.51);
                ctx.lineTo(0.5, 0.5);
                ctx.closePath();

                ctx.rotate(Math.PI / 2);
                ctx.scale(scale, scale);
                ctx.scale([-1,1][i % 2], 1);
                ctx.translate(offsetX - cx, offsetY);
                ctx.rotate(offsetRotation / 180 * Math.PI);
                ctx.scale(offsetScale, offsetScale);

                ctx.fill();
                ctx.restore();
            }
        } catch (e) {
            console.log(e);
        }
    }
};

/**
 * @polymerBehavior
 */
export const kaleidoscope = Object.assign({}, Base, Prism);
