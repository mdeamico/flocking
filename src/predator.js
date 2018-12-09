export class Predator {
    constructor() {
        this.pos = new Victor(100, 100);
        this.v = new Victor(0,0);
        this.a = new Victor(0,0);
        this.trackingID = -1;
        this.radius = 4;
    }
}
