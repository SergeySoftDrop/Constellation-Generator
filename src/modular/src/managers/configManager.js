import DOMManager from "./domManager.js";

export default class ConfigManager extends EventTarget {
    /**
     * @typedef {Object} Config
     * @property {number} maxPointsNumber - Максимальное количество точек
     * @property {number} minLineLength - Минимальная длина линии
     * @property {number} maxPointsSpeed - Максимальная скорость точек
     * @property {number} minPointsSpeed - Минимальная скорость точек
     * @property {number} pointRadius - Радиус точки
     * @property {number} maxFieldWidth - Максимальная ширина поля
     * @property {number} maxFieldHeight - Максимальная высота поля
     * @property {string} bodyColor - Цвет фона
     * @property {string} lineColor - Цвет линии
     * @property {string} pointColor - Цвет точки
     * @property {boolean} bounce - Отскакивают ли точки от границ
     */

    /**
     * @type {Config}
     * @private
     */
    _defaultConfig = {
        maxPointsNumber: 200,
        minLineLength: 100,
        maxPointsSpeed: 5,
        minPointsSpeed: 2,
        pointRadius: 6,
        maxFieldWidth: 0,
        maxFieldHeight: 0,
        bodyColor: "#111111",
        lineColor: "#0064f0",
        pointColor: "#0094f0",
        bounce: true
    };

    /**
     * @type {Config}
     */
    currentConfig = structuredClone(this._defaultConfig);

    /**
     * @type {Config}
     */
    loadedConfig = {};

    /**
     * @param {DOMManager} domManager
     */
    constructor(domManager) {
        super();

        /** @type {DOMManager} */
        this.domManager = domManager;

        this.load();
    }

    load() {
        const userConfig = localStorage.getItem('user-config');

        if (userConfig) {
            try {
                /** @type {Config} */
                const parsedConfig = JSON.parse(userConfig);
                if (typeof parsedConfig === 'object' && parsedConfig !== null) {
                    Object.assign(this.currentConfig, parsedConfig);
                } else {
                    localStorage.removeItem('user-config');
                }
            } catch {
                localStorage.removeItem('user-config');
            }
        } else {
            this.domManager.modalWindowEl.classList.add('active');
            this.save();
        }

        this.loadedConfig = { ...this.currentConfig };
    }

    /**
     * @private
     * @param {Config} oldCurrentConf
     */
    handleConfDiff(oldCurrentConf) {
        if(
            oldCurrentConf.bodyColor != this.currentConfig.bodyColor
        ) {
            this.dispatchEvent(new Event('uiUpdated'));
        }

        if(
            oldCurrentConf.minPointsSpeed != this.currentConfig.minPointsSpeed || 
            oldCurrentConf.maxPointsSpeed != this.currentConfig.maxPointsSpeed
        ) {
            this.dispatchEvent(new Event('pointSpeedUpated'));
        }

        if(
            oldCurrentConf.pointRadius != this.currentConfig.pointRadius
        ) {
            this.dispatchEvent(new Event('pointRadiusUpated'));
        }
    }
    
    /**
     * @param {string} key 
     * @param {string|number} value 
     */
    setValue(key, value) {
        this.currentConfig[key] = value;

        if(
            key == 'bodyColor' ||
            key == 'maxFieldWidth' ||
            key == 'maxFieldHeight'
        ) {
            this.dispatchEvent(new Event('uiUpdated'));
        } else if(
            key == 'maxPointsSpeed' || 
            key == 'minPointsSpeed'
        ) {
            this.dispatchEvent(new Event('pointSpeedUpated'));
        } else if(key == 'pointRadius') {
            this.dispatchEvent(new Event('pointRadiusUpated'));
        }
    }

    /**
     * @param {string} key 
     * @returns {any}
     */
    getValue(key) {
        return this.currentConfig[key];
    }

    /**
     * @param {string} key 
     * @return {boolean}
     */
    hasKey(key) {
        return Object.keys(this.currentConfig).includes(key)
    }

    save() {
        localStorage.setItem('user-config', JSON.stringify(this.currentConfig));
    }

    reset() {
        const oldCurrentConf = structuredClone(this.currentConfig);

        this.currentConfig = structuredClone(this._defaultConfig);

        this.handleConfDiff(oldCurrentConf);
    }

    cancelChanges() {
        const oldCurrentConf = structuredClone(this.currentConfig);

        this.currentConfig = structuredClone(this.loadedConfig);

        this.handleConfDiff(oldCurrentConf);
    }
}
