import './main.scss'
import "regenerator-runtime/runtime.js"
import { NFTStorage } from 'nft.storage'
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

/* eslint-disable */
/**
 * Pixel Sprite Generator v0.0.2
 *
 * This is a JavaScript version of David Bollinger's pixelrobots and
 * pixelspaceships algorithm.
 *
 * More info:
 * http://www.davebollinger.com/works/pixelrobots/
 * http://www.davebollinger.com/works/pixelspaceships/
 *
 * Archived website (links above are down):
 * http://web.archive.org/web/20080228054405/http://www.davebollinger.com/works/pixelrobots/
 * http://web.archive.org/web/20080228054410/http://www.davebollinger.com/works/pixelspaceships/
 *
 */
 (function(root) {

  /**
   *   The Mask class defines a 2D template form which sprites can be generated.
   *
   *   @class Mask
   *   @constructor
   *   @param {data} Integer array describing which parts of the sprite should be
   *   empty, body, and border. The mask only defines a semi-ridgid stucture
   *   which might not strictly be followed based on randomly generated numbers.
   *
   *      -1 = Always border (black)
   *       0 = Empty
   *       1 = Randomly chosen Empty/Body
   *       2 = Randomly chosen Border/Body
   *
   *   @param {width} Width of the mask data array
   *   @param {height} Height of the mask data array
   *   @param {mirrorX} A boolean describing whether the mask should be mirrored on the x axis
   *   @param {mirrorY} A boolean describing whether the mask should be mirrored on the y axis
   */
  function Mask(data, width, height, mirrorX, mirrorY) {
      this.width   = width;
      this.height  = height;
      this.data    = data;
      this.mirrorX = typeof mirrorX !== 'undefined' ? mirrorX : true;
      this.mirrorY = typeof mirrorY !== 'undefined' ? mirrorY : true;
  }

  /**
  *   The Sprite class makes use of a Mask instance to generate a 2D sprite on a
  *   HTML canvas.
  *
  *   var options = {
  *       colored         : true,   // boolean
  *       edgeBrightness  : 0.3,    // value from 0 to 1
  *       colorVariations : 0.2,    // value from 0 to 1
  *       brightnessNoise : 0.3,    // value from 0 to 1
  *       saturation      : 0.5     // value from 0 to 1
  *   }
  *
  *   @class Sprite
  *   @param {mask}
  *   @param {options} 
  *   @constructor
  */
  function Sprite(mask, options) {
      this.width     = mask.width * (mask.mirrorX ? 2 : 1);
      this.height    = mask.height * (mask.mirrorY ? 2 : 1);
      this.mask      = mask;
      this.data      = new Array(this.width * this.height);

      this.options = options || {};

      var defaults = {
          colored         : false,
          edgeBrightness  : 0.3,
          colorVariations : 0.2,
          brightnessNoise : 0.3,
          saturation      : 0.5
      };

      // Set default options
      for (var prop in defaults) {
          if (defaults.hasOwnProperty(prop)) {
              var val = this.options[prop];

              // If the option was not provided
              if (typeof val === 'undefined') {

                  // Set it to the default value
                  val = defaults[prop];
              }

              this.options[prop] = val;
          }
      }

      this.init();
  }


  /**
  *   The init method calls all functions required to generate the sprite.
  *
  *   @method init
  *   @returns {undefined}
  */
  Sprite.prototype.init = function() {
      this.initCanvas();
      this.initContext();
      this.initData();

      this.applyMask();
      this.generateRandomSample();

      if (this.mask.mirrorX) {
          this.mirrorX();
      }

      if (this.mask.mirrorY) {
          this.mirrorY();
      }

      this.generateEdges();
      this.renderPixelData();
  };

  /**
  *   The initCanvas method creates a HTML canvas element for internal use.
  *
  *   (note: the canvas element is not added to the DOM)
  *
  *   @method initCanvas
  *   @returns {undefined}
  */
  Sprite.prototype.initCanvas = function() {
    this.canvas = document.createElement('canvas');
     
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
  };

  /**
  *   The initContext method requests a CanvasRenderingContext2D from the
  *   internal canvas object.
  *
  *   @method 
  *   @returns {undefined}
  */
  Sprite.prototype.initContext = function() {
    this.ctx    = this.canvas.getContext('2d');
    this.pixels = this.ctx.createImageData(this.width, this.height);
  };

  /**
  *   The getData method returns the sprite template data at location (x, y)
  *
  *      -1 = Always border (black)
  *       0 = Empty
  *       1 = Randomly chosen Empty/Body
  *       2 = Randomly chosen Border/Body
  *
  *   @method getData
  *   @param {x}
  *   @param {y}
  *   @returns {undefined}
  */
  Sprite.prototype.getData = function(x, y) {
      return this.data[y * this.width + x];
  };

  /**
  *   The setData method sets the sprite template data at location (x, y)
  *
  *      -1 = Always border (black)
  *       0 = Empty
  *       1 = Randomly chosen Empty/Body
  *       2 = Randomly chosen Border/Body
  *
  *   @method setData
  *   @param {x}
  *   @param {y}
  *   @param {value}
  *   @returns {undefined}
  */
  Sprite.prototype.setData = function(x, y, value) {
      this.data[y * this.width + x] = value;
  };

  /**
  *   The initData method initializes the sprite data to completely solid.
  *
  *   @method initData
  *   @returns {undefined}
  */
  Sprite.prototype.initData = function() {
      var h = this.height;
      var w = this.width;
      var x, y;
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              this.setData(x, y, -1);
          }
      }
  };

  /**
  *   The mirrorX method mirrors the template data horizontally.
  *
  *   @method mirrorX
  *   @returns {undefined}
  */
  Sprite.prototype.mirrorX = function() {
      var h = this.height;
      var w = Math.floor(this.width/2);
      var x, y;
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              this.setData(this.width - x - 1, y, this.getData(x, y));
          }
      }
  };

  /**
  *   The mirrorY method mirrors the template data vertically.
  *
  *   @method 
  *   @returns {undefined}
  */
  Sprite.prototype.mirrorY = function() {
      var h = Math.floor(this.height/2);
      var w = this.width;
      var x, y;
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              this.setData(x, this.height - y - 1, this.getData(x, y));
          }
      }
  };

  /**
  *   The applyMask method copies the mask data into the template data array at
  *   location (0, 0).
  *
  *   (note: the mask may be smaller than the template data array)
  *
  *   @method applyMask
  *   @returns {undefined}
  */
  Sprite.prototype.applyMask = function() {
      var h = this.mask.height;
      var w = this.mask.width;

      var x, y;
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              this.setData(x, y, this.mask.data[y * w + x]);
          }
      }
  };

  /**
  *   Apply a random sample to the sprite template.
  *
  *   If the template contains a 1 (internal body part) at location (x, y), then
  *   there is a 50% chance it will be turned empty. If there is a 2, then there
  *   is a 50% chance it will be turned into a body or border.
  *
  *   (feel free to play with this logic for interesting results)
  *
  *   @method generateRandomSample
  *   @returns {undefined}
  */
  Sprite.prototype.generateRandomSample = function() {
      var h = this.height;
      var w = this.width;

      var x, y;
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              var val = this.getData(x, y);

              if (val === 1) {
                  val = val * Math.round(Math.random());
              } else if (val === 2) {
                  if (Math.random() > 0.5) {
                      val = 1;
                  } else {
                      val = -1;
                  }
              } 

              this.setData(x, y, val);
          }
      }
  };

  /**
  *   This method applies edges to any template location that is positive in
  *   value and is surrounded by empty (0) pixels.
  *
  *   @method generateEdges
  *   @returns {undefined}
  */
  Sprite.prototype.generateEdges = function() {
      var h = this.height;
      var w = this.width;

      var x, y;
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              if (this.getData(x, y) > 0) {
                  if (y - 1 >= 0 && this.getData(x, y-1) === 0) {
                      this.setData(x, y-1, -1);
                  }
                  if (y + 1 < this.height && this.getData(x, y+1) === 0) {
                      this.setData(x, y+1, -1);
                  }
                  if (x - 1 >= 0 && this.getData(x-1, y) === 0) {
                      this.setData(x-1, y, -1);
                  }
                  if (x + 1 < this.width && this.getData(x+1, y) === 0) {
                      this.setData(x+1, y, -1);
                  }
              }
          }
      }
  };

  /**
  *   This method renders out the template data to a HTML canvas to finally
  *   create the sprite.
  *
  *   (note: only template locations with the values of -1 (border) are rendered)
  *
  *   @method renderPixelData
  *   @returns {undefined}
  */
  Sprite.prototype.renderPixelData = function() {
      var isVerticalGradient = Math.random() > 0.5;
      var saturation         = Math.max(Math.min(Math.random() * this.options.saturation, 1), 0);
      var hue                = Math.random();

      var u, v, ulen, vlen;
      if (isVerticalGradient) {
          ulen = this.height;
          vlen = this.width;
      } else {
          ulen = this.width;
          vlen = this.height;
      }

      for (u = 0; u < ulen; u++) {
          // Create a non-uniform random number between 0 and 1 (lower numbers more likely)
          var isNewColor = Math.abs(((Math.random() * 2 - 1) 
                                   + (Math.random() * 2 - 1) 
                                   + (Math.random() * 2 - 1)) / 3);

          // Only change the color sometimes (values above 0.8 are less likely than others)
          if (isNewColor > (1 - this.options.colorVariations)) {
              hue = Math.random();
          }

          for (v = 0; v < vlen; v++) {
              var val, index;
              if (isVerticalGradient) {
                  val   = this.getData(v, u);
                  index = (u * vlen + v) * 4;
              } else {
                  val   = this.getData(u, v);
                  index = (v * ulen + u) * 4;
              }

              var rgb = { r: 1, g: 1, b: 1 };

              if (val !== 0) {
                  if (this.options.colored) {
                      // Fade brightness away towards the edges
                      var brightness = Math.sin((u / ulen) * Math.PI) * (1 - this.options.brightnessNoise) 
                                     + Math.random() * this.options.brightnessNoise;

                      // Get the RGB color value
                      this.hslToRgb(hue, saturation, brightness, /*out*/ rgb);

                      // If this is an edge, then darken the pixel
                      if (val === -1) {
                          rgb.r *= this.options.edgeBrightness;
                          rgb.g *= this.options.edgeBrightness;
                          rgb.b *= this.options.edgeBrightness;
                      }

                  }  else {
                      // Not colored, simply output black
                      if (val === -1) {
                          rgb.r = 0;
                          rgb.g = 0;
                          rgb.b = 0;
                      }
                  }
              }

              this.pixels.data[index + 0] = rgb.r * 255;
              this.pixels.data[index + 1] = rgb.g * 255;
              this.pixels.data[index + 2] = rgb.b * 255;
              this.pixels.data[index + 3] = 255;
          }
      }

      this.ctx.putImageData(this.pixels, 0, 0);
  };


  /**
  *   This method converts HSL color values to RGB color values.
  *
  *   @method hslToRgb
  *   @param {h}
  *   @param {s}
  *   @param {l}
  *   @param {result}
  *   @returns {result}
  */
  Sprite.prototype.hslToRgb = function(h, s, l, result) {
      if (typeof result === 'undefined') {
          result = { r: 0, g: 0, b: 0 };
      }

      var i, f, p, q, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = l * (1 - s);
      q = l * (1 - f * s);
      t = l * (1 - (1 - f) * s);
      
      switch (i % 6) {
          case 0: result.r = l, result.g = t, result.b = p; break;
          case 1: result.r = q, result.g = l, result.b = p; break;
          case 2: result.r = p, result.g = l, result.b = t; break;
          case 3: result.r = p, result.g = q, result.b = l; break;
          case 4: result.r = t, result.g = p, result.b = l; break;
          case 5: result.r = l, result.g = p, result.b = q; break;
      }

      return result;
  };

  /**
  *   This method converts the template data to a string value for debugging
  *   purposes.
  *
  *   @method toString
  *   @returns {undefined}
  */
  Sprite.prototype.toString = function() {
      var h = this.height;
      var w = this.width;
      var x, y, output = '';
      for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
              var val = this.getData(x, y);
              output += val >= 0 ? ' ' + val : '' + val;
          }
          output += '\n';
      }
      return output;
  };

  // Pixel Sprite Generator module
  var psg = {
      version: "v0.0.2",
      Sprite: Sprite,
      Mask: Mask
  };

  // Export psg module
  root.psg = psg;
})(window);
/* eslint-enable */

