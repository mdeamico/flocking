export class Predator {
    constructor(x, y, r) {
        this.pos = new Victor(x, y);
        this.v = new Victor(0,0);
        this.a = new Victor(0,0);
        this.radius = r;
        this.shouldSplit = false;
    }
}
