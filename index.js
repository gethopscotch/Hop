var DisplayObject = {
  rotate: function(app, rotationSpeed) {
    var that = this
    // Listen for rotate update
    app.ticker.add(function(delta) {
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation

      that.pixiDisplay.rotation += rotationSpeed * delta;
    });
  },
  pulse: function(app) {
    var that = this
    if (that.sign === undefined || that.sign == undefined) {
      that.sign = 1
    }
    // Listen for rotate update
    app.ticker.add(function(delta) {
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

function Hop(x, y, image) {
  var hop = new PIXI.Container()
  hop.x = x
  hop.y = y

  if (image !== undefined) {
    var sprite = PIXI.Sprite.fromImage(image);
    sprite.scale.x = 0.2
    sprite.scale.y = 0.2
    hop.addChild(sprite)
  }

  this.pixiDisplay = hop;
}

Hop.prototype = DisplayObject;

Hop.prototype.addChildren = function(children) {
  for (var i = 0; i< children.length; i++) {
    var child = children[i].pixiDisplay
    this.pixiDisplay.addChild(children[i].pixiDisplay);
  }
}



document.addEventListener("DOMContentLoaded", function(event) {
  var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
  document.body.appendChild(app.view);
  function myRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  function createHopsWithImages(amount) {
    var hops = []
    for (var i = 0; i < amount; i++) {
      var min = 30
      var max = 100
      var hop = new Hop(myRandom(min, max), myRandom(min, max), "icon.png")
      hop.rotate(app, 0.1)
      hops.push(hop)
    }
    return hops
  }

  function createHops(amount, delta) {
    var hops = []
    for (var i = 0; i < amount; i++) {
      var min = 30
      var max = 100
      var hop = new Hop(myRandom(min, max), myRandom(min, max))
      hop.addChildren(createHopsWithImages(7))
      hop.rotate(app, -0.1)
      hop.pulse(app)
      hops.push(hop)
    }
    return hops;
  }

  function hopOfHops(x, y, amount, delta) {
    var hop = new Hop(x, y)
    hop.addChildren(createHops(amount, delta))
    return hop
  }

  var hop1 = new hopOfHops(0, 0, 5, -0.1);
  var hop2 = new hopOfHops(100, 100, 4, -0.1);
  var hop3 = new hopOfHops(50, 240, 4, -0.1);
  var parent = new Hop(300, 300);
  parent.addChildren([hop1, hop2, hop3])
  parent.pulse(app)
  app.stage.addChild(parent.pixiDisplay);

});