var SPRITE_SCALE = 1
var SPRITE_COUNT = 50

var dragon = new psg.Mask([
  0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,
  0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,
  0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,
  0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,
  0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,
  0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,
  0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,
  0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,
  0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,
  0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,
  0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,
  0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,
  0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,
  0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,2,2,2,2,2,2,1,1,2,0,0,0,0,0,
  0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,
  0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,
  0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,
  0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,0,2,1,1,1,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,0,0,0,2,
  0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,0,2,1,1,2,0,0,2,1,1,2,0,0,0,2,1,1,2,0,0,2,0,0,2,
  0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,2,2,0,0,0,0,2,2,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  
], 48, 48, true, true)

/**
*   This method returns a scaled version of the image or canvas element passed
*   in using nearest-neighbor interpolation.
*
*   The original image is drawn into an offscreen canvas of the same size
*   and copied, pixel by pixel into another offscreen canvas with the 
*   new size.
*
*   For more info visit: 
*   http://phoboslab.org/log/2012/09/drawing-pixels-is-hard
*
*   @method resize
*   @param {img}
*   @param {scale}
*   @returns {canvas}
*/
var resize = function( img, scale ) {
  var widthScaled  = img.width * scale
  var heightScaled = img.height * scale
  
  var orig    = document.createElement('canvas')

  orig.width  = img.width
  orig.height = img.height

  var origCtx = orig.getContext('2d')

  origCtx.drawImage(img, 0, 0)

  var origPixels   = origCtx.getImageData(0, 0, img.width, img.height)
  var scaled       = document.createElement('canvas')

  scaled.width     = widthScaled
  scaled.height    = heightScaled
  var scaledCtx    = scaled.getContext('2d')
  var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled )
  
  for( var y = 0; y < heightScaled; y++ ) {
      for( var x = 0; x < widthScaled; x++ ) {
          var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4
          var indexScaled = (y * widthScaled + x) * 4

          scaledPixels.data[ indexScaled ]   = origPixels.data[ index ]
          scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ]
          scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ]
          scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ]
      }
  }

  scaledCtx.putImageData( scaledPixels, 0, 0 )

  return scaled
}

