// For the continuous same color balls series
class ContinuousColorBalls {
    constructor(x, y, count) {
        this.x = x; // Start position of continuous same color balls
        this.y = y; // Start position of continuous same color balls
        this.count = count; // How many same color balls
    }
    isfive() {
        return (this.count >= 5) ? true : false;
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.count = 0;
    }
    updateIfGreater(theone) {
        if(this.count < theone.count) {
            this.count = theone.count;
            this.x = theone.x;
            this.y = theone.y;
        }
    }
}

class Solver { 
    constructor(grid) {
        this.grid = grid;
        this.score = 0;
    }

    isVerticalLine(x) {
        var curContBalls = new ContinuousColorBalls(x, 0, 0);
        var maxContBalls = new ContinuousColorBalls(x, 0, 0);
        for(var i = 1; i < this.grid.size; i++) {
            if(typeof(this.grid.data[i][x]) !== "number") {
                if(((this.grid.data[i][x]).equalColour(this.grid.data[i-1][x]))) {
                    curContBalls.count += 1;
                } else {
                    maxContBalls.updateIfGreater(curContBalls);
                    curContBalls.reset(x, i);
                }
            } else {
                maxContBalls.updateIfGreater(curContBalls);
                curContBalls.reset(x, i);
            }
        }
        maxContBalls.updateIfGreater(curContBalls);

        // The real count is 1 more
        maxContBalls.count++;
        return maxContBalls;
    }

    clearVertical(listBall) {
        for(var i = 0; i < listBall.count; i++) {
            //console.log("x:", listBall.x, ", y:", listBall.y+i, ", count:", listBall.count);
            this.grid.data[listBall.y + i][listBall.x] = 0;
        }
    }

    checkVerticalLines() {
        var result = false;
        for(var x = 0; x < this.grid.size; x++) {
            var line = this.isVerticalLine(x);

            if(line.isfive()) {
                this.clearVertical(line);
                Utils.increaseScore(this.score);
                result = true;
            }
        }
        return result;
    }

    isHorizontalLine(y) {
        var curContBalls = new ContinuousColorBalls(0, y, 0);
        var maxContBalls = new ContinuousColorBalls(0, y, 0);
        for(var i = 1; i < this.grid.size; i++) {
            if(typeof(this.grid.data[y][i]) !== "number") {
                if(((this.grid.data[y][i]).equalColour(this.grid.data[y][i-1]))) {
                    curContBalls.count += 1;
                } else {
                    maxContBalls.updateIfGreater(curContBalls);
                    curContBalls.reset(i, y);
                }
            } else {
                maxContBalls.updateIfGreater(curContBalls);
                curContBalls.reset(i, y);
            }
        }
        maxContBalls.updateIfGreater(curContBalls);

        // The real count is 1 more
        maxContBalls.count++;

        return maxContBalls;
    }

    clearHorizontal(listBall) {
        console.log(listBall);
        for(var i = 0; i < listBall.count; i++) {
            this.grid.data[listBall.y][listBall.x + i] = 0;
        }
    }

    checkHorizontalLines() {
        var result = false;
        for(var y = 0; y < this.grid.size; y++) {
            var line = this.isHorizontalLine(y);
            if(line.isfive()) {
                console.log(line);
                this.clearHorizontal(line);
                Utils.increaseScore(this.score);
                result = true;
            }
        }
        return result;
    }
    

    isDiagonalLeftLine(x, y) {
        var curContBalls = new ContinuousColorBalls(x, y, 0);
        var maxContBalls = new ContinuousColorBalls(x, y, 0);

        var min_length = Math.min(x+1, this.grid.size - y);
        //console.log("x:", x, ", y:", y, ", len:", min_length);
        for(var i = 0; i < min_length; i++) {
            if(typeof(this.grid.data[y + i][x - i]) !== "number") {
                if(i === 0) {
                    curContBalls.count = 1;
                } else {
                    if((this.grid.data[y + i][x - i].equalColour(this.grid.data[y+i-1][x-i+1]))) {
                        curContBalls.count += 1;
                        //console.log("i=", i);
                    } else {
                        maxContBalls.updateIfGreater(curContBalls);
                        curContBalls.reset(x-i, y+i);
                        curContBalls.count = 1;
                    }
                }
            } else {
                maxContBalls.updateIfGreater(curContBalls);
                curContBalls.reset(x-i, y+i);
            }
        }
        maxContBalls.updateIfGreater(curContBalls);

        return maxContBalls;
    }

    clearDiagonalLeftLine(diagonLine) {
        //console.log("clearDiagonalLeftLine", diagonLine);
        for(var i = 0; i < diagonLine.count; i++) {
            this.grid.data[diagonLine.y + i][diagonLine.x - i] = 0;
        }
    }

    checkDiagonalLeftLines() {
        var result = false;
        // y=0, scan x from 4 to the max of x
        for(var x = 4; x < this.grid.size; x++) {
            var line_y0 = this.isDiagonalLeftLine(x, 0);
            //console.log("line_y0:", line_y0);
            if(line_y0.isfive()) {
                //console.log("line_y0:", line_y0);
                this.clearDiagonalLeftLine(line_y0);
                Utils.increaseScore(this.score); // TODO: check
                result = true;
            }
        }

        // x=grid.size-1, scan y from 0 to grid.size - 4
        for(var y = 0; y < this.grid.size - 4; y++) {
            var line_x = this.isDiagonalLeftLine(this.grid.size-1, y);
            if(line_x.isfive()) {
                //console.log("line_x:",line_x);
                this.clearDiagonalLeftLine(line_x);
                Utils.increaseScore(this.score); // TODO: check
                result = true;
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