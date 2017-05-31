var hopGrammar = ohm.grammarFromScriptElement()
var imagesAvailable = [
  "monkey.png",
  "bear.png",
  "icon.png",
  "octo.png"
]

var PIXIDisplayObject = {
  // {speed: speed}
  rotate: function(parameters) {
    var that = this
    // Listen for rotate update
    this.app.ticker.add(function(delta) {

      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation
      var rotationSpeed = 0.01
      if (!!parameters.speed) {
        rotationSpeed = parameters.speed
      }

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

// hopObject = { image:  image, x: xPosition, y: yPosition}
function Hop(hopObject) {
  var pixiDisplay = new PIXI.Container()
  pixiDisplay.x = hopObject.x
  pixiDisplay.y = hopObject.y
  this.pixiDisplay = pixiDisplay
  this.children = []
  if (!!hopObject.image) {
    var sprite = PIXI.Sprite.fromImage(hopObject.image);
    sprite.scale.x = 0.2
    sprite.scale.y = 0.2
    this.pixiDisplay.addChild(sprite)
  }

  if (!!hopObject.texture) {
    this.pixiDisplay.addChild(hopObject.texture)
  }
}


var Shapes = {}

var rectangle = new PIXI.Graphics()

var padding = 10
var style = {fontFamily: "Avenir", align: 'center'}
var text = new PIXI.Text("pulse", style)
text.x = padding
text.y = padding

rectangle.interactive = true;
rectangle.lineStyle(0);
rectangle.beginFill(0xFFFF0B, 0.5);
rectangle.drawRect(0, 0, text.width + 2 * padding, text.height + 2 * padding);
rectangle.endFill();
rectangle.addChild(text)


Shapes.rectangle = rectangle



Hop.prototype = PIXIDisplayObject

Hop.prototype.addChildren = function(children) {
  for (var i = 0; i< children.length; i++) {
    this.addHop(children[i])
  }
}

Hop.prototype.addHop = function(hop) {
  this.pixiDisplay.addChild(hop.pixiDisplay);
  this.children.push(hop)
};

// hopObject = { image:  image, x: xPosition, y: yPosition}
Hop.prototype.addNewHop = function(hopObject) {
  var hop = new Hop(hopObject);
  this.addHop(hop)
  return hop
}

var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
PIXIDisplayObject.app = app

function addHop(hop) {
  app.stage.addChild(hop.pixiDisplay);
}
// hopObject = { image:  image, x: xPosition, y: yPosition}
function newHop(hopObject) {
  var hop = new Hop(hopObject);
  addHop(hop)
  return hop
}

document.addEventListener("DOMContentLoaded", function(event) {
  document.body.appendChild(app.view);
});
