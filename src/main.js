import { Boid } from './boid.js'
import { Predator} from './predator.js'
import { BoidSystem } from './boid-system.js'
import { PredatorSystem } from './predator-system.js'

import * as constants from './constants.js'

function getRand(min, max) {
    // inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function main() {

    // -------------------------------------------------------------------------
    // --------------------- Initialize variables ------------------------------
    // -------------------------------------------------------------------------

    // Setup Canvas & scale based on device pixel density
    let canvas = document.getElementById('simulation-canvas');
    let canvasBoundingRect = canvas.parentElement.getBoundingClientRect();
    canvas.width = canvasBoundingRect.width;
    canvas.height = canvasBoundingRect.height;

    let ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);

    // phyiscal dimensions of the world, independent of device pixel density
    let world = {
        width: Math.round(canvas.width / dpr),
        height: Math.round(canvas.height / dpr),
        scale: dpr
    }

    // Systems to handle simulation logic
    let boidSystem = new BoidSystem(world);
    let predatorSystem = new PredatorSystem(world);

    // Create boids
    let boids = [];
    let boidRadius = 4; // boids have a constant radius

    // boids should start "close" together so they flock instead of standing still
    for (let i = 0; i < constants.MAX_BOIDS; ++i) {
        let startingRadius = 100;
        let x = Math.max(Math.round(getRand(world.width / 2 - startingRadius, 
                                            world.width / 2 + startingRadius)), 0);
        let y = Math.max(Math.round(getRand(world.height / 2 - startingRadius, 
                                            world.height / 2 + startingRadius)), 0);
        boids.push(new Boid(x, y));
    }
    
    // Create initial predator
    let predators = [];
    predators[0] = new Predator(Math.round(world.width / 2), 
                                Math.round(world.height / 2),
                                boidRadius);
    // -------------------------------------------------------------------------

    function update() {
        boids = boidSystem.update(boids, predators);
        predators = predatorSystem.update(predators, boids);
    }

    function draw() {
        ctx.clearRect(0, 0, world.width, world.height);

        // Background Color
        //ctx.fillStyle = "#f7f7f7";
        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, world.width, world.height);

        // Boids
        ctx.fillStyle = "#000";
        for (let boid of boids) {
            ctx.beginPath();
            ctx.arc(boid.pos.x, boid.pos.y, boidRadius, 0, Math.PI*2);
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

