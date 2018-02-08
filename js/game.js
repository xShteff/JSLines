class Game {
    constructor() {
        this.isSelected = false;
        this.selectedX = -1;
        this.selectedY = -1;
        this.targetX = -1;
		this.targetY = -1;
        this.startBallCount = 3;
        this.selectedBall = null;
    }

    init() {
        this.initGridData();
		this.initClicKEvents();
		
    }

    initGridData() {
		this.grid = new Grid(9);
		for(var i = 0; i < this.startBallCount; i++) {
			this.grid.placeRandomBall();
        }
		this.initEasyStar();
        this.grid.displayGrid();
    }

    initEasyStar() {
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.grid.data);
        this.easystar.setAcceptableTiles([0]);
        this.easystar.setIterationsPerCalculation(1000);
    }

    placeRandomBall() {
        var randX = Utils.Random.nextInt(0, 8);
		var randY = Utils.Random.nextInt(0, 8);
		this.grid.data[randX][randY] = new Ball(Utils.settings.colours[Utils.Random.nextInt(0, Utils.settings.colours.length - 1)]);
		//this.grid.data[randX][randY] = 1;
	}
	
	handleClickEvent(selX, selY) {
		if (!this.isSelected) {
			if(!this.grid.isEmpty(selX, selY)){}
				this.selectInitialPoint(selX, selY);
		} else {
			if(this.grid.isEmpty(selX, selY)) {
				this.selectTargetPoint(selX, selY);
				this.findPath();
			}
			Utils.clearPath();
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
				Utils.clearPath();
            }
        });
    }

    highlightSelectedPoint() {
        $(`.element[data-x=${this.selectedX}][data-y=${this.selectedY}]`).addClass(
            "selected"
        );
    }

    unhighlightSelectedPoint() {
        $(".element").removeClass("selected");
    }

    selectInitialPoint(x, y) {
        this.isSelected = true;
        this.selectedX = x;
        this.selectedY = y;
        this.highlightSelectedPoint();
        this.selectedBall = this.grid.data[y][x];
        console.log(this.selectedBall);
    }

    selectTargetPoint(x, y) {
        this.isSelected = false;
        this.targetX = x;
        this.targetY = y;
        this.unhighlightSelectedPoint();
    }

    moveBall(ball, path) {
        console.log(ball);
        var that = this;
        var ballClone = $("<div>").attr({
            'class': 'ball',
            'data-ballId' : ball.id
        }).css({
            'background': ball.colour
        })
        var count = 0; //TODO: Find a better way to do this...
        for(var i = 0; i < path.length; i++) {
            setTimeout(function() {
                console.log(i);
                $(`.ball[data-ballId="${ball.id}"]`).remove();
                $(`.element[data-x=${path[count].x}][data-y=${path[count].y}]`).append(ballClone);
                count++; 
                if(count === path.length) {
                    that.grid.data[that.targetY][that.targetX] = that.grid.data[that.selectedY][that.selectedX];
                    that.grid.data[that.selectedY][that.selectedX] = 0;
                    
                    for(var i = 0; i < 3; i++) {
                        that.grid.placeRandomBall();
                    }
                    that.grid.displayGrid();
                    that.initClicKEvents();
                }
            }, i * 100);
        }
    }

    findPath() {
        console.log(
            `${this.selectedX} ${this.selectedY} ${this.targetX} ${this.targetY}`
        );
        var that = this;
        this.easystar.findPath(this.selectedX, this.selectedY, this.targetX, this.targetY, function(path) {
            console.log(path);
            
            if(path !== null) {
                that.moveBall(that.selectedBall, path)
                
            }
        });
        setInterval(() => {
            this.easystar.calculate();
        }, 5);
    }
}