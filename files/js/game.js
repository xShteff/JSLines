class Game {
    constructor() {
        this.isSelected = false;
        this.selectedX = -1;
        this.selectedY = -1;
        this.targetX = -1;
        this.targetY = -1;
        this.startBallCount = 5;
        this.selectedBall = null;
        this.score = 0;
    }

    init() {
        this.initGridData();
        this.initClicKEvents();  
        this.initResizeEvent();  
    }

    initGridData() {
        this.grid = new Grid(9);
        this.grid.placeRandomBalls(this.startBallCount);
        this.initEasyStar();
        this.grid.displayGrid();
    }

    initEasyStar() {
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.grid.data);
        this.easystar.setAcceptableTiles([0]);
        this.easystar.setIterationsPerCalculation(1000);
    }

    initResizeEvent() {
        var resizeTimer;
        var that = this;
        $(window).on('resize', function(e) {

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            that.grid.makeResponsive();
            console.log('boop');        
        }, 250);

        });
    }

    handleClickEvent(selX, selY) {
        if (!this.isSelected) {
            if (!this.grid.isEmpty(selX, selY)) {
                this.selectInitialPoint(selX, selY);
            }
            
        } else {
            if (this.grid.isEmpty(selX, selY)) {
                this.selectTargetPoint(selX, selY);
                this.findPath();
            } else {
                this.unselectInitialPoint();
            }
        }
    }

    initClicKEvents() {
        var that = this;
        $(".element").click(function() {
            var selX = parseInt($(this).attr("data-x"));
            var selY = parseInt($(this).attr("data-y"));
            that.handleClickEvent(selX, selY);
        });

        $(document).click(function(e) {
            var game = $(".element");
            if (!game.is(e.target)) {
                that.isSelected = false;
                that.unhighlightSelectedPoint();
            }
        });
    }

    highlightSelectedPoint() {
        $(`.element[data-x=${this.selectedX}][data-y=${this.selectedY}]`).addClass("selected");
    }

    unhighlightSelectedPoint() {
        $(".element").removeClass("selected");
    }

    selectInitialPoint(x, y) {
        this.isSelected = true;
        this.selectedX = x;
        this.selectedY = y;
        this.selectedBall = this.grid.data[y][x];
        this.highlightSelectedPoint();
    }

    unselectInitialPoint() {
        this.isSelected = false;
        this.selectedX = -1;
        this.selectedY = -1;
        this.selectedBall = null;
        this.unhighlightSelectedPoint();
    }

    selectTargetPoint(x, y) {
        this.isSelected = false;
        this.targetX = x;
        this.targetY = y;
        this.unhighlightSelectedPoint();
    }

    moveBall(ball, path) {
        var that = this;
        var ballClone = $("<div>").attr({
            'class': 'ball',
            'data-ballId': ball.id
        }).css({
            'background': ball.colour
        });
        var count = 0; //TODO: Find a better way to do this... 
        for (var i = 0; i < path.length; i++) {
            setTimeout(function() {
                $(`.ball[data-ballId="${ball.id}"]`).remove();
                $(`.element[data-x=${path[count].x}][data-y=${path[count].y}]`).append(ballClone);
                count++;
                if (count === path.length) {
                    that.grid.data[that.targetY][that.targetX] = that.grid.data[that.selectedY][that.selectedX];
                    that.grid.data[that.selectedY][that.selectedX] = 0;
                    setTimeout(() => {
                        that.grid.placeRandomBalls(3);
                        setTimeout(() => {
                            that.scanLines();                  
                            that.grid.displayGrid();
                            that.initClicKEvents();
                        }, 100)
                    }, 100)               
                }
            }, i * 100);
        }
    }

    findPath() {
        var that = this;
        this.easystar.findPath(this.selectedX, this.selectedY, this.targetX, this.targetY, function(path) {
            if (path !== null) {
                that.moveBall(that.selectedBall, path)
            } else {
                console.log("No path found.")
            }
        });
        this.easystar.calculate();
    }

    increaseScore() {
        this.score += 100;
        var that = this;
        $('#score').text(that.score);
    }

    scanLines() {
        //vertical
        for(var x = 0; x < 9; x++) {
            for(var y = 0; y < 5; y++) {
                if(this.isVerticalLine(x, y)) {
                    console.warn(`LINE FOUND AT: ${x} ${y}`)
                    this.clearVertical(x, y);
                    this.increaseScore();
                }
            }
        }
        /*for(var y = 0; y < 4; y++) {
            for(var x = 0; x < 9; x++) {
                console.log(`SCANNING: ${x},${y}`)
                if(this.isVerticalLine(x, y)) {
                    console.log(`LINE: ${x} ${y}`)
                }
            }
        }*/
    }
    clearVertical(x, y) {
        for(var i = 0; i < 5; i++) {
            console.log(this.grid.data[y+i][x]);
            this.grid.data[y + i][x] = 0;
            console.log(this.grid.data[y+i][x]);
        }
    }

    isVerticalLine(x, y) {
        //console.log(`X: ${x}; Y: ${y}`);
        var result = true;
        for(var i = 0; i < 5; i++) {
            $(`.element[data-x="${x}"][data-y="${y}"]`).addClass('scanned');
            if(typeof(this.grid.data[y + i][x]) !== "number") {
                //console.log(`INSIDE LOOP X: ${x}; Y: ${y}`);
                if(!(this.grid.data[y + i][x].equalColour(this.grid.data[y][x]))) {
                    result = false;
                }
            } else {
                result = false;
            }
            
        }
        return result;
    }

    isHorizontalLine(x, y) {

    }

    isDiagonalLeftLine(x, y) {

    }

    isDiagonalRightLine(x, y) {
        
    }
}