class Solver { 
    constructor(grid) {
        this.grid = grid;
        this.score = 0;
    }

    isVerticalLine(x, y) {
        var result = true;
        for(var i = 0; i < 5; i++) {
            if(typeof(this.grid.data[y + i][x]) !== "number") {
                if(!(this.grid.data[y + i][x].equalColour(this.grid.data[y][x]))) {
                    result = false;
                }
            } else {
                result = false;
            }
            
        }
        return result;
    }

    clearVertical(x, y) {
        for(var i = 0; i < 5; i++) {
            this.grid.data[y + i][x] = 0;
        }
    }

    checkVerticalLines() {
        var result = false;
        for(var x = 0; x < 9; x++) {
            for(var y = 0; y < 5; y++) {
                if(this.isVerticalLine(x, y)) {
                    this.clearVertical(x, y);
                    Utils.increaseScore(this.score);
                    result = true;
                }
            }
        }
        return result;
    }

    isHorizontalLine(x, y) {
        var result = true;
        for(var i = 0; i < 5; i++) {
            if(typeof(this.grid.data[y][x + i]) !== "number"){ 
                if(!(this.grid.data[y][x + i].equalColour(this.grid.data[y][x]))) {
                    result = false;
                }
            } else {
                result = false;
            }
        }
        return result;
    }

    clearHorizontal(x, y) {
        for(var i = 0; i < 5; i++) {
            this.grid.data[y][x + i] = 0;
        }
    }

    checkHorizontalLines() {
        var result = false;
        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 5; x++) {
                if(this.isHorizontalLine(x, y)) {
                    this.clearHorizontal(x, y);
                    Utils.increaseScore(this.score);
                    result = true;
                }
            }
        }
        return result;
    }
    

    isDiagonalLeftLine(x, y) {
        var result = true;
        for(var i = 0; i < 5; i++) {
            if(typeof(this.grid.data[y + i][x - i]) !== "number") {
                if(!(this.grid.data[y + i][x - i].equalColour(this.grid.data[y][x]))) {
                    result = false;
                }
            } else {
                result = false;
            }
        }
        return result;
    }

    clearDiagonalLeftLine(x, y) {
        for(var i = 0; i < 5; i++) {
            this.grid.data[y + i][x - i] = 0;
        }
    }

    checkDiagonalLeftLines() {
        var result = false;
        for(var x = 8; x > 4; x--) {
            for(var y = 0; y < 5; y++) {
                if(this.isDiagonalLeftLine(x, y)) {
                    this.clearDiagonalLeftLine(x, y);
                    Utils.increaseScore(this.score);
                    result = true;
                }
            }
        }
        return result;
    }

    isDiagonalRightLine(x, y) {
        var result = true;
        for(var i = 0; i < 5; i++) {
            if(typeof(this.grid.data[y + i][x + i]) !== "number") {
                if(!(this.grid.data[y + i][x + i].equalColour(this.grid.data[y][x]))) {
                    result = false;
                }
            } else {
                result = false;
            }
        }
        return result;
    }

    clearDiagonalRightLine(x, y) {
        for(var i = 0; i < 5; i++) {
            this.grid.data[y + i][x + i] = 0;
        }
    }

    checkDiagonalRightLines() {
        var result = false;
        for(var x = 0; x < 5; x++) {
            for(var y = 0; y < 5; y++) {
                if(this.isDiagonalRightLine(x, y)) {
                    this.clearDiagonalRightLine(x, y);
                    Utils.increaseScore(this.score);
                    result = true;
                }
            }
        }
        return result;
    }

    scanLines() {
        return this.checkHorizontalLines() || this.checkVerticalLines() || this.checkDiagonalRightLines() || this.checkDiagonalLeftLines();
    }
}