var fragment = document.createDocumentFragment()

var i, sprite, div

// Example 1
div = document.createElement('div')
div.innerText = 'Colored ship sprites'
div.appendChild(document.createElement('hr'))

// Example 4
div = document.createElement('div')
div.innerText = 'Colored dragon sprites'
div.appendChild(document.createElement('hr'))

// for (i = 0; i < SPRITE_COUNT; i++) {
//     sprite = new psg.Sprite(dragon, {
//         colored: true,
//         edgeBrightness: 0,
//         colorVariations: .1,
//         brightnessNoise: 0,
//         saturation: 1,

//     })
//     div.appendChild(resize(sprite.canvas, SPRITE_SCALE))
// }

sprite = new psg.Sprite(dragon, {
  colored: true,
  edgeBrightness: 0,
  colorVariations: .1,
  brightnessNoise: 0,
  saturation: 1,

})
div.appendChild(resize(sprite.canvas, SPRITE_SCALE))
fragment.appendChild(div)
document.body.appendChild(fragment)

/**
 * Azure stuff
 */
 const storageAccountName = 'bwfteststore'
 const containerName = 'bftestcontainer'
 const sasToken = '?sv=2020-08-04&ss=bf&srt=sco&sp=rwdlactfx&se=2021-09-05T11:33:07Z&st=2021-09-05T03:33:07Z&sip=71.212.157.169&spr=https&sig=stMUiVZBeA8JVBSFLyKSyIaSwBZsqvz%2FbYcepzFuF0Y%3D'

