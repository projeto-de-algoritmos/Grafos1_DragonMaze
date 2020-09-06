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
    },
    this.final = false;
    this.begin = x === 0 && y === 0 ? true : false;
    this.player = false;
    this.finishPhase = this.finishPhase;
  }

  render() {
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

    if (this.visited) {
      noStroke();
      fill(205, 204, 0);
      rect(this.width, this.height, w, w);
    }

    if (this.player) {
      image(img, this.width + w * 0.02, this.height + w * 0.02, w * 0.93, w * 0.93);
    }

    if(this.finishPhase) {
      fill(0, 0, 0);
      rect(this.width, this.height, w, w);
    }

    if(this.final){
      noStroke();
      fill(0, 0, 0);
      textSize(32);
      text('Saída', this.width+10, this.height+70)
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