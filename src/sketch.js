const INITIALPHASE = 100;
const LASTPHASE = 50;
const NEXTPHASE = -10;
const TIMETOUPDATEDRAGONPATH = 10;
const TIMETOMOVEDRAGON = 3;
let w = INITIALPHASE;
let columns, rows;
let stack = [];
let board = [];
let mazeFinished = false;
let current;
let player;
let end;
let gameFinished = true;
let img;
let dragonImg;
let dragonPath;
let gameOverImg;
let countMoveDragonTime = 3;
let countUpdateDragonPath = 0;
let gameOver = false;
let nextPhase;
let instructions = true;
let dragon;
let dragonInitImg;

function setup() {
  createCanvas(windowWidth, windowHeight);

  columns = floor(width / w);
  rows = floor(height / w);
  board = createMatrix(columns, rows);
  current = board[0][0];
  player = board[0][0];
  end = board[columns - 1][rows - 1];
  end.final = true;
  dragon = board[floor(random() * columns)][floor(random() * rows)];
  setInterval(timeIt, 1000);
}


function reset() {
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
  countMoveDragonTime = 3;
  countUpdateDragonPath = 0;
  setup()
}
function preload() {
  img = loadImage('assets/character.gif');
  dragonImg = loadImage('assets/dragonWalking.gif');
  gameOverImg = loadImage('assets/gameover.gif');
  finishGame = loadImage('assets/treasure.jpg');
  arrowKeys = loadImage('assets/arrow-keys.jpg');
  dragonInitImg = loadImage('assets/dragon.gif');
}

function draw() {
  background(54, 54, 54);
  if (gameFinished) {
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
  else if (dragon.id === player.id) {
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
  } else if (instructions) {
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
  } else {
    for (x = 0; x < board.length; x++) {
      for (y = 0; y < board[x].length; y++) {
        board[x][y].render();
      }
    }

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
        mazeFinished = true;
      }
    }
  }

  if (mazeFinished) {
    player.player = true;
    dragon.dragon = true;
    if (countUpdateDragonPath === 0)
      defineDragonRoute();
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

  if (!mazeFinished || gameOver) {
    return null;
  }

  if (keyCode === LEFT_ARROW && player.checkCoordinate(player.x - 1, player.y) && !player.walls.left) {
    player.player = false;
    player = board[player.x - 1][player.y];
  }
  else if (keyCode === RIGHT_ARROW && player.checkCoordinate(player.x + 1, player.y) && !player.walls.right) {
    player.player = false;
    player = board[player.x + 1][player.y];
  } else if (keyCode === UP_ARROW && player.checkCoordinate(player.x, player.y - 1) && !player.walls.top) {
    player.player = false;
    player = board[player.x][player.y - 1];
  } else if (keyCode === DOWN_ARROW && player.checkCoordinate(player.x, player.y + 1) && !player.walls.bottom) {
    player.player = false;
    player = board[player.x][player.y + 1];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createMatrix(columns, rows) {
  let spaceX = width / w - columns;
  let spaceY = height / w - rows;
  let matrix = [];

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

function timeIt() {
  if (mazeFinished && !gameOver) {
    if (countMoveDragonTime > 0) {
      countMoveDragonTime--;
    } else {
      if (dragonPath.length > 0) {
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