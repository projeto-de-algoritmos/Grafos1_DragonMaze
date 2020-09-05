class Cell {

  constructor(x, y, spaceX, spaceY) {
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
    }
  }

  render() {
    strokeWeight(4);
    stroke(0);
    if (this.walls.top) {
      line(this.width, this.height, this.width + w, this.height);
    }
    if (this.walls.right) {

      line(this.width + w, this.height, this.width + w, this.height + w);
    }
    if (this.walls.bottom) {

      line(this.width + w, this.height + w, this.width, this.height + w);
    }
    if (this.walls.left) {

      line(this.width, this.height + w, this.width, this.height);
    }

    if (this.visited) {
      noStroke();
      fill(75, 0, 130);
      rect(this.width, this.height, w, w);
    }
  }

  nextNeighbor() {
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

  checkCoordinate(x, y) {
    return (x < 0 || x > columns - 1 || y < 0 || y > rows - 1) ? false : true;
  }
}