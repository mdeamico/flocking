export class Boid {
    constructor(x, y) {
        this.pos = new Victor(x, y);
        this.v = new Victor(0,0);
        this.a = new Victor(0,0);
        this.isAlive = true;
    }
}