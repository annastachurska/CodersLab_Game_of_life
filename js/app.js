document.addEventListener("DOMContentLoaded", function(){


    var GameOfLife = function(boardWidth, boardHeight) {
        this.width = boardWidth,
        this.height = boardHeight,
        this.board = document.getElementById("board"),
        this.cells = [],

        this.createBoard = function() {
            this.board.style.width = String(this.width * 10) + "px";
            this.board.style.height = String(this.height * 10) + "px";
            var numberOfElements = this.width * this.height;
            for (var i=0; i < numberOfElements; i++) {
                var newDiv = document.createElement("div");
                this.board.appendChild(newDiv);
            }
            this.cells = document.querySelectorAll("#board div");

            for (var j=0; j < this.cells.length; j++) {
                this.cells[j].addEventListener("mouseover", function() {
                    if (this.className.indexOf("live") == -1) {
                        this.classList.toggle("live");
                    }
                });
            }
        },

        this.cellIndex = function(x, y) {
            var indexNumber = x + y*this.width;
            return this.cells[indexNumber];
        },

        this.setCellState = function(x, y, state) {
            if (this.cellIndex(x,y).className.indexOf(state) == -1) {
                this.cellIndex(x,y).classList.toggle(state);
            }
        },

        this.firstGlider = function() {
            this.setCellState(2,2, 'live');
            this.setCellState(5,2, 'live');
            this.setCellState(4,2, 'live');
            this.setCellState(3,2, 'live');
        },


        this.computeCellNextState = function(x,y) {
            var neighbourArray =[];
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

            var counter = 0;

            for (var i=0; i < neighbourArray.length; i++) {
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
        },


        this.computeNextGeneration = function() {
            var futureArray =[];
            for (var i=0; i < this.height; i++) {
                for (var j=0; j < this.width; j++) {
                    futureArray.push(this.computeCellNextState(j, i));
                }
            }
            return futureArray;
        },


        this.printNextGeneration = function() {
            var newList = this.computeNextGeneration();
            for (var i=0; i < this.cells.length; i++) {
                if ((this.cells[i].className.indexOf('live') == -1) && (newList[i] == 1)) {
                    this.cells[i].classList.add('live');
                }
                if ((this.cells[i].className.indexOf('live') != -1) && (newList[i] == 0)) {
                    this.cells[i].classList.remove('live');
                }
            }
        },

        this.start = function() {
            this.createBoard();
            this.pause();
            this.play();
        },

        this.play = function() {
            var play = document.getElementById("play");
            var self = this;
            play.addEventListener("click", function() {
                self.idSetInterval = setInterval(function() {
                    self.printNextGeneration();
                }, 1000);
                return self.idSetInterval;
            });
        },

        this.pause = function() {
            var pauseBtn = document.getElementById("pause");
            var self = this;
            pauseBtn.addEventListener("click", function() {
                clearInterval(self.idSetInterval);
            });
        }

    };

    var maxWidth = Math.floor(window.innerWidth/10) - 20;
    var maxHeight = Math.floor(window.innerHeight/10) - 20;

    document.querySelector('.introduction_button').addEventListener('click', function(){
        document.querySelector('.introduction').style.display = 'none';
        var widthSize = prompt("Set the board width (1 to " + maxWidth + ")");
        while ( !( (Number(widthSize) > 0) && (Number(widthSize) <= maxWidth) ) ){
            var widthSize = prompt("Chosen width must be from 1 to "+ maxWidth + "\n Set the board width");
        }
        var heightSize = prompt("Set the board height (1 to " + maxHeight + ")");
        while ( !( (Number(heightSize) > 0) && (Number(heightSize) <= maxHeight) ) ){
            var heightSize = prompt("Chosen height must be from 1 to "+ maxHeight + "\n Set the board height");
        }

        var game = new GameOfLife(widthSize, heightSize);
        game.start();
    });


});