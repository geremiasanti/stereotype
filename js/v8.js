let debug = true;

let boxMatrix;

class BoxMatrix2d {
    constructor(rows, cols, boxSize, boxDistance) {
        this.rows = rows;
        this.cols = cols;
        this.boxSize = boxSize;
        this.boxDistance = boxSize + boxDistance;
        this.totalLenght = (boxSize + boxDistance) * cols;
        this.totalHeight = (boxSize + boxDistance) * rows;
        this.waveHeight = 300;

        //coordinates of the top left corner 
        this.topLeftX = -(this.totalLenght / 2);
        this.topLeftY = -(this.totalHeight / 2);        

        this.matrix = Array(this.rows).fill(null).map((_, iRow) => {
            return Array(this.cols).fill(null).map((_, iCol) => {
                return new Box(this.boxSize, 'white'); 
            });
        });
    }
    
    draw() {
        // wave stuff 
        let slow = 7;
        let wavePosition = (frameCount / slow) % this.cols;

        translate(this.topLeftX, this.topLeftY);
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
        let waveDistance = wavePosition - j;
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
    ortho(
        - windowWidth / 2, windowWidth / 2, 
        - windowHeight / 2, windowHeight / 2, 
        - windowWidth * 3, windowWidth * 3,
    );
    //noLoop();

    let rows = 17;
    let cols = 36;
    let boxSize = 70;
    let boxDistance = 8; 

    boxMatrix = new BoxMatrix2d(rows, cols, boxSize, boxDistance);

}

function draw() {
    background(0, 0, 0);
    orbitControl();
    lights();

    translate(-100, 0, 200)
    rotateX(- PI / 15);
    rotateY(PI / 4);
    boxMatrix.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ortho(
        - windowWidth / 2, windowWidth / 2, 
        - windowHeight / 2, windowHeight / 2, 
        - windowWidth * 3, windowWidth * 3,
    );
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
