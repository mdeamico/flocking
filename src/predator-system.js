import { Predator } from './predator.js'
import { limitForce, wrapPosition, steer } from './steering-functions.js'
import * as constants from './constants.js'

export class PredatorSystem {
    constructor(canvas) {
        // store canvas width & height for wrapping predator positions
        this.worldWidth = canvas.width;
        this.worldHeight = canvas.height;
    }

    update(predators, boids) {

        for (let predator of predators) {
            let minDist = 99999;
            let closestBoid = null;
            let desired = new Victor(0,0);

            for (let boid of boids) {
                let dist = predator.pos.distance(boid.pos);
                if (dist < minDist) {
                    minDist = dist;
                    closestBoid = boid;
                }
            }

            if (closestBoid) {
                desired = closestBoid.pos.clone().subtract(predator.pos);
            }

            if (!desired.isZero()) {
                desired.normalize().multiplyScalar(constants.DESIRED_SPEED);
            }

            desired = steer(predator, desired);

            // add forces
            predator.a.add(desired);
            predator.a = limitForce(predator.a);

            // Update velocity
            predator.v.add(predator.a);	

            // Apply velocity to position
            predator.pos.add(predator.v);

            wrapPosition(predator.pos, this.worldWidth, this.worldHeight);

            predator.shouldSplit = (predator.radius >= 14)
        }

        for (let predator of predators) {
            if (!predator.shouldSplit) continue;
            predator.radius /= 2;
            predator.shouldSplit = false;
            
            predators.push(
                new Predator(
                    predator.pos.x + predator.radius * 2, 
                    predator.pos.y + predator.radius * 2,
                    predator.radius));
        }

        return(predators);
    }
}