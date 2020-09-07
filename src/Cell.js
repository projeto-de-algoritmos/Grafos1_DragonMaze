class Cell {

  constructor(x, y, spaceX, spaceY) {
    this.id = x + "" + y;
    this.x = x;
    this.y = y;
    this.spaceX = spaceX;
    this.spaceY = spaceY;
    this.width = (this.x + this.spaceX / 2) * w;
    this.height = (this.y + this.spaceY / 2) * w;
    this.visited = false;
    this.neighbors = [];
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    },
      this.final = false;
    this.begin = x === 0 && y === 0 ? true : false;
    this.player = false;
    this.dragon = false;
    this.dragonVisited = false;
    this.finishPhase = this.finishPhase;
  }

  render() {
    // Render the cell
    strokeWeight(8);
    stroke(0);
    if (this.walls.top && !this.begin) {
      line(this.width, this.height, this.width + w, this.height);
    }
    if (this.walls.right && !this.final) {
      line(this.width + w, this.height, this.width + w, this.height + w);
    }
    if (this.walls.bottom && !this.final) {
      line(this.width + w, this.height + w, this.width, this.height + w);
    }
    if (this.walls.left && !this.begin) {
      line(this.width, this.height + w, this.width, this.height);
    }

    // Diferent kind of cells
    if (this.visited) {
      if (this.final) {
        noStroke();
        fill(170);
        textSize(32);
        rect(this.width, this.height, w * 2, w, 5);
      } else {
        noStroke();
        fill(96, 150, 186);
        rect(this.width, this.height, w, w);
      }
    }

    if (this.player) {
      image(img, this.width + w * 0.02, this.height + w * 0.02, w * 0.93, w * 0.93);
    }

    if (this.dragon) {
      image(dragonImg, this.width - w * 0.2, this.height, w + w * 0.3, w);
    }

    if (this.finishPhase) {
      fill(0, 0, 0);
      fill(96, 150, 186);
      rect(this.width, this.height, w, w);
    }
  }

  nextNeighbor() {
    // Return a random neighbor. this functions is used in DFS to generate the maze
    this.neighbors = [];
    let top = this.checkCoordinate(this.x, this.y - 1) ? board[this.x][this.y - 1] : null;
    let right = this.checkCoordinate(this.x + 1, this.y) ? board[this.x + 1][this.y] : null;
    let bottom = this.checkCoordinate(this.x, this.y + 1) ? board[this.x][this.y + 1] : null;
    let left = this.checkCoordinate(this.x - 1, this.y) ? board[this.x - 1][this.y] : null;

    if (top && !top.visited) {
      this.neighbors.push(top);
    }
    if (right && !right.visited) {
      this.neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      this.neighbors.push(bottom);
    }
    if (left && !left.visited) {
      this.neighbors.push(left);
    }

    if (this.neighbors.length > 0) {
      let selected = floor(random(0, this.neighbors.length));
      return this.neighbors[selected];
    } else {
      return undefined;
    }
  }

  allNeighbors() {
    // Return all neighbors. this functions is used in BFS to generate the dragon path
    this.neighbors = [];

    let top = this.checkCoordinate(this.x, this.y - 1) ? board[this.x][this.y - 1] : null;
    let right = this.checkCoordinate(this.x + 1, this.y) ? board[this.x + 1][this.y] : null;
    let bottom = this.checkCoordinate(this.x, this.y + 1) ? board[this.x][this.y + 1] : null;
    let left = this.checkCoordinate(this.x - 1, this.y) ? board[this.x - 1][this.y] : null;

    if (!this.walls.top && top) {
      this.neighbors.push(top);
    }
    if (!this.walls.right && right) {
      this.neighbors.push(right);
    }
    if (!this.walls.bottom && bottom) {
      this.neighbors.push(bottom);
    }
    if (!this.walls.left && left) {
      this.neighbors.push(left);
    }

    if (this.neighbors.length > 0) {
      return this.neighbors;
    } else {
      return undefined;
    }
  }


  checkCoordinate(x, y) {
    // Check a valid coordinate in the matrix
    return (x < 0 || x > columns - 1 || y < 0 || y > rows - 1) ? false : true;
  }

}