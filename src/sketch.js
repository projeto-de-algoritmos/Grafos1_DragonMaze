let w = 100;
let columns, rows;
let stack = [];
let board = [];
let current;
let player;
let mazeFinished = false;
let end;

function setup() {
  createCanvas(windowWidth, windowHeight);

  columns = floor(width / w);
  rows = floor(height / w);

  board = createMatrix(columns, rows);

  current = board[0][0];
  player = board[0][0];
  end = board[columns - 1][rows - 1];
  end.final = true;
}



function draw() {
  background(54, 54, 54);
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

    if (current.x === 0 && current.y === 0) {
      mazeFinished = true;
    }
  }

  if (mazeFinished) {
    console.log(player)
    player.player = true;
    if (keyIsDown(UP_ARROW)) {
      if (player.checkCoordinate(player.x, player.y - 1)) {
        player = board[player.x, player.y - 1];
      }
    }
    if (keyIsDown(DOWN_ARROW)) {
      if (player.checkCoordinate(player.x, player.y + 1)) {
        player = board[player.x, player.y + 1];
      }
    }
    if (keyIsDown(LEFT_ARROW)) {
      if (player.checkCoordinate(player.x - 1, player.y)) {
        player = board[player.x - 1, player.y];
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      if (player.checkCoordinate(player.x + 1, player.y)) {
        player = board[player.x + 1, player.y];
      }
    }
    console.log(player);
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