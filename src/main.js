import { Boid } from './boid.js'

function main() {
    let population = [];
    const MAX_BOIDS = 100; 
    const VIEW_DIST = 25; // range of sight for boids
    const DESIRED_SPEED = 3;

    for (let i = 0; i < MAX_BOIDS; ++i) {
        population.push(new Boid());
    }
    


    let canvas = document.getElementById('simulation-canvas');
    let ctx = canvas.getContext('2d');

    let v = new Victor(0,0);
    

    //let target = new Victor(50,150);
    

    function limitForce(vector) {
        const maxForce = 0.05;
        // Limit the vector to a certain length.
        if (vector.length() > maxForce) {
            vector.normalize().multiplyScalar(maxForce);
        }
        return vector;
    }

    function wrapPosition(pos) {
        if (pos.x < 0) {
            pos.x = canvas.width;
        } else if (pos.x > canvas.width) {
            pos.x = 0;
        }

        if (pos.y < 0) {
            pos.y = canvas.height;
        } else if (pos.y > canvas.height) {
            pos.y = 0;
        }
    }

    function calcSeparation(boid, flockmates) {
        // Choose a distance at which boids start avoiding each other
        var desiredSeparation = VIEW_DIST / 2;
    
        var desired = new Victor(0, 0);
    
        // For every flockmate, check if it's too close
        for (var i = 0, l = flockmates.length; i < l; ++i) {
            var other = flockmates[i];
            var dist = boid.pos.distance(other.pos);
            if (dist < desiredSeparation && dist > 0) {
                // Calculate vector pointing away from the flockmate, weighted by distance
                var diff = boid.pos.clone().subtract(other.pos).normalize().divideScalar(dist);
                desired.add(diff);
            }
        }
        
        if (desired.length() <= 0) {
            return desired;
        }
        // If the boid had flockmates to separate from
        // We set the average vector to the length of our desired speed
        desired.normalize().multiplyScalar(DESIRED_SPEED);

        // We then calculate the steering force needed to get to that desired velocity
        return steer(boid, desired);

    };

    function calcAlignment(boid, flockmates) { 
        var sum = new Victor(0, 0);
    
        // For every nearby boid, sum their velocity	
        for (var i = 0, l = flockmates.length; i < l; ++i) {
            var other = flockmates[i];
            sum.add(other.v);
        }
        
        if (sum.isZero()) {
            return sum;
        }
        // If the sum of all flockmate's velocities isn't nul
        // We want our desired velocity to be of the length of our desired speed
        var desired = sum.normalize().multiplyScalar(DESIRED_SPEED);
        
        // We then calculate the steering force needed to get to that desired velocity
        return steer(boid, desired);
        
    
        
    };

    function calcCohesion(boid, flockmates) {
        var average = new Victor(0, 0);
        
        if (flockmates.length <= 0) {
            return average;
        }
        
        // Get the average position of all nearby boids.
        for (var i = 0, l = flockmates.length; i < l; ++i) {
            var other = flockmates[i];
            average.add(other.pos);
        }
    
        // The average is the the sum of vectors divided by the number of flockmates
        var destination = average.divideScalar(flockmates.length);
        
        // We calculate the vector from this boid to the destination point
        var desired = destination.subtract(boid.pos);
        
        // We want our desired velocity to be of the length of our desired speed, or zero.
        if (desired.length() > 0) {
            const SPEED_WEIGHT = 0.5;
            desired.normalize().multiplyScalar(SPEED_WEIGHT);
        }
        
        // We then calculate the steering force needed to get to that desired velocity
        return steer(boid, desired);
        
    }

    function steer(boid, desired) {
        return desired.subtract(boid.v);
    }

    function update() {

        // update target
        //target.add(new Victor(0.1,0));


        for (let boid of population) {
            // find nearby boids (flockmates)
            let flockmates = 
                population.filter(
                    (other) => {return(boid.pos.distance(other.pos) <= VIEW_DIST)});

            // Make decision

            // //Steering Force based on target
            // let desired = target.clone().subtract(boid.pos);

            // if (!desired.isZero()) {
            //     desired.normalize().multiplyScalar(DESIRED_SPEED);
            // }

            // let steeringForce = steer(boid, desired);

            // calc other forces
            let sepForce = calcSeparation(boid, flockmates);
            let aliForce = calcAlignment(boid, flockmates);
            let cohForce = calcCohesion(boid, flockmates);

            // add forces
            boid.a.add(sepForce).add(aliForce).add(cohForce);
            boid.a = limitForce(boid.a);

            // Update velocity
            boid.v.add(boid.a);	

            // Apply velocity to position
            boid.pos.add(boid.v);

            wrapPosition(boid.pos);

            // Reset acceleration
            //boid.a.zero();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let boid of population) {
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

