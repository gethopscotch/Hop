var imagesAvailable = [
  "monkey.png",
  "bear.png",
  "icon.png",
  "octo.png"
]
var DisplayObject = {
  rotate: function(rotationSpeed) {
    var that = this
    // Listen for rotate update
    this.app.ticker.add(function(delta) {
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation

      that.pixiDisplay.rotation += rotationSpeed * delta;
    });
  },
  pulse: function() {
    var that = this
    if (that.sign === undefined || that.sign == undefined) {
      that.sign = 1
    }
    // Listen for rotate update
    this.app.ticker.add(function(delta) {
      if (that.pixiDisplay.scale.x > 2) {
        that.sign = -1
      } else if (that.pixiDisplay.scale.x < 0) {
        that.sign = 1
      }
      that.pixiDisplay.scale.x += 0.01 * delta * that.sign;
      that.pixiDisplay.scale.y = that.pixiDisplay.scale.x
    });
  }
}

function ImageHop(x, y, image) {
  var hop = new PIXI.Container()
  hop.x = x
  hop.y = y
  this.childImageHops = []
  if (image !== undefined) {
    var sprite = PIXI.Sprite.fromImage(image);
    sprite.scale.x = 0.2
    sprite.scale.y = 0.2
    hop.addChild(sprite)
  }

  this.pixiDisplay = hop;

}

ImageHop.prototype = DisplayObject;

ImageHop.prototype.addChildren = function(children) {
  for (var i = 0; i< children.length; i++) {
    this.addImageHop(children[i])
  }
}

ImageHop.prototype.addImageHop = function(hop) {
  this.pixiDisplay.addChild(hop.pixiDisplay);
  this.childImageHops.push(hop)
};

ImageHop.prototype.addNewImageHop = function(x, y, image) {
  var hop = new ImageHop(x, y, image);
  this.addImageHop(hop)
  return hop
}

function myRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
DisplayObject.app = app

function addImageHop(hop) {
  app.stage.addChild(hop.pixiDisplay);
}

function newImageHop(x, y, image) {
  var hop = new ImageHop(x, y, image);
  addImageHop(hop)
  return hop
}

document.addEventListener("DOMContentLoaded", function(event) {
  document.body.appendChild(app.view);
});
