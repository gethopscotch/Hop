var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});

var hero = new PIXI.Graphics()
hero.accelerationY = 0
hero.velocityY = 0
var enemy = new PIXI.Graphics()
enemy.velocityX = -5

var exportProps = function() {
  return {
    x: this.x,
    y: this.y,
    velocityX: this.velocityX,
    velocityY: this.velocityY,
    ax: this.ax,
    accelerationY: this.accelerationY,
    colliding: this.isColliding
  }
}

var loadProps = function(props) {
  this.x = props.x
  this.y = props.y
  this.velocityX = props.velocityX
  this.velocityY = props.velocityY
  this.ax = props.ax
  this.accelerationY = props.accelerationY
}

hero.exportProps = exportProps
hero.loadProps = loadProps
enemy.exportProps = exportProps
enemy.loadProps = loadProps

var onStart = function() {

  hero.interactive = true;
  hero.lineStyle(0);
  hero.beginFill(0xFFFFFF, 1);
  hero.tint = 0x50E3C2
  hero.drawRect(0, 0, 90, 90)
  hero.endFill();
  hero.x = 100
  hero.y = 400

  app.stage.addChild(hero)

  enemy.lineStyle(0)
  enemy.beginFill(0xF6A623, 1.0)
  enemy.drawCircle(30, 60, 30)
  enemy.endFill()
  enemy.x = 800
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

var enemyStates = []
var heroStates = []
var index = 0

function updateDisplay(enemy, hero) {
  message = ""

  var max = Math.min(index + 50, enemyStates.length - 1)
  for (var i = max; i >= index - 50; i--) {
    if (i == (index - 1)) {
      message += "<div id='activestate' style='background:#F8E81C'>"
    }
    message += i + 1 + ") enemy: " + JSON.stringify(enemyStates[i]) 
    message += "<br /> hero: " + JSON.stringify(heroStates[i])
    message += "<hr>"
    if (i == index - 1) {
      message += "</div>"
    }
  }


  document.getElementById('messages').innerHTML = message
}

function onTick(forward, update) {
  if (!update && !shouldTick) {
    return
  }
  updateDisplay(enemy, hero)

  var activeState = document.getElementById("activestate")
  if (activeState) {
    activeState.scrollIntoView(false)
  }
  var shouldMoveForward = (index >= enemyStates.length - 1 && forward)
  if (update && !shouldMoveForward) {
    if (!forward) {
      index -= 1
      if (index < 0) {
        index = 0
      }
    } else {
      index += 1
      if (index >= enemyStates.length) {
        index = enemyStates.length - 1
      }
    }

    enemy.loadProps(enemyStates[index])
    hero.loadProps(heroStates[index])
  } else {
    enemyStates = enemyStates.slice(0, index)
    heroStates = heroStates.slice(0, index)
    index += 1
    enemyStates.append(enemy.exportProps())
    heroStates.append(hero.exportProps())
    enemy.x += enemy.velocityX

    if (enemy.x < 0) {
      enemy.x = 800 + Math.floor(Math.random() * 400)
    }
    hero.velocityY = hero.velocityY + hero.accelerationY
    hero.y += hero.velocityY
    if(hero.y == 400) {
      hero.accelerationY = 0
      hero.velocityY = 0
    } else if (hero.y >= 400) {
      hero.accelerationY = 0
      hero.velocityY = 0
      hero.y = 400
    } else {
      hero.accelerationY = 0.98
    }
  }

  if (boxesIntersect(hero, enemy)) {
    hero.tint = 0xD0011B
    hero.isColliding = true
    enemy.isColliding = true
  } else {
    hero.tint = 0x50E3C2
    hero.isColliding = false
    enemy.isColliding = false
  }

  if (update) {
    app.ticker.update()
  }
}


var shouldTick = true
function togglePlay(event) {
  if (shouldTick) {
    document.getElementById('play').innerHTML = "Play"
    document.getElementById('back').hidden = false
    document.getElementById('forward').hidden = false
    shouldTick = false
  } else {
    document.getElementById('play').innerHTML = "Stop"
    document.getElementById('back').hidden = true
    document.getElementById('forward').hidden = true
    shouldTick = true
  }
}


document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('pixicanvas').appendChild(app.view);

  var playBtn = document.getElementById("play")
  playBtn.addEventListener("click", togglePlay)
  document.getElementById("forward").addEventListener("click", function(event) {
    onTick(true, true)
  });
  document.getElementById("back").addEventListener("click", function(event) {
    onTick(false, true)
  });

  document.getElementById("togglemessages").addEventListener("click", function(e) {
    hidden = document.getElementById("messages").hidden
    document.getElementById("messages").hidden = !hidden
    if (hidden) {
      e.target.innerHTML = "Hide messages"
    } else {
      e.target.innerHTML = "Show messages"
    }

  })

  onStart()
  app.ticker.add(function() { onTick(true, false) })
});

document.addEventListener("keydown", function(event) {
  event.preventDefault()
  if (event.code == "Space" ) {
    if (hero.y == 400) {
      hero.accelerationY = -20
      enemyStates = enemyStates.slice(0, index)
      heroStates = heroStates.slice(0, index)
    }
  }

  if (event.code == "ArrowRight") {
    onTick(true, true)
  }

  if (event.code == "ArrowLeft") {
    onTick(false,true)
  }

  if(event.code == "Escape") {
    togglePlay(event)
  }

})

