/**
 * Checks that the number is in the specified range.
 * @param {number} value
 * @param {number} [min=Number.MIN_VALUE] - Minimum valid value (default is `Number.MIN_VALUE`).
 * @param {number} [max=Number.MAX_VALUE] - Maximum valid value (default is `Number.MAX_VALUE`).
 * @returns {boolean}
 */
export function validateRange(value, min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
    if(isNaN(min) || isNaN(max)) {
        throw new Error('min and max must be numbers');
    }

    min = min ?? Number.MIN_VALUE;
    max = max ?? Number.MAX_VALUE;

    return value >= min && value <= max;
}

/**
 * Checks whether the value is empty.
 * @param {string | number | null | undefined} value
 * @returns {boolean}
 */
export function isEmpty(value) {
    return value === null || value === undefined || value === '';
}

/**
 * Checks whether the value is a number.
 * @param {any} value
 * @returns {boolean}
 */
export function isNumber(value) {
    return !isNaN(value);
}

/**
 * Checks whether the value is an integer.
 * @param {Number} value
 * @returns {boolean}
 */
export function isInteger(value) {
    return Number.isInteger(value);
}

/**
 * Checks whether the value is rgb, rgba, or hex.
 * @param {string} value
 * @returns {boolean}
 */
export function isColor(value) {
    return /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|0?\.\d+|1(\.0)?)\s*)?\)$/.test(value) || // rgb, rgba
           /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value); // hex
}

/**
 * Error messages
 */
const ERROR_MESSAGES = {
    NOT_A_NUMBER: (value) => `${value} is not a number`,
    NOT_AN_INTEGER: (value) => `${value} is not an integer`,
    OUT_OF_RANGE: (value, min, max) => {
        const minMessage = min !== undefined ? min : "no minimum limit";
        const maxMessage = max !== undefined ? max : "no maximum limit";
        return `${value} must be greater than ${minMessage} and less than ${maxMessage}`;
    },    
    NOT_A_VALID_COLOR: (value) => `${value} is not a valid color`,
};

/**
 * @typedef {Object} ValidationResult
 * @property {HTMLInputElement|HTMLAreaElement} source
 * @property {string[]} errors
 * @property {boolean} isHasErrors
 * @property {string|Number|null} validatedData
 */

/**
 * Validates the input based on its type.
 * @param {HTMLInputElement|HTMLAreaElement} inp 
 * @returns {ValidationResult}
 */
export function validateInput(inp) {
    /** @type {ValidationResult} */
    const res = {
        source: inp,
        errors: [],
        isHasErrors: false,
        validatedData: null,
    };

    const value = inp.value;

    switch(inp.dataset.type) {
        case 'int':
            const numberValue = Number(value);
            
            if(!isNumber(numberValue)) {
                res.errors.push(ERROR_MESSAGES.NOT_A_NUMBER(value));
                break;
            }
            if(!isInteger(numberValue)) {
                res.errors.push(ERROR_MESSAGES.NOT_AN_INTEGER(value));
                break;
            }
            if(!validateRange(numberValue, inp.min ? Number(inp.min) : Number.MIN_VALUE, inp.max ? Number(inp.max) : Number.MAX_VALUE)) {
                res.errors.push(ERROR_MESSAGES.OUT_OF_RANGE(value, inp.min, inp.max));
                break;
            }            

            res.validatedData = numberValue;
            break;
        case 'color':
            if(!isColor(value)) {
                res.errors.push(ERROR_MESSAGES.NOT_A_VALID_COLOR(value));
                break;
            }

            res.validatedData = value;
            break;
        case 'bool':
            res.validatedData = !!inp.checked;
            break;
        default:
            throw new Error(`Invalid data type in input: ${inp.dataset.type}`);
    }

    res.isHasErrors = res.errors.length > 0;

    return res;
}
