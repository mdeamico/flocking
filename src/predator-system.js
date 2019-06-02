import { Predator } from './predator.js'
import { limitForce, wrapPosition, steer } from './steering-functions.js'
import * as constants from './constants.js'

export class PredatorSystem {
    constructor(world) {
        // store world width & height for wrapping predator positions
        this.worldWidth = world.width;
        this.worldHeight = world.height;
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
            predator.radius /= Math.sqrt(2); // cut area in half
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