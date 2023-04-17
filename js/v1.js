let debug = true;

let boxMatrix;

class BoxMatrix2d {
    constructor(rows, boxSize, boxDistance) {
        this.rows = rows;
        this.cols = this.rows;
        this.boxSize = boxSize;
        this.boxDistance = boxSize + boxDistance;
        this.sideLenght = (boxSize + boxDistance) * rows;

        //coordinates of the top left corner 
        this.topLeftX = -(this.sideLenght / 2);
        this.topLeftY = this.topLeftX;
        
        this.matrix = Array(this.rows).fill(null).map((_, iRow) => {
            return Array(this.cols).fill(null).map((_, iCol) => {
                /*
                let color = map(
                    iRow + iCol,
                    0, this.rows + this.cols,
                    0, 255
                );
                */
                return new Box(this.boxSize, 0); 
            });
        });
    }
    
    draw() {
        translate(this.topLeftY, this.topLeftX);
        this.matrix.forEach((row, i) => {
            translate(0, this.boxDistance, 0);
            push();
            row.forEach((box, j) => {
                translate(this.boxDistance, 0, 0);
                box.draw();
            });
            pop();
        });
    }
}

class Box {
    constructor(size, color) {
        this.size = size;
        this.color = color;
    }

    draw() {
        stroke(this.color);
        box(this.size);
    }
}

function setup() {  
    createCanvas(windowWidth, windowHeight, WEBGL);
    ortho();

    let rows = 5;
    let boxSize = 100;
    let boxDistance = 10 

    boxMatrix = new BoxMatrix2d(rows, boxSize, boxDistance);
}


function draw() {
    background(0, 0, 0);
    orbitControl();

    boxMatrix.draw();
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ortho();
}





