let debug = true;

let boxMatrix;

class BoxMatrix2d {
    constructor(rows, boxSize, boxDistance) {
        this.rows = rows;
        this.cols = this.rows;
        this.boxSize = boxSize;
        this.boxDistance = boxSize + boxDistance;
        this.sideLenght = (boxSize + boxDistance) * rows;
        this.waveHeight = 300;

        //coordinates of the top left corner 
        this.topLeftX = -(this.sideLenght / 2);
        this.topLeftY = this.topLeftX;
        
        this.matrix = Array(this.rows).fill(null).map((_, iRow) => {
            return Array(this.cols).fill(null).map((_, iCol) => {
                return new Box(this.boxSize, 'white'); 
            });
        });
    }
    
    draw() {
        // wave stuff 
        let slow = 10;
        let wavePosition = (frameCount / slow) % this.rows;

        translate(this.topLeftY, this.topLeftX);
        // row
        this.matrix.forEach((row, i) => {
            translate(0, this.boxDistance, 0);
            push();
            // col
            row.forEach((box, j) => {
                translate(this.boxDistance, 0, 0);

                // single box
                push();
                box = this.wave(wavePosition, i, j, box, slow, 10);
                box.draw();
                pop();
            });
            pop();
        });
    }

    // moves the single box based on the distance 
    wave(wavePosition, i, j, box, slow, deep) {
        let waveDistance = wavePosition - i;
        let waveProximity = Math.abs(1 / waveDistance) / 4;
        let normalizedWaveProximity = -getBaseLog(waveProximity, 1000);
        
        let maxHeight = 80;
        translate(0, 0,  
            (normalizedWaveProximity > 0) 
            ? limitTo(normalizedWaveProximity * deep, maxHeight)
            : maxHeight
        );

        return box;
    }
}

class Box {
    constructor(size, color) {
        this.size = size;
        this.color = color;
    }

    draw() {
        ambientMaterial(this.color);
        box(this.size);
    }
}


/*
 * Utilities
 */
function setup() {  
    createCanvas(windowWidth, windowHeight, WEBGL);
    //frameRate(10);
    //ortho();
    //noLoop();

    let rows = 15;
    let boxSize = 40;
    let boxDistance = 4; 

    boxMatrix = new BoxMatrix2d(rows, boxSize, boxDistance);

}

function draw() {
    background(0, 0, 0);
    orbitControl();
    lights();

    boxMatrix.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    //ortho();
}


/*
 * Utilities
 */
function getBaseLog(base, argument) {
    return Math.log(argument) / Math.log(base);
}

/*
 * Returns max if number >= max, else number
 */
function limitTo(number, max) {
    return (number < max) ? number : max; 
}
