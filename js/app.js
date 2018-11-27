document.addEventListener("DOMContentLoaded", function(){

    // class containing GameOfLife
    class GameOfLife {
        constructor(boardWidth, boardHeight) {
            this.width = boardWidth; // setting the board width based on information from user
            this.height = boardHeight; // setting the board height based on intormation from user
            this.board = document.getElementById("board"); // selecting the board-containing element
            this.cells = []; // elements of the board
            this.playBtn = document.getElementById("play"); //play button
            this.pauseBtn = document.getElementById("pause"); //pause button
            this.resetBtn = document.getElementById("reset"); //reset button
        }

        //creating board based of this.width and this.height
        createBoard() {
            this.board.style.width = String(this.width * 10) + "px";
            this.board.style.height = String(this.height * 10) + "px";
            var numberOfElements = this.width * this.height;
            for (var i=0; i < numberOfElements; i++) {
                var newDiv = document.createElement("div");
                this.board.appendChild(newDiv);
            }
            this.cells = document.querySelectorAll("#board div");
        //adding eventlistener to the board elements for mouseover change the class thus the color of the element
            for (var j=0; j < this.cells.length; j++) {
                this.cells[j].addEventListener("mouseover", function() {
                    if (this.className.indexOf("live") == -1) {
                        this.classList.toggle("live");
                    }
                });
            }
        }

        //function enabling location element on the board based on x-axis and y-axis
        cellIndex(x, y) {
            var indexNumber = x + y*this.width;
            return this.cells[indexNumber];
        }

        // unnecessary functions (setCellState() and firstGlider()) - to set the state of cells beforehand - used for selection of cells before playing
        // function to change the state of living of selected cell (element of board) based on its position (x,y)
        // setCellState(x, y, state) {
        //     if (this.cellIndex(x,y).className.indexOf(state) == -1) {
        //         this.cellIndex(x,y).classList.toggle(state);
        //     }
        // }

        // unnecessary functions (setCellState() and firstGlider()) - to set the state of cells beforehand - used for selection of cells before playing
        // function to change the state of selected cells - used for selection of cells before playing
        // firstGlider() {
        //     this.setCellState(2,2, 'live');
        //     this.setCellState(5,2, 'live');
        //     this.setCellState(4,2, 'live');
        //     this.setCellState(3,2, 'live');
        // }


        //function to determine the cell next state
        // returns 0 if cell will die or 1 if it will live
        computeCellNextState(x,y) {
            // selecting neighbouring cells
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

            var counter = 0; //counter of living neighbour cells

            // counting living neighbour cells with class live - living cells
            for (var i=0; i < neighbourArray.length; i++) {
                if (neighbourArray[i].className.indexOf("live") != -1) {
                    counter++;
                }
            }

            // verifying the cell next state based on counter - number of neighbour living cells
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

        // creating new array with updated state of cells based on function computeCellNextState(function work for 1 cell)
        // it returns array filled with 0(dead) and 1(alive) corresponding to the board
        computeNextGeneration() {
            var futureArray =[];
            for (var i=0; i < this.height; i++) {
                for (var j=0; j < this.width; j++) {
                    futureArray.push(this.computeCellNextState(j, i));
                }
            }
            return futureArray;
        }

        // function changing classes of board elements (live) based on computeNextGeneration()
        // based on information 0 or 1 from computeNextGeneration() it adds classess -> colors for elements/cells
        printNextGeneration() {
            var newList = this.computeNextGeneration();
            for (var i=0; i < this.cells.length; i++) {
                if ((this.cells[i].className.indexOf('live') == -1) && (newList[i] == 1)) {
                    this.cells[i].classList.add('live');
                }
                if ((this.cells[i].className.indexOf('live') != -1) && (newList[i] == 0)) {
                    this.cells[i].classList.remove('live');
                }
            }
        }

        //function starting the game
        // consists of creating the board and functions handling buttons
        start() {
            this.createBoard();
            this.pause();
            this.play();
            this.reset();
        }

        // function handling response to click on button play
        // it starts the game with computing new cell state every 1s
        // it sets id of interval as this.idSetInterval
        // it disables plays button after clicking
        play() {
            var self = this;
            this.playBtn.addEventListener("click", function() {
                // console.log(this);
                self.pauseBtn.disabled = false;
                this.disabled = true;
                // this.setAttribute('disabled',true);
                self.idSetInterval = setInterval(function() {
                    self.printNextGeneration();
                }, 1000);
            });
        }

        // function handling response to click on button pause
        // stops the game by clearing the interval
        // enables clicking on play button after clicking on pause button
        pause() {
            var self = this;
            this.pauseBtn.addEventListener("click", function() {
                self.playBtn.disabled = false;
                this.disabled = true;
                clearInterval(self.idSetInterval);
            });
        }

        // function handling response to click on button reset
        // stops the game by clearing the interval
        // enables clicking on play button after clicking on pause button
        // removes all classes live from cells
        reset() {
            var self = this;
            this.resetBtn.addEventListener("click", function() {
                self.playBtn.disabled = false;
                self.pauseBtn.disabled = true;
                //play.removeAttribute("disabled");
                clearInterval(self.idSetInterval);
                for (var j=0; j < self.cells.length; j++) {
                        if (self.cells[j].className.indexOf("live") !== -1) {
                            self.cells[j].classList.toggle("live");
                        }
                }
            });
        }

    };

    // setting the maxWidth and maxHeight of the board based on window inner sizes
    var maxWidth = Math.floor(window.innerWidth/10) - 20;
    var maxHeight = Math.floor(window.innerHeight/10) - 20;

    function handleGameStart(){
        document.querySelector('.introduction').style.display = 'none';
        var widthSize = prompt("Set the board width (1 to " + maxWidth + ")");
        while ( !( (Number(widthSize) > 0) && (Number(widthSize) <= maxWidth) ) ){
            widthSize = prompt("Chosen width must be from 1 to "+ maxWidth + "\n Set the board width");
        }
        var heightSize = prompt("Set the board height (1 to " + maxHeight + ")");
        while ( !( (Number(heightSize) > 0) && (Number(heightSize) <= maxHeight) ) ){
            heightSize = prompt("Chosen height must be from 1 to "+ maxHeight + "\n Set the board height");
        }

        document.querySelector('.board_container').style.display = 'block';

        // creating and starting the game
        var game = new GameOfLife(widthSize, heightSize);
        game.start();
    }

    // handling the introductory section
    // asking the user for size of board with respent to window inner sizes, checking if chosen values fill the conditions
    document.querySelector('.introduction_button').addEventListener('click', function(){
        handleGameStart();
    });


});