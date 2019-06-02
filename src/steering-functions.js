// Common functions for steering boids 

export function limitForce(vector) {
    const maxForce = 0.05;
    if (vector.length() > maxForce) {
        vector.normalize().multiplyScalar(maxForce);
    }
    return vector;
}

export function wrapPosition(pos, maxWidth, maxHeight) {
    
    if (pos.x < 0) {
        pos.x = maxWidth;
    } else if (pos.x >= maxWidth) {
        pos.x = 5; // using 5 as a buffer distance
    }

    if (pos.y < 0) {
        pos.y = maxHeight;
    } else if (pos.y >= maxHeight) {
        pos.y = 5; // using 5 as a buffer distance
    }
}

export function steer(boid, desired) {
    return desired.subtract(boid.v);
}