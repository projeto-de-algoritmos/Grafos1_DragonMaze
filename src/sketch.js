const INITIALPHASE = 100;
const LASTPHASE = 50;
const NEXTPHASE = -10;
const TIMETOUPDATEDRAGONPATH = 10;
const TIMETOMOVEDRAGON = 3;

//Game State

let w = INITIALPHASE;
let columns, rows;
let current;
let end;
let instructions = true;
let player;
let dragon;
let board = [];
let stack = [];
let mazeFinished = false;
let gameFinished = false;
let countMoveDragonTime = TIMETOMOVEDRAGON;
let countUpdateDragonPath = TIMETOUPDATEDRAGONPATH;
let gameOver = false;
let playerCanWalk = true;

//Images

let img;
let dragonImg;
let dragonPath;
let gameOverImg;
let dragonInitImg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameInitConfig();
}


function reset() {
  // reset and update values
  if (gameOver || gameFinished) {
    gameOver = false;
    gameFinished = false;
    w = INITIALPHASE;
    instructions = true;
  } else {
    w = w + NEXTPHASE;
    if (w === LASTPHASE) {
      gameFinished = true;
    }
  }
  columns = [];
  rows = [];
  stack = [];
  board = [];
  mazeFinished = false;
  current = '';
  player = '';
  end = '';
  dragonPath = '';
  countMoveDragonTime = TIMETOMOVEDRAGON;
  countUpdateDragonPath = TIMETOUPDATEDRAGONPATH;
  setup()
}

function preload() {
  // Images used along the game
  img = loadImage('assets/character.gif');
  dragonImg = loadImage('assets/dragonWalking.gif');
  gameOverImg = loadImage('assets/gameover.gif');
  finishGame = loadImage('assets/treasure.jpg');
  arrowKeys = loadImage('assets/arrow-keys.jpg');
  dragonInitImg = loadImage('assets/dragon.gif');
}

function draw() {
  background(54, 54, 54);
  arrowsControl();

  // Draw Game
  if (gameFinished) {
    renderGameFinished();
  }
  else if (dragon && dragon.id === player.id) {
    dragonFoundPlayer();
  } else if (instructions) {
    renderHomeScreen();
  } else {
    generateMaze();
  }

  if (mazeFinished) {
    afterGenerateMaze();
  }

  if (player.id === end.id) {
    reset();
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (instructions) {
      instructions = false;
    }
    if (gameOver || gameFinished) {
      reset();
    }
  }
}


