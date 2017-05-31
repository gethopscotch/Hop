var imagesAvailable = [
  "square.png",
  "triangle.png",
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
    sprite.scale.x = 0.5
    sprite.scale.y = 0.5
    this.pixiDisplay.addChild(sprite)
  }

  if (!!hopObject.texture) {
    this.pixiDisplay.addChild(hopObject.texture)
  }
}



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

var hero = new PIXI.Graphics()
hero.ay = 0
hero.vy = 0
var enemy = new PIXI.Graphics()
enemy.vx = -5

var onStart = function() {

  hero.interactive = true;
  hero.lineStyle(0);
  hero.beginFill(0xFFFF0B, 0.5);
  hero.drawRect(0, 0, 90, 90)
  hero.endFill();
  hero.x = 100
  hero.y = 400

  app.stage.addChild(hero)

  enemy.lineStyle(0)
  enemy.beginFill(0xF6A623, 1.0)
  enemy.drawCircle(30, 60, 30)
  enemy.endFill()
  enemy.x = 400
  enemy.y = hero.y
  app.stage.addChild(enemy)
}

function boxesIntersect(sprite1, sprite2) {
  var b1 = sprite1.getBounds()
  var b2 = sprite2.getBounds()
  b1.maxX = b1.x + b1.width
  b2.maxX = b2.x + b2.width
  b1.maxY = b1.y + b1.height
  b2.maxY = b2.y + b2.height
  var verticalOverlap = (b2.y <= b1.maxY && b1.maxY <= b2.maxY) ||
    (b2.y <= b1.y && b1.y <= b2.maxY) ||
    (b1.y <= b2.y && b2.y <= b1.maxY) ||
    (b1.y <= b2.y && b2.y <= b1.maxY)
  var horizontalOverlap = (b2.x <= b1.maxX && b1.maxX <= b2.maxX) ||
    (b2.x <= b1.x && b1.x <= b2.maxX) ||
    (b1.x <= b2.x && b2.x <= b1.maxX) ||
    (b1.x <= b2.x && b2.x <= b1.maxX)
  return verticalOverlap && horizontalOverlap
}

function onTick() {
  enemy.x += enemy.vx
  if (enemy.x < 0) {
    enemy.x = 800 + Math.floor(Math.random() * 400)
  }
  hero.vy = hero.vy + hero.ay
  hero.y += hero.vy
  if(hero.y == 400) {
    hero.ay = 0
    hero.vy = 0
  } else if (hero.y >= 400) {
    hero.ay = 0
    hero.vy = 0
    hero.y = 400
  } else {
    hero.ay = 1.0
  }
  if (boxesIntersect(hero, enemy)) {
    hero.alpha = 0.4
  } else {
    hero.alpha = 1.0
  }
}


document.addEventListener("DOMContentLoaded", function(event) {
  document.body.appendChild(app.view);
  onStart()
  app.ticker.add(onTick)
});

document.addEventListener("keydown", function(event) {
  event.preventDefault()
  if (event.code == "Space") {
    if (hero.y == 400) {
      hero.ay = -20
    }
  }
})
