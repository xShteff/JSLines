class Game {
    constructor() {
        this.isSelected = false;
        this.selectedX = -1;
        this.selectedY = -1;
        this.targetX = -1;
        this.targetY = -1;
        this.startBallCount = 5;
        this.selectedBall = null;
    }

    init() {
        this.initGridData();
        this.initSolver();
        this.initClicKEvents();  
        this.initResizeEvent();  
    }

    initGridData() {
        this.grid = new Grid(9);
        this.grid.placeRandomBalls(this.startBallCount);
        this.initEasyStar();
        this.grid.displayGrid();
    }

    initSolver() {
        this.solver = new Solver(this.grid);
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
            'background': `url("files/images/${ball.colour}_ball.png")`,
            'background-size': '100%'
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
                        if(!that.solver.scanLines()) {
                            that.grid.placeRandomBalls(3);
                            setTimeout(() => {
                                that.solver.scanLines();
                            }, 20)
                        }
                        that.grid.displayGrid();
                        that.initClicKEvents();
                    }, 20)
                }
            }, i * 20);
        }
    }

    findPath() {
        var that = this;
        this.easystar.findPath(this.selectedX, this.selectedY, this.targetX, this.targetY, function(path) {
            if (path !== null) {
                that.moveBall(that.selectedBall, path)
            } else {
                console.warn("No path found.")
            }
        });
        this.easystar.calculate();
    }
}