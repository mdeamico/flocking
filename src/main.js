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

    let v = new Victor(0,0);
    console.log(v);

    let target = new Victor(150,150);
    const DESIRED_SPEED = 6;

    function limitForce(vector) {
        const maxForce = 0.05;
        // Limit the vector to a certain length.
        if (vector.length() > maxForce) {
            vector.normalize().multiplyScalar(maxForce);
        }
        return vector;
    }

    function update() {



        for (let boid of flock) {
            // Make decision
            let desired = target.clone().subtract(boid.pos);

            if (!desired.isZero()) {
                desired.normalize().multiplyScalar(DESIRED_SPEED);
            }

            let steeringForce = desired.subtract(boid.v);
            boid.a = limitForce(steeringForce);

            // Update velocity
            boid.v.add(boid.a);	

            // Apply velocity to position
            boid.pos.add(boid.v);

            // Reset acceleration
            boid.a.zero();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let boid of flock) {
            ctx.beginPath();
            ctx.arc(boid.pos.x, boid.pos.y, 4, 0, Math.PI*2);
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

