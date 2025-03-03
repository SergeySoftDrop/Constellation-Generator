import { validateInput } from "../utils/validation.js";
import ConfigManager from "./configManager.js";
import DOMManager from "./domManager.js";

export default class UIManager {
    /**
     * 
     * @param {DOMManager} domManager 
     * @param {ConfigManager} configManager 
     */
    constructor(domManager, configManager) {
        /** @type {DOMManager} */
        this.domManager = domManager;
        /** @type {ConfigManager} */
        this.configManager = configManager;

        this.init();
    }

    init() {
        this.setInputsValuesFromConf();
        this.handleInputs();
        this.handleButtons();
        this.handleStates();
        this.updateUI();
    }

    setInputsValuesFromConf() {
        for(const el of Object.values(this.domManager.inputs)) {
            switch(el.dataset.type) {
                case 'int':
                case 'color':
                    el.value = this.configManager.currentConfig[el.dataset.conf_field];
                    break;
                case 'bool':
                    el.checked = this.configManager.currentConfig[el.dataset.conf_field];
                    break;
                default:
                    console.warn(`Unknow input type: ${el.dataset.type}`);
            }
        }
    }

    handleInputs() {
        for(const [key, el] of Object.entries(this.domManager.inputs)) {
            if(!el) {
                console.warn(`Element for key '${key}' is undefined, was skipped.`);
                continue;
            }
    
            if(!el.dataset.conf_field || !this.configManager.hasKey(el.dataset.conf_field)) {
                console.warn(`Element for key '${key}' doesn't have a valid config field name, was skipped.`);
                continue;
            }

            switch(el.dataset.type) {
                case 'int':
                case 'color':
                    el.addEventListener('blur', () => this.handleInp(el));
                    break;
                case 'bool':
                    el.addEventListener('input', () => this.handleInp(el));
                    break;
                default:
                    console.error(`${key} doesn't have a valid data type, was skipped.`);
                    continue;
            }
    
            el.oninput = () => el.setCustomValidity('');
        }
    }

    handleStates() {
        window.addEventListener('resize', () => {
            this.updateUI();
        });

        this.configManager.addEventListener('uiUpdated', () => {
            this.updateUI();
        });
    }

    handleButtons() {
        this.domManager.buttons.resetBtnEl.addEventListener('click', () => {
            this.configManager.reset();
        
            this.setInputsValuesFromConf();
        });
        this.domManager.buttons.cancelBtnEl.addEventListener('click', () => {
            this.configManager.cancelChanges();

            this.setInputsValuesFromConf();

            this.closeSettings();
        });
        this.domManager.buttons.saveBtnEl.addEventListener('click', () => {
            this.closeSettings();

            this.configManager.save();
        });
        this.domManager.buttons.closeBtnEl.addEventListener('click', () => {
            this.closeSettings();
        });
        
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                this.toggleSettings();
            }
        });
        this.domManager.buttons.settingsBtn.addEventListener('mouseup', () => {
            this.toggleSettings();
        });
    }

    clearErrors() {
        for(const el of Object.values(this.domManager.inputs)) {
            el.setCustomValidity('');
        }
    }

    updateUI() {
        if(this.configManager.currentConfig.maxFieldWidth != 0) this.domManager.canvasEl.width = this.configManager.currentConfig.maxFieldWidth;
        else this.domManager.canvasEl.width = window.innerWidth;
        if(this.configManager.currentConfig.maxFieldHeight != 0) this.domManager.canvasEl.height = this.configManager.currentConfig.maxFieldHeight;
        else this.domManager.canvasEl.height = window.innerHeight;
        
        document.body.style.backgroundColor = this.configManager.currentConfig.bodyColor;
    }

    /**
     * @param {HTMLInputElement|HTMLTextAreaElement} inp 
     * @private
     */
    handleInp(inp) {
        try {
            const res = validateInput(inp);
            this.toggleErrorClass(res.isHasErrors, res.source);

            if(res.isHasErrors) this.showError(res.errors[0], res.source);
            else if(this.configManager.getValue(inp.dataset.conf_field) != res.validatedData) this.configManager.setValue(inp.dataset.conf_field, res.validatedData);
        } catch(err) {
            console.error(`Element ${inp} doesn't successfully validate: ${err}`);
        }
    }

    /**
     * @param {boolean} hasErrors 
     * @param {HTMLElement} el 
     */
    toggleErrorClass(hasErrors, el) {
        if(hasErrors && !el.classList.contains('error')) el.classList.add('error');
        else if(!hasErrors && el.classList.contains('error')) el.classList.remove('error');
    }

    /**
     * @param {string} error 
     * @param {HTMLInputElement|HTMLTextAreaElement} target 
     */
    showError(error, target) {
        target.setCustomValidity(error);
        target.reportValidity();
    }

    toggleSettings() {
        this.clearErrors();

        this.domManager.modalWindowEl.classList.toggle('active');
    }

    openSettings() {
        this.clearErrors();

        this.domManager.modalWindowEl.classList.add('active');
    }

    closeSettings() {
        this.clearErrors();

        this.domManager.modalWindowEl.classList.remove('active');
    }
}