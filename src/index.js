

class GridSystem {
  constructor(matrix, player1X, player1Y, player2X, player2Y) {
    this.matrix = matrix;
    this.uiContext = this.drawArea(1080, 780, '#111');
    this.outlineContext = this.drawArea(0, 0, '#555');
    this.topContext = this.drawArea(0, 0, '#111', true);
    this.cellSize = 30;
    this.padding = 1;
    this.score = {p1Score: 0, p2Score: 0};

    this.player1 = { x: player1X, y: player1Y, colour: "gray"};
    this.player2 = { x: player2X, y: player2Y, colour: "gray"};

    this.panelMatrixChange(2, player1X, player1Y);
    this.panelMatrixChange(3, player2X, player2Y);

    this.ball = { x: 15, y: 10, xAxis: 1, yAxis: 1, colour: "blue"};

    this.ballChange(this.ball.x, this.ball.y);
    
    document.addEventListener('keydown', (e) => this.movePlayer(e));
  }

  panelMatrixChange = (playerCode, x, y) => {
    for (let i=0;i<4;i++) {
      this.matrix[y+i][x] = playerCode;
    }
  }

  ballChange = (x, y) => {
    this.matrix[y][x] = -1;
  }

  checkBallAxis = () => {
    if(this.matrix[this.ball.y+1][this.ball.x] === 1 || this.matrix[this.ball.y-1][this.ball.x] === 1 ) {
      this.ball.yAxis = this.ball.yAxis * -1;
    }
    if(this.matrix[this.ball.y+1][this.ball.x+1] === 2 ||this.matrix[this.ball.y+1][this.ball.x+1] === 3 ||
       this.matrix[this.ball.y+1][this.ball.x-1] === 2 || this.matrix[this.ball.y+1][this.ball.x-1] === 3  ||
       this.matrix[this.ball.y-1][this.ball.x+1] === 2 ||this.matrix[this.ball.y-1][this.ball.x+1] === 3 ||
       this.matrix[this.ball.y-1][this.ball.x-1] === 2 ||this.matrix[this.ball.y-1][this.ball.x-1] === 3) {
      this.ball.xAxis = this.ball.xAxis * -1;
    }
  }

  updateScore = (p1, p2) => {
    this.score.p1Score+= p1;
    this.score.p2Score+= p2;
  }

  resetRound = () => {
    this.matrix[this.ball.y][this.ball.x] = 0;
    this.ball = { x: 15, y: 10, xAxis: 1, yAxis: 1, colour: "blue"};
  }

  checkIfScored = () => {
    if(this.matrix[this.ball.y][this.ball.x+1] === 1) {
      this.updateScore(1, 0);
      this.resetRound();
    } else if(this.matrix[this.ball.y][this.ball.x-1] === 1) {
      this.updateScore(0, 1);
      this.resetRound();
    }
  }

  moveBall = () => {
    this.checkBallAxis();
    this.checkIfScored();
    this.matrix[this.ball.y][this.ball.x] = 0;
    this.ball.x+=this.ball.xAxis;
    this.ball.y+=this.ball.yAxis;
    this.ballChange(this.ball.x, this.ball.y);
  }

  isValidMove = (player, x, y) => {
    if (this.matrix[player.y + y][player.x + x] !== 1 && this.matrix[player.y + 3 + y][player.x] !== 1) {
      return true;
    } 
    return false;
  }

  movePlayer = (e) => {
    let key = e.keyCode;
    switch(key) {
      case(38):
        if(this.isValidMove(this.player2, 0, -1)) {
          this.panelMatrixChange(0, this.player2.x, this.player2.y);
          this.player2.y--;
          this.panelMatrixChange(3, this.player2.x, this.player2.y);
          this.render();
        }
        break;
      case(40):
        if(this.isValidMove(this.player2, 0, 1)) {
          this.panelMatrixChange(0, this.player2.x, this.player2.y);
          this.player2.y++;
          this.panelMatrixChange(3, this.player2.x, this.player2.y);
          this.render();
        }
        break;
      case(87):
        if(this.isValidMove(this.player1, 0, -1)) {
          this.panelMatrixChange(0, this.player1.x, this.player1.y);
          this.player1.y--;
          this.panelMatrixChange(3, this.player1.x, this.player1.y);
          this.render();
        }
        break;
      case(83):
        if(this.isValidMove(this.player1, 0, 1)) {
          this.panelMatrixChange(0, this.player1.x, this.player1.y);
          this.player1.y++;
          this.panelMatrixChange(3, this.player1.x, this.player1.y);
          this.render();
        }
        break;
    }
  }

  getCentre = (w, h) => {
    return {
      x: window.innerWidth / 2 - w / 2 + "px",
      y: window.innerHeight / 2 - h / 2 + "px"
    }
  }

  drawArea = (w, h, colour, transparent) => {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    this.canvas.style.position = 'absolute';
    this.canvas.style.background = colour;
    if(transparent) {
      this.canvas.style.backgroundColor = "transparent";
    }
    let centre = this.getCentre(w, h);
    this.canvas.style.marginLeft = centre.x;
    this.canvas.style.marginTop = centre.y;
    document.body.appendChild(this.canvas);

    return this.context;
  }

  render() {
    const w = (this.cellSize + this.padding) * this.matrix[0].length - (this.padding);
    const h = (this.cellSize + this.padding) * this.matrix.length - (this.padding);
    
    this.outlineContext.canvas.width = w;
    this.outlineContext.canvas.height = h;

    let centre = this.getCentre(w, h);

    this.outlineContext.canvas.style.marginLeft = centre.x;
    this.outlineContext.canvas.style.marginTop = centre.y;
    this.topContext.canvas.style.marginLeft = centre.x;
    this.topContext.canvas.style.marginTop = centre.y;

    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        const cellVal = this.matrix[row][col];
        let colour = '#111';

        if(cellVal === 1) {
          colour = "white";
        } else if(cellVal === 2) {
          colour = this.player1.colour;
        } else if(cellVal === 3) {
          colour = this.player2.colour;
        } else if(cellVal === -1) {
          colour = this.ball.colour;
        }

        this.outlineContext.fillStyle = colour;
        this.outlineContext.fillRect(col * (this.cellSize + this.padding),
        row * (this.cellSize + this.padding),
        this.cellSize, this.cellSize);
      }
    }

    this.uiContext.font = "20px Courier";
    this.uiContext.fillStyle = "grey";
    this.uiContext.fillRect(250, 15, 550, 30);
    this.uiContext.fillStyle = "white";
    this.uiContext.fillText(this.score.p1Score+" - "+this.score.p2Score, 500, 35);
  }
}

myMatrix = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

startGame = () => {
  const gridSystem = new GridSystem(myMatrix, 1, 9, 30, 9);
  gridSystem.render();
  setInterval(function() {gridSystem.moveBall();}, 100);
  setInterval(function() {gridSystem.render();}, 100);
}

startGame();