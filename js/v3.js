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
                box = this.wave(i, j, box);
                box.draw();
                pop();
            });
            pop();
        });
    }

    wave(i, j, box) {
        let mid = (this.rows - 1) / 2;
        let distanceFromCenter = Math.max(
            Math.abs(mid - i), 
            Math.abs(mid - j)
        );
            
        translate(0, 0, 
            sin(distanceFromCenter * .1 * frameCount/3) * 20
        );

        box.color = map(distanceFromCenter, 0, mid, 0, 255);

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
        text('ehi');
    }
}

function setup() {  
    createCanvas(windowWidth, windowHeight, WEBGL);
    //ortho();
    /*
    ortho(
        windowWidth/2, 
        windowWidth/2, 
        windowHeight/2,
        windowHeight/2,
        0,
        500
    );
    */

    let rows = 10;
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





