function getRand(min, max) {
    // inclusive
    return Math.floor(Math.random()*(max-min+1)+min);
}

export class Boid {
    constructor() {
        this.pos = new Victor(getRand(0, 600), getRand(0, 300));
        this.v = new Victor(0,0);
        this.a = new Victor(0,0);
        this.isAlive = true;
    }
}