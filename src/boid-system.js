import { limitForce, wrapPosition, steer } from './steering-functions.js'
import * as constants from './constants.js'

export class BoidSystem {
    constructor(canvas) {
        // store canvas width & height for wrapping boid positions
        this.worldWidth = canvas.width;
        this.worldHeight = canvas.height;
    }

    calcSeparation(boid, flockmates) {

        let desiredSeparation = constants.VIEW_DIST / 2;
    
        let desired = new Victor(0, 0);
    
        for (let other of flockmates) {
            let dist = boid.pos.distance(other.pos);
            if (dist < desiredSeparation && dist > 0) {
                let diff = boid.pos.clone().subtract(other.pos).normalize().divideScalar(dist);
                desired.add(diff);
            }
        }
        
        if (desired.length() <= 0) {
            return desired;
        }

        desired.normalize().multiplyScalar(constants.DESIRED_SPEED);
        return steer(boid, desired);

    };

    calcAlignment(boid, flockmates) { 
        let sum = new Victor(0, 0);
    	
        for (let other of flockmates) {
            sum.add(other.v);
        }
        
        if (sum.isZero()) {
            return sum;
        }
        
        let desired = sum.normalize().multiplyScalar(constants.DESIRED_SPEED);
        return steer(boid, desired);
    };

    calcCohesion(boid, flockmates) {
        let average = new Victor(0, 0);
        
        if (flockmates.length <= 0) {
            return average;
        }
        
        // Get the average position of all nearby boids.
        for (let other of flockmates) {
            average.add(other.pos);
        }
    
        let avgPos = average.divideScalar(flockmates.length);
        
        let desired = avgPos.subtract(boid.pos);
        if (desired.length() > 0) {
            const SPEED_WEIGHT = 0.5;
            desired.normalize().multiplyScalar(SPEED_WEIGHT);
        }
        
        return steer(boid, desired);
    }

    calcRunAway(boid, predators) {
        const runAwayDist = 50;
        let desired = new Victor(0, 0);

        for (let predator of predators) {
            let dist = boid.pos.distance(predator.pos);

            if (dist < runAwayDist && dist > 0) {
                let diff = boid.pos.clone().subtract(predator.pos).normalize().divideScalar(dist);
                desired.add(diff);
            }
        }
    
        if (desired.length() <= 0) {
            return desired;
        }

        desired.normalize().multiplyScalar(constants.DESIRED_SPEED * 4);
        return steer(boid, desired);    
    };

    update(population, predators) {

        // remove any dead boids
        let pop = population.filter((boid) => boid.isAlive);

        for (let boid of pop) {
            
            // check if eaten by predator
            for (let predator of predators) {
                if (boid.pos.distance(predator.pos) <= predator.radius) {
                    boid.isAlive = false;
                    predator.radius += 0.25;
                    continue;
                }
            }

            // find nearby boids (flockmates)
            let flockmates = 
                pop.filter(
                    (other) => {return(boid.pos.distance(other.pos) <= constants.VIEW_DIST)});

            // Make decision based on forces
            let sepForce = this.calcSeparation(boid, flockmates);
            let aliForce = this.calcAlignment(boid, flockmates);
            let cohForce = this.calcCohesion(boid, flockmates);
            let runForce = this.calcRunAway(boid, predators).multiplyScalar(10);

            // add forces
            boid.a.add(runForce).add(sepForce).add(aliForce).add(cohForce);
            boid.a = limitForce(boid.a);

            // Update velocity
            boid.v.add(boid.a);	

            // Apply velocity to position
            boid.pos.add(boid.v);

            wrapPosition(boid.pos, this.worldWidth, this.worldHeight);
        }

        return(pop);
    }

}