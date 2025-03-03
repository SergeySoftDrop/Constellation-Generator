import DOMManager from "./managers/domManager.js";
import ConfigManager from "./managers/configManager.js";
import UIManager from "./managers/uiManager.js";
import Simulation from "./core/simulation.js";
import CanvasRenderer from "./managers/canvasRenderer.js";

export default class App {
    constructor() {
        /** @type {DOMManager} */
        this.domManager = new DOMManager();
        /** @type {ConfigManager} */
        this.configManager = new ConfigManager(this.domManager);
        /** @type {UIManager} */
        this.uiManager = new UIManager(this.domManager, this.configManager);
        /** @type {CanvasRenderer} */
        this.canvasRenderer = new CanvasRenderer(this.domManager.canvasEl);
        /** @type {Simulation} */
        this.simulation = new Simulation(this.configManager, this.domManager, this.canvasRenderer);
    }

    run() {
        this.simulation.start();
    }
}