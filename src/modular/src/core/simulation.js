import CanvasRenderer from "../managers/canvasRenderer.js";
import ConfigManager from "../managers/configManager.js";
import DOMManager from "../managers/domManager.js";
import Point from "../models/point.js";
import Size from "../models/size.js";
import { getPoint, getRandom, getRandSpeed } from "../utils/generator.js";

export default class Simulation {
    /**
     * @private
     * @type {boolean}
     */
    isRunning = false;

    /**
     * @private
     * @type {Point[]}
     */
    _points = [];

    /**
     * @param {ConfigManager} configManager 
     * @param {DOMManager} domManager 
     * @param {CanvasRenderer} canvasRender 
     */
    constructor(configManager, domManager, canvasRender) {
        this.configManager = configManager;
        this.domManager = domManager;
        this.canvasRender = canvasRender;

        configManager.addEventListener('pointRadiusUpated', () => {
            this.updatePoints({radiusUpdated: true});
        });
        configManager.addEventListener('pointSpeedUpated', () => {
            this.updatePoints({speedUpated: true});
        });
    }

    start() {
        this.isRunning = true;

        this.createPoints(this.configManager.currentConfig.maxPointsNumber / 1.4, false);

        this.loop();
    }

    /**
     * @param {Number} count 
     * @param {Boolean} [startInBorder=true]
     */
    createPoints(count, startInBorder = true) {
        for(let i = 0; i < count; i++) {
            this._points.push(getPoint({
                fieldSize: new Size(this.domManager.canvasEl.width, this.domManager.canvasEl.height),
                maxPointsSpeed: this.configManager.currentConfig.maxPointsSpeed,
                minPointsSpeed: this.configManager.currentConfig.minPointsSpeed,
                pointRadius: this.configManager.currentConfig.pointRadius,
                startInBorder
            }));
        }
    }

    /**
     * @param {Object} options 
     * @param {boolean} options.radiusUpdated
     * @param {boolean} options.speedUpated
     */
    updatePoints(options = {}) {
        this._points.forEach((point) => {
            if(options.radiusUpdated) point.radius = this.configManager.currentConfig.pointRadius

            if(options.speedUpated) {
                point.speed = getRandSpeed(
                    new Size(
                        this.domManager.canvasEl.width,
                        this.domManager.canvasEl.height,
                    ), 
                    null, 
                    this.configManager.currentConfig.minPointsSpeed,
                    this.configManager.currentConfig.maxPointsSpeed
                )
            }
        });
    }

    loop() {
        if(!this.isRunning) return;

        this.canvasRender.clear();

        if(this._points.length < this.configManager.currentConfig.maxPointsNumber) {
            const neededPoints = this.configManager.currentConfig.maxPointsNumber - this._points.length; 
        
            for(let i = 0; i < neededPoints; i++) {
                this.createPoints(1);
        
                if(getRandom(1, neededPoints - i + 1) === 1) break;
            }
        } 

        for(let i = 0; i < this._points.length; i++) {
            const point = this._points[i];
            
            const fieldSize = new Size(
                this.domManager.canvasEl.width,
                this.domManager.canvasEl.height
            )
    
            point.move();
    
            if(this.configManager.currentConfig.bounce) 
            {
                point.checkSpeedOffPos(fieldSize);
            } else if(point.isOutOfBounds(fieldSize)) {
                this._points.splice(i, 1);
            }
        }

        for(let i = 0; i < this._points.length; i++) {
            for(let j = 0; j < this._points.length; j++) {
                const dx = this._points[i].coordinates.X - this._points[j].coordinates.X;
                const dy = this._points[i].coordinates.Y - this._points[j].coordinates.Y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < this.configManager.currentConfig.minLineLength) {
                    let lineWidth = this._points[i].radius * (1 - (distance / this.configManager.currentConfig.minLineLength) ** 2);
                    lineWidth = Math.max(1, lineWidth);

                    this.canvasRender.drawLine(this._points[i], this._points[j], lineWidth, this.configManager.currentConfig.lineColor);
                }
            }
        }

        this._points.forEach((point) => {
            this.canvasRender.drawPoint(point, this.configManager.currentConfig.pointColor);
        })

        requestAnimationFrame(this.loop.bind(this));
    }
}