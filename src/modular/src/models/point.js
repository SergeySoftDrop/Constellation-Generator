import Coordinates from "./coordinates.js";
import Size from "./size.js";
import Speed from "./speed.js";

export default class Point {
    /**
     * @param {Coordinates} coordinates 
     * @param {Speed} speed 
     * @param {Number} radius  
     */
    constructor(coordinates, speed, radius) {
        this.coordinates = coordinates;
        this.speed = speed;
        this.radius = radius;
    }

    move() {
        this.coordinates.X += this.speed.XV;
        this.coordinates.Y += this.speed.YV;
    }

    /**
     * @param {Size} fieldSize 
     */
    checkSpeedOffPos(fieldSize) {
        if(this.coordinates.X >= fieldSize.width - this.radius && this.speed.XV > 0) {
            this.speed.XV = -this.speed.XV;
        } else if(this.coordinates.X <= this.radius && this.speed.XV < 0) {
            this.speed.XV = -this.speed.XV;
        }

        if(this.coordinates.Y >= fieldSize.height - this.radius && this.speed.YV > 0) {
            this.speed.YV = -this.speed.YV;
        } else if(this.coordinates.Y <= this.radius && this.speed.YV < 0) {
            this.speed.YV = -this.speed.YV;
        }
    }

    /**
     * @param {Size} fieldSize 
     * @returns {Boolean}
     */
    isOutOfBounds(fieldSize) {
        return (
            this.coordinates.X > fieldSize.width + this.radius || this.coordinates.X < -this.radius ||
            this.coordinates.Y > fieldSize.height + this.radius || this.coordinates.Y < -this.radius
        );
    }
}