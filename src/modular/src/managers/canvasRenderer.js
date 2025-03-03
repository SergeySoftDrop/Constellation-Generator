import Point from "../models/point.js";

export default class CanvasRenderer {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @param {Point} point 
     * @param {string} color 
     */
    drawPoint(point, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(point.coordinates.X, point.coordinates.Y, point.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * @param {Point} point1
     * @param {Point} point2
     * @param {Number} lineWidth
     * @param {String} color
     */
    drawLine(point1, point2, lineWidth, color) {
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(point1.coordinates.X, point1.coordinates.Y);
        this.ctx.lineTo(point2.coordinates.X, point2.coordinates.Y);
        this.ctx.stroke();
    }
}