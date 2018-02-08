class Grid {
    constructor(size) {
        this.data = Utils.makeGrid(size);
    }
    handleCellValue(val) {
        if(val === 0) {
            return 0
        } else {
            return $("<div>").addClass(`ball`).css({
                'background': val
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
                    }).append(this.handleCellValue(this.data[i][y]));
                if (y == 0) element.addClass("first");
                $("#game").append(element);
                line += this.data[y][i];
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
                line += this.data[y][i];
            }
            console.log(line);
        }
    }
}