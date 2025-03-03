import Coordinates from "../models/coordinates.js";
import Point from "../models/point.js";
import Size from "../models/size.js";
import Speed from "../models/speed.js";

/**
 * @typedef {Object} PointOptions
 * @property {boolean} startInBorder
 * @property {Size} fieldSize 
 * @property {Size} minPointsSpeed 
 * @property {Size} maxPointsSpeed 
 * @property {Number} pointRadius 
 */

/**
 * @param {PointOptions} options 
 * @returns {Point}
 */
export function getPoint(options) {
    const coords = getRandSpawnCoords(options.fieldSize, options.pointRadius, options.startInBorder);
    const speed = getRandSpeed(options.fieldSize, coords, options.minPointsSpeed, options.maxPointsSpeed);

    return new Point(coords, speed, options.pointRadius);
}

/**
 * @param {boolean} borderOnly 
 * @param {Size} fieldSize 
 * @param {Number} pointRadius 
 * @returns {Coordinates}
 */
export function getRandSpawnCoords(fieldSize, pointRadius, borderOnly = true) {
    let padding = pointRadius * 1.2;
    const coordinates = new Coordinates();

    if(!borderOnly) {
        coordinates.X = getRandom(padding, fieldSize.width - padding);
        coordinates.Y = getRandom(padding, fieldSize.height - padding);

        return coordinates;
    }

    const side = getRandom(1, 4);

    switch (side) {
        case 1: // LEFT
            coordinates.X = padding;
            coordinates.Y = getRandom(0, fieldSize.height);
            break;
        case 2: // TOP
            coordinates.X = getRandom(0, fieldSize.width);
            coordinates.Y = padding;
            break;
        case 3: // RIGHT
            coordinates.X = fieldSize.width - padding;
            coordinates.Y = getRandom(0, fieldSize.height);
            break;
        case 4: // BOTTOM
            coordinates.X = getRandom(0, fieldSize.width);
            coordinates.Y = fieldSize.height - padding;
            break;
    }

    return coordinates;
}

/**
 * @param {Coordinates|null|undefined} coords 
 * @param {Size} fieldSize
 * @param {Number} minPointsSpeed
 * @param {Number} maxPointsSpeed
 * @returns {Speed}
 */
export function getRandSpeed(fieldSize, coords, minPointsSpeed, maxPointsSpeed) {
    const speed = new Speed();

    const middle = {
        x: fieldSize.width / 2,
        y: fieldSize.height / 2
    };

    let 
        randVX = getRandom(minPointsSpeed / getRandom(1.5, 4), maxPointsSpeed / getRandom(1.5, 4)),
        randVY = getRandom(minPointsSpeed / getRandom(1.5, 4), maxPointsSpeed / getRandom(1.5, 4));

    if(!coords) {
        const XVRandDir = getRandom(1, 2);
        const YVRandDir = getRandom(1, 2);

        speed.XV = XVRandDir == 1 ? -randVX : randVX;
        speed.YV = YVRandDir == 1 ? -randVY : randVY;

        return speed;
    }

    if(coords.X >= middle.x) {
        speed.XV = -(randVX);
    } else {
        speed.XV = randVX;
    }

    if(coords.Y >= middle.y) {
        speed.YV = -(randVY);
    } else {
        speed.YV = randVY;
    }

    return speed;
}

export function getRandom(min, max) {
    if(min > max) {
        [min, max] = [max, min];
    }
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}