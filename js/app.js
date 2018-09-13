document.addEventListener("DOMContentLoaded", function(){


    class GameOfLife {
        constructor(boardWidth, boardHeight) {
            this.width = boardWidth;
            this.height = boardHeight;
            this.board = document.getElementById("board");
            this.cells = [];
        }

        createBoard() {
            this.board.style.width = String(this.width * 10) + "px";
            this.board.style.height = String(this.height * 10) + "px";
            const numberOfElements = this.width * this.height;
            for (let i=0; i < numberOfElements; i++) {
                let newDiv = document.createElement("div");
                this.board.appendChild(newDiv);
            }
            this.cells = document.querySelectorAll("#board div");

            for (let j=0; j < this.cells.length; j++) {
                this.cells[j].addEventListener("mouseover", function() {
                    if (this.className.indexOf("live") == -1) {
                        this.classList.toggle("live");
                    }
                });
            }
        }

        cellIndex(x, y) {
            let indexNumber = x + y*this.width;
            return this.cells[indexNumber];
        }

        setCellState(x, y, state) {
            if (this.cellIndex(x,y).className.indexOf(state) == -1) {
                this.cellIndex(x,y).classList.toggle(state);
            }
        }

        firstGlider() {
            this.setCellState(2,2, 'live');
            this.setCellState(5,2, 'live');
            this.setCellState(4,2, 'live');
            this.setCellState(3,2, 'live');
        }

        computeCellNextState(x,y) {
            const neighbourArray =[];
            if ( (x != 0) && (y != 0) ) {
                neighbourArray.push(this.cellIndex(x-1, y-1));
            }
            if (y != 0) {
                neighbourArray.push(this.cellIndex(x, y-1));
            }
            if ((x != this.width-1) && (y != 0)) {
                neighbourArray.push(this.cellIndex(x+1, y-1));
            }
            if (x != 0) {
                neighbourArray.push(this.cellIndex(x-1, y));
            }
            if (x != this.width-1) {
                neighbourArray.push(this.cellIndex(x+1, y));
            }
            if ((x != 0) && (y != this.height-1)) {
                neighbourArray.push(this.cellIndex(x-1, y+1));
            }
            if (y != this.height-1) {
                neighbourArray.push(this.cellIndex(x, y+1));
            }
            if ((x != this.width-1) && (y != this.height-1)) {
                neighbourArray.push(this.cellIndex(x+1, y+1));
            }

            let counter = 0;

            for (let i=0; i < neighbourArray.length; i++) {
                if (neighbourArray[i].className.indexOf("live") != -1) {
                    counter++;
                }
            }

            if (this.cellIndex(x,y).className.indexOf("live") == -1) {
                if (counter == 3)  {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if ((counter <2) || (counter > 3) ) {
                    return 0;
                } else {
                    return 1;
                }
            }
        }

        computeNextGeneration() {
            const futureArray =[];
            for (let i=0; i < this.height; i++) {
                for (let j=0; j < this.width; j++) {
                    futureArray.push(this.computeCellNextState(j, i));
                }
            }
            return futureArray;
        }

        printNextGeneration() {
            const newList = this.computeNextGeneration();
            for (let i=0; i < this.cells.length; i++) {
                if ((this.cells[i].className.indexOf('live') == -1) && (newList[i] == 1)) {
                    this.cells[i].classList.add('live');
                }
                if ((this.cells[i].className.indexOf('live') != -1) && (newList[i] == 0)) {
                    this.cells[i].classList.remove('live');
                }
            }
        }

        start() {
            this.createBoard();
            this.pause();
            this.play();
            this.reset();
        }

        play() {
            let play = document.getElementById("play");
            let self = this;
            play.addEventListener("click", function() {
                self.idSetInterval = setInterval(function() {
                    self.printNextGeneration();
                }, 1000);
                return self.idSetInterval;
            });
        }

        pause() {
            let pauseBtn = document.getElementById("pause");
            let self = this;
            pauseBtn.addEventListener("click", function() {
                clearInterval(self.idSetInterval);
            });
        }

        reset() {
            let resetBtn = document.getElementById("reset");
            let self = this;
            resetBtn.addEventListener("click", function() {
                clearInterval(self.idSetInterval);
                for (let j=0; j < self.cells.length; j++) {
                        if (self.cells[j].className.indexOf("live") !== -1) {
                            self.cells[j].classList.toggle("live");
                        }
                }
            });
        }

    };

    let maxWidth = Math.floor(window.innerWidth/10) - 20;
    let maxHeight = Math.floor(window.innerHeight/10) - 20;

    document.querySelector('.introduction_button').addEventListener('click', function(){
        document.querySelector('.introduction').style.display = 'none';
        let widthSize = prompt("Set the board width (1 to " + maxWidth + ")");
        while ( !( (Number(widthSize) > 0) && (Number(widthSize) <= maxWidth) ) ){
            let widthSize = prompt("Chosen width must be from 1 to "+ maxWidth + "\n Set the board width");
        }
        let heightSize = prompt("Set the board height (1 to " + maxHeight + ")");
        while ( !( (Number(heightSize) > 0) && (Number(heightSize) <= maxHeight) ) ){
            let heightSize = prompt("Chosen height must be from 1 to "+ maxHeight + "\n Set the board height");
        }

        let game = new GameOfLife(widthSize, heightSize);
        game.start();
    });


});