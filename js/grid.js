class Grid {
    constructor(size) {
        this.data = Utils.makeGrid(size);
        this.ballCount = 0;
    }

    handleCell(x, y) {
        if(this.data[x][y] === 0) {
            return null;
        } else {
            return $("<div>").addClass(`ball`).css({
                'background': this.data[x][y].colour
            }).attr({
                'data-ballId': `${this.data[x][y].id}`
            });
        }
    }

    displayGrid() {
		$('.element').remove();
        for (var i = 0; i < this.data.length; i++) {
            var line = `${i}: `;
            for (var y = 0; y < this.data[i].length; y++) {
                var element = $("<div>")
                    .addClass("element")
                    .attr({
                        "data-x": y,
                        "data-y": i
                    }).append(this.handleCell(i, y));
                if (y == 0) element.addClass("first");
                $("#game").append(element);
                line += this.data[y][i];
            }
            console.log(line);
        }
	}
	
	isEmpty(x,y) {
		return this.data[y][x] === 0;
	}

    fancyLog() {
        for (var i = 0; i < this.grid.length; i++) {
            var line = `${i}: `;
            for (var y = 0; y < this.data[i].length; y++) {
                line += this.data[y][i];
            }
            console.log(line);
        }
    }

    placeRandomBall() {
        var randX = Utils.Random.nextInt(0, 8);
        var randY = Utils.Random.nextInt(0, 8);
        this.ballCount++;
		this.data[randX][randY] = new Ball(Utils.settings.colours[Utils.Random.nextInt(0, Utils.settings.colours.length - 1)], this.ballCount);
	}
}