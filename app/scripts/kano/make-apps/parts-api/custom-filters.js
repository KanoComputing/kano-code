 Filters.colorize = function(pixels, rgb, value) {
     var rgbTarget = rgb || { r: 255, g: 0, b: 0 };
     var v = value || 0.5;
     var output = Filters.createImageData(pixels.width, pixels.height);
     var dst = output.data;
     var d = pixels.data;
     for (var i = 0; i < d.length; i += 4) {
         var r = d[i];
         var g = d[i + 1];
         var b = d[i + 2];
         dst[i] = Math.min(255, r + (rgbTarget.r * v));
         dst[i + 1] = Math.min(255, g + (rgbTarget.g * v));
         dst[i + 2] = Math.min(255, b + (rgbTarget.b * v));
         dst[i + 3] = d[i + 3];
     }
     return output;
 };
 Filters.pixelate = function(pixels, size) {
     var binSize = size || 20;
     var output = Filters.createImageData(pixels.width, pixels.height);
     var dst = output.data;
     var d = pixels.data;

     var xSize = pixels.width,
         ySize = pixels.height,
         x, y, i;

     var pixelsPerBin = binSize * binSize,
         red, green, blue, alpha,
         nBinsX = Math.ceil(xSize / binSize),
         nBinsY = Math.ceil(ySize / binSize),
         xBinStart, xBinEnd, yBinStart, yBinEnd,
         xBin, yBin, pixelsInBin;

     for (xBin = 0; xBin < nBinsX; xBin += 1) {
         for (yBin = 0; yBin < nBinsY; yBin += 1) {

             // Initialize the color accumlators to 0
             red = 0;
             green = 0;
             blue = 0;
             alpha = 0;

             // Determine which pixels are included in this bin
             xBinStart = xBin * binSize;
             xBinEnd = xBinStart + binSize;
             yBinStart = yBin * binSize;
             yBinEnd = yBinStart + binSize;

             // Add all of the pixels to this bin!
             pixelsInBin = 0;
             for (x = xBinStart; x < xBinEnd; x += 1) {
                 if (x >= xSize) {
                     continue; }
                 for (y = yBinStart; y < yBinEnd; y += 1) {
                     if (y >= ySize) {
                         continue; }
                     i = (xSize * y + x) * 4;
                     red += d[i + 0];
                     green += d[i + 1];
                     blue += d[i + 2];
                     alpha += d[i + 3];
                     pixelsInBin += 1;
                 }
             }

             // Make sure the channels are between 0-255
             red = red / pixelsInBin;
             green = green / pixelsInBin;
             blue = blue / pixelsInBin;
             alphas = alpha / pixelsInBin;

             // Draw this bin
             for (x = xBinStart; x < xBinEnd; x += 1) {
                 if (x >= xSize) {
                     continue; }
                 for (y = yBinStart; y < yBinEnd; y += 1) {
                     if (y >= ySize) {
                         continue; }
                     i = (xSize * y + x) * 4;
                     dst[i + 0] = red;
                     dst[i + 1] = green;
                     dst[i + 2] = blue;
                     dst[i + 3] = alpha;
                 }
             }
         }
     }
     return output;
 };

 Filters.contrast = function(pixels, contrast) {
     var cst = contrast || 0;
     var output = Filters.createImageData(pixels.width, pixels.height);
     var dst = output.data;
     var d = pixels.data;

     var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

     for (var i = 0; i < d.length; i += 4) {
         dst[i] = factor * (d[i] - 128) + 128;
         dst[i + 1] = factor * (d[i + 1] - 128) + 128;
         dst[i + 2] = factor * (d[i + 2] - 128) + 128;
         dst[i + 3] = d[i + 3];
     }

     return output;
 };