// <snippet_createBlobInContainer>
const createBlobInContainer = async (containerClient, file) => {
  
    // create blobClient for container
    const blobClient = containerClient.getBlockBlobClient(file.name)
  
    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } }
  
    // upload file
    await blobClient.uploadBrowserData(file, options)
  }
  // </snippet_createBlobInContainer>

// <snippet_getBlobsInContainer>
// return list of blobs in container to display
const getBlobsInContainer = async (containerClient) => {
    const returnedBlobUrls = []
  
    // get list of blobs in container
    // eslint-disable-next-line
    for await (const blob of containerClient.listBlobsFlat()) {
      // if image is public, just construct URL
      returnedBlobUrls.push(
        `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
      )
    }
  
    return returnedBlobUrls
  }
  // </snippet_getBlobsInContainer>

// <snippet_uploadFileToBlob>
const uploadFileToBlob = async (file) => {
    if (!file) return []
  
    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    )
  
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName)

    // await containerClient.createIfNotExists({
    //   access: 'container',
    // })
  
    // upload file
    await createBlobInContainer(containerClient, file)
  
    // get list of blobs in container
    return getBlobsInContainer(containerClient)
  }
  // </snippet_uploadFileToBlob>

/** Test NFT Storage */

const type = 'image/png'
const typeForFile = type
const ext = 'png'
const iter = 1
let uploadBtn
let submitBtn

function dataURLtoFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n)
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n)
    }
    
    return new File([u8arr], filename, { type:mime })
}

async function test(name, description, filename, data) {
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE3RTBEMTBCMEU0MmI5NmJhOTY5MDcwZUZFNDVBZkY0MDkzMDY5ODciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDc5Mzk4MTEwMiwibmFtZSI6ImJmLWpzMTNrLTIwMjEtYXBpa2V5In0.XhmhgIFuobjinEiRnb8ZtEEWvNu9SJEVjQ2J6I6tAZ8'
  const client = new NFTStorage({ token: apiKey })
  const imgEl = document.createElement('img')
//   const img = new File([data], filename, { type: typeForFile })
  const img = dataURLtoFile(data, filename)

  console.log('Generated:', img)
  console.log('Uploaded:', uploadBtn.files[0])
  
  imgEl.src = data
  
  document.body.appendChild(imgEl)
  document.body.appendChild(fragment)

  const metadata = await client.store({
    name,
    description,
    image: img
  })

  // uploadFileToBlob(uploadBtn.files[0])    
  // uploadFileToBlob(img)

  console.log(metadata.url)
}

console.log(sprite.canvas.toDataURL(type, 1.0))

window.onload = () => {
    console.log()
    uploadBtn = document.getElementById('upload')
    submitBtn = document.getElementById('submit')
    submitBtn.addEventListener('click', () => {
        test(`Ghost${iter}`, 'A random pixel art!', `ghost${iter}.${ext}`, sprite.canvas.toDataURL(type, 1.0))
    })
}

// ipfs://bafyreidcv5ywq6ltzimxnjq6z2s2e2hta223njefz2y5z3jxkdj3lc65zi/metadata.json

/*

curl -X POST --data-binary @shuttlesm.png -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE3RTBEMTBCMEU0MmI5NmJhOTY5MDcwZUZFNDVBZkY0MDkzMDY5ODciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDc5Mzk4MTEwMiwibmFtZSI6ImJmLWpzMTNrLTIwMjEtYXBpa2V5In0.XhmhgIFuobjinEiRnb8ZtEEWvNu9SJEVjQ2J6I6tAZ8' https://api.nft.storage/upload
https://ipfs.io/ipfs/bafkreifieq66vs6xy27eaayk7kishe3ue2hiajaj7pqvgzx7nlr6fhi6vi/metadata.json
*/
