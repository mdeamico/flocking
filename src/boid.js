export class Boid {
    constructor() {
        console.log('Boid Constructor');
        this.x = Math.floor(Math.random() * 300) + 1;
        this.y = Math.floor(Math.random() * 300) + 1;
        this.vx = Math.floor(Math.random() * 3) + 1;
        this.vy = Math.floor(Math.random() * 3) + 1;
    }
}