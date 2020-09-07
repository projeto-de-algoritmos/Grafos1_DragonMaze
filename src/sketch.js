const LASTPHASE = 50;
const NEXTPHASE = -10;
let w = 100;
let columns, rows;
let stack = [];
let board = [];
let mazeFinished = false;
let current;
let player;
let end;
let gameFinished = false;
let img;
let nextPhase;
let instructions;

function setup() {
  createCanvas(windowWidth, windowHeight);

  columns = floor(width / w);
  rows = floor(height / w);
  instructions = true;
  board = createMatrix(columns, rows);
  current = board[0][0];
  player = board[columns - 2][rows - 1];
  end = board[columns - 1][rows - 1];
  end.final = true;
}


function reset() {
  w = w + NEXTPHASE;
  if (w === LASTPHASE) {
    gameFinished = true;
  }
  columns = [];
  rows = [];
  stack = [];
  board = [];
  mazeFinished = false;
  current = '';
  player = '';
  end = '';
  setup()
}

function preload() {
  img = loadImage('assets/character.gif');
  finishGame = loadImage('assets/treasure.gif');
  arrowKeys = loadImage('assets/arrow-keys.jpg');
  dragon = loadImage('assets/dragon.gif');
}

function draw() {
  background(54, 54, 54);
  if (gameFinished) {
    textSize(22);
    text('Parabéns! Você terminou todas as fases!', width / 2.5, height / 8);
    image(finishGame, width / 2.4, height / 4);
  } else if (nextPhase) {
    fill(255, 255, 255)
    text('Você finalizou a fase, aperte enter para seguir para a próxima fase', width / 2, height / 2);
  } else if (instructions) {
    // dragao
    // enter
    // logo
    // instruções // seta
    image(dragon, width / 3.5, height / 100);
    textStyle(BOLD);
    fill(255,0,0);
    textSize(80);
    text('DRAGON MAZE', width/2, height / 1.5);
    textSize(24);
    fill(255,255,255);
    textAlign(CENTER, TOP);
    text('Press Enter to start the game ...', width / 2, height / 2);
    textAlign(CENTER, CENTER);
    text('Stay alive for 5 levels of the maze to get the treasure', width / 3, height / 1.25);
    text('Press arrow keys to move during the game', width / 3, height / 1.15);
    image(arrowKeys, width / 1.8, height / 1.3);
    textAlign(CENTER, BOTTOM);
    if (keyCode === ENTER) {
      instructions = false;
    }
  } else {
    for (x = 0; x < board.length; x++) {
      for (y = 0; y < board[x].length; y++) {
        board[x][y].render();
      }
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

    if (current.x === 0 && current.y === 0) {
      mazeFinished = true;
    }
  }

  if (mazeFinished) {
    player.player = true;
    player.img = img;

  }

  if (player.x === end.x && player.y === end.y) {
    nextPhase = true;
    if (keyCode === ENTER) {
      nextPhase = false;
      reset();
    }
  }
}

function keyPressed() {
  if (!mazeFinished) {
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