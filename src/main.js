import { Boid } from './boid.js'
import { Predator} from './predator.js'
import { BoidSystem } from './boid-system.js'
import { PredatorSystem } from './predator-system.js'

import * as constants from './constants.js'

function main() {

    // -------------------------------------------------------------------------
    // --------------------- Initialize variables ------------------------------
    // -------------------------------------------------------------------------
    // Store reference to drawing canvas
    let canvas = document.getElementById('simulation-canvas');
    let ctx = canvas.getContext('2d');

    // Systems to handle simulation logic
    let boidSystem = new BoidSystem(canvas);
    let predatorSystem = new PredatorSystem(canvas);

    // Create boids
    let boids = [];
    for (let i = 0; i < constants.MAX_BOIDS; ++i) {
        boids.push(new Boid());
    }
    
    // Create initial predator
    let predators = [];
    predators[0] = new Predator(100, 100, 4);
    // -------------------------------------------------------------------------

    function update() {
        boids = boidSystem.update(boids, predators);
        predators = predatorSystem.update(predators, boids);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background Color
        ctx.fillStyle = "#f7f7f7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Boids
        ctx.fillStyle = "#000";
        for (let boid of boids) {
            ctx.beginPath();
            ctx.arc(boid.pos.x, boid.pos.y, 4, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }

        // Draw Predators
        ctx.fillStyle = "#FF0000";
        for (let predator of predators) {
            ctx.beginPath();
            ctx.arc(predator.pos.x, predator.pos.y, predator.radius, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }

    }

    function mainLoop(ts) {
        update();
        draw();
    
        requestAnimationFrame(mainLoop);
    }

    // start the simulation
    requestAnimationFrame(mainLoop);
}


main();