function arrowsControl() {
  if (!mazeFinished || gameOver) {
    // Arrows doesn't work during final game and game over
    return null;
  }

  if (keyIsDown(LEFT_ARROW)) {
    if (player.checkCoordinate(player.x - 1, player.y) && !player.walls.left && playerCanWalk) {
      playerCanWalk=false;
      player.player = false;
      player = board[player.x - 1][player.y];
    }
  }

  if (keyIsDown(RIGHT_ARROW)) {
    if (player.checkCoordinate(player.x + 1, player.y) && !player.walls.right && playerCanWalk ) {
      playerCanWalk=false;
      player.player = false;
      player = board[player.x + 1][player.y];
    }
  }

  if (keyIsDown(UP_ARROW)) {
    if (player.checkCoordinate(player.x, player.y - 1) && !player.walls.top && playerCanWalk) {
      playerCanWalk=false;
      player.player = false;
      player = board[player.x][player.y - 1];
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    if (player.checkCoordinate(player.x, player.y + 1) && !player.walls.bottom && playerCanWalk) {
      playerCanWalk=false;
      player.player = false;
      player = board[player.x][player.y + 1];
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createMatrix(columns, rows) {
  let spaceX = width / w - columns;
  let spaceY = height / w - rows;
  let matrix = [];

  // Generate all cells of the maze
  for (let x = 0; x < columns; x++) {
    let row = [];
    for (let y = 0; y < rows; y++) {
      let cell = new Cell(x, y, spaceX, spaceY);
      row.push(cell);
    }
    matrix.push(row);
  }

  return matrix;
}

function removeWall(current, next) {
  // Remove walls between two cells to generate a path
  let x = current.x - next.x;
  if (x === 1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (x === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }
  let y = current.y - next.y;
  if (y === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  } else if (y === -1) {
    current.walls.bottom = false;
    next.walls.top = false;
  }
}

function defineDragonRoute() {
  // BFS to define a path from the dragon to the player
  let paths = [];
  let path = [];
  path.push(dragon);
  paths.push([...path]);

  for (x = 0; x < board.length; x++) {
    for (y = 0; y < board[x].length; y++) {
      board[x][y].dragonVisited = false;
    }
  }

  while (paths.length > 0) {
    path = paths.shift();
    let last = path[path.length - 1]
    if (last.id === player.id) {
      break;
    }

    let neighbors = last.allNeighbors();

    for (let i = 0; i < neighbors.length; i++) {
      if (!neighbors[i].dragonVisited) {
        neighbors[i].dragonVisited = true;
        let newPath = [...path];
        newPath.push(neighbors[i]);
        paths.push([...newPath]);
      }
    }
  }

  dragonPath = path;
  dragonPath.shift();
}

function delayToWalk() {
  // delay to player walk slow
  playerCanWalk = true;
}

function timeIt() {
  // function called every 1000 ms 
  if (mazeFinished && !gameOver) {
    if (countMoveDragonTime > 0) {
      countMoveDragonTime--;
    } else {
      if (dragonPath && dragonPath.length > 0) {
        dragon.dragon = false;
        dragon = dragonPath.shift();
        countMoveDragonTime = TIMETOMOVEDRAGON;
      }
    }
    if (countUpdateDragonPath > 0) {
      countUpdateDragonPath--;
    } else {
      countUpdateDragonPath = TIMETOUPDATEDRAGONPATH;
    }
  }
}

function gameInitConfig() {
  // Board config
  columns = floor(width / w);
  rows = floor(height / w);
  board = createMatrix(columns, rows);

  // Watch current cell
  current = board[0][0];

  // Insert player
  player = board[0][0];

  // Watch final cell
  end = board[columns - 1][rows - 1];
  end.final = true;

  // Set randomly dragon
  dragon = w < INITIALPHASE ? board[floor(random() * columns)][floor(random() * rows)] : null;
  setInterval(timeIt, 1000);

  // Free player to walk
  setInterval(delayToWalk, 400);
}

function renderGameFinished() {
  textAlign(CENTER, CENTER);
  textSize(width * 0.02);
  fill(255);
  text('Congratulations warrior!', width / 2, height / 8);
  textSize(width * 0.015);
  text('You have overcome the beast and passed through the maze, you have reached the legendary treasure!', width * 0.5, height * 0.2);
  image(finishGame, width * 0.25, height / 4, width * 0.5, height * 0.6);
  textAlign(CENTER, CENTER);
  textSize(width * 0.01);
  fill(255);
  text('Press Enter to continue...', width / 2, height * 0.9);
}

function dragonFoundPlayer() {
  gameOver = true;
  image(gameOverImg, width / 4, height / 8);
  textAlign(CENTER, CENTER);
  textSize(width * 0.03);
  fill(255);
  text('Game over', width / 2, height * 0.8);
  textAlign(CENTER, CENTER);
  textSize(width * 0.01);
  fill(255);
  text('Press Enter to continue...', width / 2, height * 0.9);
}

function renderHomeScreen() {
  image(dragonInitImg, width * 0.25, 0);
  textStyle(BOLD);
  fill(255, 0, 0);
  textSize(80);
  text('DRAGON MAZE', width / 2, height / 1.5);
  textSize(width * 0.015);
  fill(255, 255, 255);
  textAlign(CENTER, TOP);
  text('Press Enter to start the game ...', width / 2, height / 2);
  textSize(24);
  textAlign(CENTER, CENTER);
  text('Stay alive through the 5 levels\n of the maze to escape this challenge\n and conquer the hidden treasure.\n Watch out for the DRAGON! \n Press arrow keys to move during the game', width / 3, height / 1.25);
  image(arrowKeys, width * 0.6, height * 0.68);
  textAlign(CENTER, BOTTOM);
}

function generateMaze() {
  for (x = 0; x < board.length; x++) {
    for (y = 0; y < board[x].length; y++) {
      // Render all cells
      board[x][y].render();
    }
  }

  // DFS to generate maze
  current.visited = true;
  let nextNeighbor = current.nextNeighbor();

  if (nextNeighbor) {
    nextNeighbor.visited = true;
    stack.push(current);
    removeWall(current, nextNeighbor);
    current = nextNeighbor;

  } else if (stack.length > 0) {
    current = stack.pop();

    if (current.id === "00") {
      // If the current cell is the inital cell. the maze is ready
      mazeFinished = true;
    }
  }
}

function afterGenerateMaze() {
  // Show player
  player.player = true;

  // Dragon appear after 1st phase
  if (w < INITIALPHASE) {
    dragon.dragon = true;
    if (countUpdateDragonPath === 0)
      // Update Dragon Route
      defineDragonRoute();
  }
}