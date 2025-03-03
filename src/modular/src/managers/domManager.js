export default class DOMManager {
    constructor() {
        /**
         * @typedef {Object} InputElements
         * @property {HTMLInputElement} maxPointsNumberInpEl
         * @property {HTMLInputElement} minLineLengthInpEl
         * @property {HTMLInputElement} maxPointsSpeedInpEl
         * @property {HTMLInputElement} minPointsSpeedInpEl
         * @property {HTMLInputElement} maxFieldWidthInpEl
         * @property {HTMLInputElement} maxFieldHeightInpEl
         * @property {HTMLInputElement} pointRadiusInpEl
         * @property {HTMLInputElement} lineColorInpEl
         * @property {HTMLInputElement} pointColorInpEl
         * @property {HTMLInputElement} bodyColorInpEl
         * @property {HTMLInputElement} bounceCheckboxEl
         */

        /**
         * @typedef {Object} ButtonElements
         * @property {HTMLButtonElement} resetBtnEl
         * @property {HTMLButtonElement} cancelBtnEl
         * @property {HTMLButtonElement} saveBtnEl
         * @property {HTMLButtonElement} closeBtnEl
         * @property {HTMLButtonElement} settingsBtn
         */

        /**
         * @type {InputElements}
         */
        this.inputs = {
            maxPointsNumberInpEl: document.querySelector('#points_number_inp'),
            minLineLengthInpEl: document.querySelector('#min_line_length_inp'),
            maxPointsSpeedInpEl: document.querySelector('#max_points_speed'),
            minPointsSpeedInpEl: document.querySelector('#min_points_speed'),
            maxFieldWidthInpEl: document.querySelector('#max_field_width'),
            maxFieldHeightInpEl: document.querySelector('#max_field_height'),
            pointRadiusInpEl: document.querySelector('#point_radius'),
            lineColorInpEl: document.querySelector('#line_color'),
            pointColorInpEl: document.querySelector('#point_color'),
            bodyColorInpEl: document.querySelector('#body_color'),
            bounceCheckboxEl: document.querySelector('#bounce'),
        };

        /**
         * @type {ButtonElements}
         */
        this.buttons = {
            resetBtnEl: document.querySelector('#reset_btn'),
            cancelBtnEl: document.querySelector('#cancel_btn'),
            saveBtnEl: document.querySelector('#save_btn'),
            closeBtnEl: document.querySelector('#close_btn'),
            settingsBtn: document.querySelector('#settings_btn'),
        };

        /** @type {HTMLDivElement} */
        this.modalWindowEl = document.querySelector('#modal');

        /** @type {HTMLCanvasElement} */
        this.canvasEl = document.querySelector('#canvas');
    }
}