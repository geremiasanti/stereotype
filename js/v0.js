let cubesAmountX, cubesWidth, cubesDistance, rotateAmountX;
let debug = true;

function setup() {  
    // PARAMETERS
    cubesWidth = 150;
    cubesAmountX = 10;
    rotateAmountX = PI / 180 * 2;
    distance = 20;
    // Distance between the  centers of the cubes
    cubesDistance = cubesWidth * Math.sqrt(2) + distance;

    // SETUP
    createCanvas(windowWidth, windowHeight, WEBGL);
    ortho();

    // DEBUG
    //if(debug) debugMode();
}

function draw() {
    // DEBUG
    if(debug) {
        orbitControl()
        if(!(frameCount % 60)) {
        } 
    };

    // SETUP
    background(0, 0, 0);
    //noFill();

    // DRAWING
    // texture
    normalMaterial();
    // all to the left
    translate(-(cubesDistance * cubesAmountX / 2), -(cubesDistance * cubesAmountX / 2), 0);
    for(let down = 0; down < cubesAmountX;down ++) {
        translate(0, cubesDistance, 0);
        push();
        for(let aside = 0; aside < cubesAmountX; aside++) {
            // go to the side
            translate(cubesDistance, 0, 0);
            cube(cubesWidth, 'white', rotateAmountX);
        }
        pop();
    }
}

function cube(size, color, rotateAmountX) {
    //stroke(color);

    push();
    //rotateX(rotateAmountX * frameCount * .1);
    rotateY(rotateAmountX * frameCount * .5);
    rotateZ(rotateAmountX * frameCount * 5);
    box(size,size,size);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    ortho();
}

