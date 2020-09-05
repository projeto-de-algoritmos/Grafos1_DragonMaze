let w = 100;
let columns, rows;
let stack = [];
let board = [];
let current;
let x;
let y;
let player;
let direction;
let mazeFinished = false;
let end;

function setup() {
  createCanvas(windowWidth, windowHeight);

  columns = floor(width / w);
  rows = floor(height / w);

  board = createMatrix(columns, rows);
  x = 0;
  y = 0;
  current = board[0][0];
  player = board[0][0];
  end = board[columns - 1][rows - 1];
  end.final = true;
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
    }
    player.player = true;
    updateCoordinates();
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

function updateCoordinates() {
  switch (direction) {
    case 'right':
        player= board[1][0]
      break;
    case 'up':
      player = board[0][1]
      break;
    case 'left':
      player = board[0][0]
      break;
    case 'down':
      player = board[1][1]
      break;
  }
}

function keyPressed() {
  if (keyIsDown(UP_ARROW)) {
    direction = 'up';
  }
  else if (keyIsDown(DOWN_ARROW)) {
    direction = 'down';
  }
  else if (keyIsDown(LEFT_ARROW)) {
    direction = 'left';
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    direction = 'right';
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }
