class Ball {
    constructor(colour) {
        this.colour = colour;
	}
	toString() {
		return `${this.colour}`
	}
}

class Grid {
    constructor(size) {
        this.data = Utils.makeGrid(size);
    }

    displayGrid() {
		$('.element').remove();
        for (var i = 0; i < this.data.length; i++) {
            var line = `${i}: `;
            for (var y = 0; y < this.data[i].length; y++) {
                var element = $("<div>")
                    .addClass("element")
                    .text(`${this.data[i][y].toString()}`)
                    .attr({
                        "data-x": i,
                        "data-y": y
                    });
                if (y == 0) element.addClass("first");
                $("#game").append(element);
                line += this.data[i][y];
            }
            console.log(line);
        }
	}
	
	isEmpty(x,y) {
		return this.data[x][y] === 0;
	}

    fancyLog() {
        for (var i = 0; i < this.grid.length; i++) {
            var line = `${i}: `;
            for (var y = 0; y < this.data[i].length; y++) {
                line += this.data[i][y];
            }
            console.log(line);
        }
    }
}
var Utils = {
    Random: {
        nextInt(min, max) {
            return Math.floor(Math.random() * max) + min;
        }
    },
    settings: {
        colours: ["red", "blue", "yellow", "green", "purple", "pink", "turquoise"]
    },
    makeGrid: size => {
        var grid = [];
        for (var i = 0; i < size; i++) {
            var row = [];
            for (var y = 0; y < size; y++) {
                row.push(0);
            }
            grid.push(row);
        }
        return grid;
    },
    showPath: path => {
        for (var x = 0; x < path.length; x++) {
            $(`.element[data-x=${path[x].x}][data-y=${path[x].y}]`).addClass("path");
        }
	},
	clearPath: () => {
		$('.element').removeClass('path');
	}
};

class Game {
    constructor() {
        this.isSelected = false;
        this.selectedX = -1;
        this.selectedY = -1;
        this.targetX = -1;
		this.targetY = -1;
		this.startBallCount = 3;
    }

    init() {
        this.initGridData();
		this.initClicKEvents();
		
    }

    initGridData() {
		this.grid = new Grid(9);
		for(var i = 0; i < this.startBallCount; i++) {
			this.placeRandomBall();
		}
		this.initEasyStar();
        this.grid.displayGrid();
    }

    initEasyStar() {
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.grid.data);
        this.easystar.setAcceptableTiles([0]);
    }

    placeRandomBall() {
        var randX = Utils.Random.nextInt(0, 8);
		var randY = Utils.Random.nextInt(0, 8);
		//this.grid.data[randX][randY] = new Ball(Utils.settings.colours[Utils.Random.nextInt(0, Utils.settings.colours.length - 1)]);
		this.grid.data[randX][randY] = 1;
	}
	
	handleClickEvent(selX, selY) {
		if (!this.isSelected) {
			if(!this.grid.isEmpty(selX, selY))
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
    }

    selectTargetPoint(x, y) {
        this.isSelected = false;
        this.targetX = x;
        this.targetY = y;
        this.unhighlightSelectedPoint();
    }

    findPath() {
        console.log(
            `${this.selectedX} ${this.selectedY} ${this.targetX} ${this.targetY}`
        );

        this.easystar.findPath(this.selectedX, this.selectedY, this.targetX, this.targetY, function(path) {
            console.log(path);
            Utils.showPath(path);
        });
        this.easystar.calculate();
    }
}
var game = new Game();
game.init();