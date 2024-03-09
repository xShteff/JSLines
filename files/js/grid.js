class Grid {
    constructor(size) {
        this.size = size;
        this.data = Utils.makeGrid(size);
        this.ballCount = 0;
        this.emptyCells = [];
    }

    buildCell(x, y) {
        if (this.data[x][y] === 0) {
            return null;
        } else {
            return $("<div>").addClass(`ball`).css({
				'background': `url("files/images/${this.data[x][y].colour}_ball.png")`,
				'background-size': '100%'
            }).attr({
				'data-ballId': `${this.data[x][y].id}`,
				'title': this.data[x][y].colour
            });
        }
    }

    displayGrid() {
        $('.element').remove();
        for (var i = 0; i < this.data.length; i++) {
            //var line = `${i}: `;
            for (var y = 0; y < this.data[i].length; y++) {
                var element = $("<div>")
                    .addClass("element")
                    .attr({
                        "data-x": y,
                        "data-y": i
                    }).append(this.buildCell(i, y));
                if (y == 0) element.addClass("first");
                $("#game").append(element);
                //line += `${this.data[y][i]}\t`;
            }
            //console.log(line);
        }
        this.makeResponsive();
    }

    
    makeResponsive() {
        var bodyWidth = $('body').width();
        if(bodyWidth < $(window).height()) {
            var padding = 3 * 2;
            var borderSize = 1 * 2;
            var cellSize = (bodyWidth - (this.size * padding) - (this.size * borderSize)) / this.size;
            console.log(`bw: ${bodyWidth}, padding: ${padding}, borderSize: ${borderSize}, cellSize: ${cellSize}`);

            $('#responsive').text(`.element { width: ${cellSize}px; height:${cellSize}px}`); //Need to do it like this otherwise I get a weird visual glitch when I move a ball
            /*$('.element').css({
                width: `${cellSize}px`,
                height: `${cellSize}px`
            });*/
        }     
    }

    isEmpty(x, y) {
        return this.data[y][x] === 0;
    }

    fancyLog() {
        for (var i = 0; i < this.grid.length; i++) {
            var line = `${i}: `;
            for (var y = 0; y < this.data[i].length; y++) {
                line += `| ${this.data[y][i]}`;
            }
            console.log(line);
        }
    }

    placeRandomBalls(count) {
        for(var i = 0; i < count; i++) {
            this.placeRandomBall();
        }
    }

    placeRandomBall() {
        var randX = Utils.Random.nextInt(0, this.size-1);
        var randY = Utils.Random.nextInt(0, this.size-1);
        if (this.data[randX][randY] === 0) {
            this.ballCount++;
            this.data[randX][randY] = new Ball(Utils.settings.colours[Utils.Random.nextInt(0, Utils.settings.colours.length)], this.ballCount);
        } else {
            this.placeRandomBall();
        }

    }
}