// Game Variables
var score = 0;
var time = 60;
var level = 1;
var intervalId;
var timeoutIds = [];
var gameStarted = false;
var redclicks = 0;
var greenclicks = 0;
var highScore = 0;

// Game Levels
var levels = [
  {
    numSquares: 60,
    interval: 1000,
    colors: ["green", "red"],
    message: ["Your time is over! Final score: ","Green clicks: ","Red clicks: "]
  }
];

// Game Functions
function startGame() {
  gameStarted = true;
  time = 60;
  score = 0;
  redclicks = 0;
  greenclicks = 0;
  intervalId = setInterval(countdown, 1000);
  spawnSquares();
}

function countdown() {
  if (time == 0) {
    endGame();
    return;
  }
  time--;
  $("#time").text(time);
}

function spawnSquares() {
  for (var i = 0; i < levels[level - 1].numSquares; i++) {
    var timeoutId = setTimeout(spawnSquare, i * levels[level - 1].interval);
    timeoutIds.push(timeoutId);
  }
}

function spawnSquare() {

  var existingShapes = [];
  var shapes = ["square", "hex", "circle","burst-8"];
  var shape = shapes[Math.floor(Math.random() * shapes.length)];
  var color = levels[level - 1].colors[Math.floor(Math.random() * levels[level - 1].colors.length)];
  var size = 80;
  var x = Math.floor(Math.random() * ($("#game").width() - size) - 10);
  var y = Math.floor(Math.random() * ($("#game").height() - size) - 10);
  var $shape;

  switch (shape) {
    case "square":
      $shape = $("<div class='square'></div>");
      break;
    case "hex":
      $shape = $("<div class='hex'></div>");
      break;
    case "circle":
      $shape = $("<div class='circle'></div>");
      break;
    case "burst-8": 
      $shape = $("<div class='burst-8'></div>");
  }

  $shape.css(
  {
    "background-color": color,
    "border-color":color,
    "left": x,
    "top": y
  });

  // to avoid overlappping 
  var overlapsExistingShape = true;
  while (overlapsExistingShape) {
    overlapsExistingShape = false;
    for (var i = 0; i < existingShapes.length; i++) {
      var existingShape = existingShapes[i];
      if (x + size > existingShape.x && x < existingShape.x + existingShape.size &&
          y + size > existingShape.y && y < existingShape.y + existingShape.size) {
        overlapsExistingShape = true;
        x = Math.floor(Math.random() * ($("#game").width() - size) - 10);
        y = Math.floor(Math.random() * ($("#game").height() - size) - 10);
        $shape.css({
          "left": x,
          "top": y
        });
        break;
      }
    }
  }

  // click function
  $shape.click(function() {
    if ($(this).css("background-color") == "rgb(255, 0, 0)") {
      redclicks++;
    } else {
        greenclicks++;
    }
    score = greenclicks - redclicks;

    // high score storation
    if(highScore < score) {
        highScore = score;
        storeHighscore();
      }
    $("#high-score").text(highScore);
    $("#score").text(score);
    $(this).fadeOut(200);
  });
  $("#game").append($shape);
  setTimeout(function() {
    $shape.fadeOut(200);
  }, 1000);

  // store current position
  existingShapes.push({
    "x": x,
    "y": y,
    "size": size
  });

}

//function to store highScore
function storeHighscore() {
    localStorage.setItem("highScore",highScore);
}


// function for End game
function endGame() {
  clearInterval(intervalId);
  gameStarted = false;
  $("#level-buttons button").css('background', '#81adee');
  
  for (var i = 0; i < timeoutIds.length; i++) {
    clearTimeout(timeoutIds[i]); // use the stored IDs to clear the timeouts
  }

  $("#game").empty();
  $("#game").append("<div class='message'>" + levels[level - 1].message[1] + greenclicks + "</div>");
  $("#game").append("<div class='message'>" + levels[level - 1].message[2] + redclicks + "</div>");
  $("#game").append("<div class='message'>" + levels[level - 1].message[0] + score + "</div>");


}

// reset Game
function resetGame() {
  // Stop game and clear timeouts
  clearInterval(intervalId);
  for (var i = 0; i < timeoutIds.length; i++) {
    clearTimeout(timeoutIds[i]);
  }

  // Reset game variables and UI
  gameStarted = false;
  redclicks = 0;
  greenclicks = 0;
  score = 0;
  time = 60;
  level = 0;
  timeoutIds = [];
  $("#score").text(score);
  $("#time").text(time);
  $("#game").empty();

  // Reset level buttons
  $("#level-buttons button").css('background', '#81adee');
}


// Game Setup
$(document).ready(function() {

  // load the high score from local storage
  if(localStorage.getItem("highScore")) {
    highScore = parseInt(localStorage.getItem("highScore"));
  }

  // reset button
  $("#reset").click(function() {
    resetGame();
  });

  $("#level1").click(function() {
    if (gameStarted) return;
    else {
      resetGame();
      $("#level1").css('background', '#43e555');
      level = 1;
      startGame();
    }
  });
});

// Reset game on page load
$(window).on("load", function() {
  resetGame();
});
