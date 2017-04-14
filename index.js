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
function Sprite(x, y) {

  // create a new Sprite from an image path
  var icon = PIXI.Sprite.fromImage('icon.png')

  // center the sprite's anchor point
  icon.anchor.set(0.5);

  // move the sprite to the center of the screen
  icon.x = x
  icon.y = y
  icon.scale.x = 0.2
  icon.scale.y = 0.2

  this.pixiDisplay = icon;
}

Sprite.prototype = DisplayObject;

function Container(x, y) {
    var container = new PIXI.Container()
    container.x = x
    container.y = y

    this.pixiDisplay = container;
}

Container.prototype = DisplayObject;

Container.prototype.addChildren = function(sprites) {
  for (var i = 0; i< sprites.length; i++) {
    var child = sprites[i].pixiDisplay
    this.pixiDisplay.addChild(sprites[i].pixiDisplay);
  }
}



document.addEventListener("DOMContentLoaded", function(event) {
  var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
  document.body.appendChild(app.view);
  function myRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  function createSprites(amount) {
    var sprites = []
    for (var i = 0; i < amount; i++) {
      var min = 30
      var max = 100
      var sprite = new Sprite(myRandom(min, max), myRandom(min, max))
      sprite.rotate(app, 0.1)
      sprites.push(sprite)
    }
    return sprites
  }

  function createContainers(amount, delta) {
    var containers = []
    for (var i = 0; i < amount; i++) {
      var min = 30
      var max = 100
      var container = new Container(myRandom(min, max), myRandom(min, max))
      container.addChildren(createSprites(3))
      container.rotate(app, -0.1)
      container.pulse(app)
      containers.push(container)
    }
    return containers;
  }

  function containerOfContainers(x, y, amount, delta) {
    var container = new Container(x, y)
    container.addChildren(createContainers(amount, delta))
    return container
  }

  var container1 = new containerOfContainers(0, 0, 5, -0.1);
  var container2 = new containerOfContainers(100, 100, 4, -0.1);
  var container3 = new containerOfContainers(50, 240, 4, -0.1);
  var parent = new Container(300, 300);
  parent.addChildren([container1, container2, container3])
  parent.pulse(app)
  app.stage.addChild(parent.pixiDisplay);

});
