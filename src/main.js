import { Boid } from './boid.js'

function main() {
    let flock = [];
    const MAX_BOIDS = 100; 
    for (let i = 0; i < MAX_BOIDS; ++i) {
        flock.push(new Boid());
    }
    console.log(flock);


    let canvas = document.getElementById('simulation-canvas');
    let ctx = canvas.getContext('2d');



    function update() {
        for (let boid of flock) {
            boid.x += boid.vx;
            boid.y += boid.vy;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let boid of flock) {
            ctx.beginPath();
            ctx.arc(boid.x, boid.y, 4, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }

    function gameLoop(ts) {
        update();
        draw();
    
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}


main();

