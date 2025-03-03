const points = [];

const DOM = {
    inputs: {
        maxPointsNumberInpEl: document.querySelector("#points_number_inp"),
        minLineLengthInpEl: document.querySelector("#min_line_length_inp"),
        maxPointsSpeedInpEl: document.querySelector("#max_points_speed"),
        minPointsSpeedInpEl: document.querySelector("#min_points_speed"),
        maxFieldWidthInpEl: document.querySelector("#max_field_width"),
        maxFieldHeightInpEl: document.querySelector("#max_field_height"),
        pointRadiusInpEl: document.querySelector("#point_radius"),
        lineColorInpEl: document.querySelector("#line_color"),
        pointColorInpEl: document.querySelector("#point_color"),
        bodyColorInpEl: document.querySelector("#body_color"),
        bounceCheckboxEl: document.querySelector("#bounce"),
    },
    buttons: {
        resetBtnEl: document.querySelector("#reset_btn"),
        cancelBtnEl: document.querySelector("#cancel_btn"),
        saveBtnEl: document.querySelector("#save_btn"),
        closeBtnEl: document.querySelector("#close_btn"),
        settingsBtn: document.querySelector("#settings_btn"), 
    },
    modalWwindowEl: document.querySelector("#modal"),
    canvasEl: document.querySelector("#canvas")
};

var config = {
    default: {
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
    },
    current: {},
    loaded: {}
};
Object.defineProperty(config, "current", {
    get() {
        return this._current;
    },
    set(newObj) {
        this._current = new Proxy(newObj, {
            set(target, prop, value) {
                if(target[prop] == value) return true;

                target[prop] = value;
                updateUIState(prop);
                updatePoints(prop);
                return true;
            }
        });

        updateUIState(...Object.keys(newObj));
        updatePoints(...Object.keys(newObj));
    }
});
initConfig();

initInputs();

const errors = {
    maxPointsNumber: null,
    minLineLength: null,
    maxPointsSpee: null,
    minPointsSpeed: null,
    maxFieldWidth: null,
    maxFieldHeight: null,
    bodyColor: null,
    bounce: null
};

function initInputs() {
    updateInputsValuesfromCurrentConf();

    for(const [key, el] of Object.entries(DOM.inputs)) {
        if(!el) {
            console.error(`Element for key '${key}' is undefined, was skipped.`);
            continue;
        }

        if(!el.dataset.conf_field || !Object.keys(config.current).includes(el.dataset.conf_field)) {
            console.error(`Element for key '${key}' doesn't have a valid config field name, was skipped.`);
            continue;
        }
        
        switch(el.dataset.type) {
            case 'int':
                el.addEventListener('blur', (e) => {
                    if(!validateIntInput(el.value, el.dataset.conf_field, el.max, el.min))
                    {
                        handleErrorClass(true, el);
                        showError(el.dataset.conf_field, el);
                    } else {
                        handleErrorClass(false, el);
                        config.current[el.dataset.conf_field] = Number(el.value);
                    }
                });
                break;
            case 'color':
                el.addEventListener('blur', () => {
                    if(!validateColor(el.value, el.dataset.conf_field))
                    {
                        handleErrorClass(true, el);
                        showError(el.dataset.conf_field, el);
                    } else {
                        handleErrorClass(false, el);
                        config.current[el.dataset.conf_field] = el.value;
                    }
                });
                break;
            case 'bool':
                el.addEventListener('input', () => {
                    config.current[el.dataset.conf_field] = !!el.checked;
                });
                break;
            default:
                console.error(`${key} doesn't have a valid data type, was skipped.`);
                continue;
        }

        el.oninput = () => el.setCustomValidity('');
    }
}

function updateInputsValuesfromCurrentConf() {
    for(const el of Object.values(DOM.inputs)) {
        switch(el.dataset.type) {
            case 'int':
            case 'color':
                el.value = config.current[el.dataset.conf_field];
                break;
            case 'bool':
                el.checked = config.current[el.dataset.conf_field];
                break;
        }
    }
}

function clearErrors() {
    for(const el of Object.values(DOM.inputs)) {
        el.setCustomValidity('');
    }
}

function showError(error_field, el) {
    el.setCustomValidity(errors[error_field]);
    el.reportValidity();
}

function handleErrorClass(hasErrors, el) {
    if(hasErrors && !el.classList.contains('error')) el.classList.add('error');
    else if(!hasErrors && el.classList.contains('error')) el.classList.remove('error');
}

function validateColor(value, error_field) {
    if(
        !/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|0?\.\d+|1(\.0)?)\s*)?\)$/.test(value) && //rgb. rgba
        !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value) //hex
    ) {
        errors[error_field] = `${value} is not valid rgba or hex color`;
        return false;
    }

    return true;
}

function validateIntInput(value, error_field, max = Number.MAX_VALUE, min = Number.MIN_VALUE) {
    const num = Number(value);

    if(!Number.isInteger(num)) {
        errors[error_field] = `${value} is not valid integer value`;
        return false;
    }

    if(max && num > max) {
        errors[error_field] = `${value} is bigger than ${max}`;
        return false;
    }
    
    if(min && num < min) {
        errors[error_field] = `${value} is less than ${min}`;
        return false;
    }

    return true;
}

function initConfig() {
    config.current = structuredClone(config.default);

    const userConfig = localStorage.getItem('user-config');
    if(userConfig != null) {
        try {
            const parsedConfig = JSON.parse(userConfig);
            if(typeof parsedConfig === 'object' && parsedConfig != null) {
                Object.assign(config.current, parsedConfig);
            } else {
                localStorage.removeItem('user-config');
            }
        } catch {
            localStorage.removeItem('user-config');
        }
    } else {
        togleSettingsModalWindowState();
        saveConfig();
    }

    config.loaded = {...config.current};
}

function saveConfig() {
    localStorage.setItem('user-config', JSON.stringify(config.current));
}

function togleSettingsModalWindowState() {
    clearErrors();

    DOM.modalWwindowEl.classList.toggle('active');
}

function updateUIState(...configProps) {
    for(const prop of configProps) {
        switch(prop) {
            case "bodyColor":
                document.body.style.backgroundColor = config.current[prop];
                break;
            case "maxFieldWidth":
                if(config.current[prop] == 0) DOM.canvasEl.width = window.innerWidth;
                else DOM.canvasEl.width = config.current[prop];
                break;
            case "maxFieldHeight":
                if(config.current[prop] == 0) DOM.canvasEl.height = innerHeight;
                else DOM.canvasEl.height = config.current[prop] ;
                break;
        }
    }
}

function updatePoints(...configProps) {
    for(const prop of configProps) {
        switch(prop) {
            case "minPointsSpeed":
            case "maxPointsSpeed":
                points.forEach((point) => {
                    const speed = getRandSpeed(null);

                    point.vy =  speed.vy;
                    point.vx = speed.vx;
                });
                break;
        }
    }
}

window.addEventListener('resize', () => {
    if(config.current.maxFieldWidth == 0) DOM.canvasEl.width = window.innerWidth;
    if(config.current.maxFieldHeight == 0) DOM.canvasEl.height = window.innerHeight;
});

DOM.buttons.resetBtnEl.addEventListener('click', () => {
    config.current = {...config.default};

    updateInputsValuesfromCurrentConf();
});
DOM.buttons.cancelBtnEl.addEventListener('click', () => {
    togleSettingsModalWindowState();

    config.current = structuredClone(config.loaded);
    updateInputsValuesfromCurrentConf();
});
DOM.buttons.saveBtnEl.addEventListener('click', () => {
    saveConfig();
});
DOM.buttons.closeBtnEl.addEventListener('click', () => {
    togleSettingsModalWindowState();
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'Escape') {
        togleSettingsModalWindowState();
    }
});
DOM.buttons.settingsBtn.addEventListener('mouseup', () => {
    togleSettingsModalWindowState();
});

const ctx = DOM.canvasEl.getContext("2d");

while(points.length < config.current.maxPointsNumber / 1.4) {
    points.push(getPoint(false));
}

function loop() {
    ctx.clearRect(0, 0, DOM.canvasEl.width, DOM.canvasEl.height);

    if(points.length < config.current.maxPointsNumber) {
        let neededPoints = config.current.maxPointsNumber - points.length; 
    
        for(let i = 0; i < neededPoints; i++) {
            points.push(getPoint());
    
            if(getRandom(1, neededPoints - i + 1) === 1) break;
        }
    }    

    move();
    drawLines();
    drawPoints();

    requestAnimationFrame(loop);
}

function getPoint(startInBorder = true) {
    let coords = getRandSpawnCoords(startInBorder);
    let speed = getRandSpeed(coords);

    return {
        x: coords.x,
        y: coords.y,
        vy: speed.vy,
        vx: speed.vx,
    };
}

function move() {
    points.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;

        if(config.current.bounce) {
            if(point.x >= DOM.canvasEl.width - config.current.pointRadius && point.vx > 0) {
                point.vx = -point.vx;
            } else if(point.x <= config.current.pointRadius && point.vx < 0) {
                point.vx = -point.vx;
            }

            if(point.y >= DOM.canvasEl.height - config.current.pointRadius && point.vy > 0) {
                point.vy = -point.vy;
            } else if(point.y <= config.current.pointRadius && point.vy < 0) {
                point.vy = -point.vy;
            }
        } else {
            if(
                point.x > DOM.canvasEl.width + config.current.pointRadius || point.x < -config.current.pointRadius ||
                point.y > DOM.canvasEl.height + config.current.pointRadius || point.y < -config.current.pointRadius
            ) {
                points.splice(index, 1);
            }
        }
    });
}

function drawPoints() {
    ctx.fillStyle = config.current.pointColor;

    points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, config.current.pointRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawLines() {
    ctx.strokeStyle = config.current.lineColor;
    ctx.lineCap = "round";

    for(let i = 0; i < points.length; i++) {
        for(let j = i + 1; j < points.length; j++) {
            let dx = points[i].x - points[j].x;
            let dy = points[i].y - points[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < config.current.minLineLength) {
                ctx.lineWidth = config.current.pointRadius * (1 - (distance / config.current.minLineLength) ** 2);
                ctx.lineWidth = Math.max(1, ctx.lineWidth);
                

                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.stroke();
            }
        }
    }
}

function getRandSpeed(coords) {
    let vx, vy;

    const middle = {
        x: DOM.canvasEl.width / 2,
        y: DOM.canvasEl.height / 2
    };

    let 
        randVX = getRandom(config.current.minPointsSpeed / getRandom(1.5, 4), config.current.maxPointsSpeed / getRandom(1.5, 4)),
        randVY = getRandom(config.current.minPointsSpeed / getRandom(1.5, 4), config.current.maxPointsSpeed / getRandom(1.5, 4));

    if(!coords) {
        const VXRandDir = getRandom(1, 2);
        const VYRandDir = getRandom(1, 2);

        vx = VXRandDir == 1 ? -randVX : randVX;
        vy = VYRandDir == 1 ? -randVY : randVY;

        return { vx, vy };
    }

    if(coords.x >= middle.x) {
        vx = -(randVX);
    } else {
        vx = randVX;
    }

    if(coords.y >= middle.y) {
        vy = -(randVY);
    } else {
        vy = randVY;
    }

    return { vx, vy };
}

function getRandSpawnCoords(borderOnly = true) {
    let padding = config.current.pointRadius * 1.2;

    if(!borderOnly) {
        return {
            x: getRandom(padding, DOM.canvasEl.width - padding),
            y: getRandom(padding, DOM.canvasEl.height - padding),
        };
    }

    let x, y;
    let side = getRandom(1, 4);

    switch (side) {
        case 1: // LEFT
            x = padding;
            y = getRandom(0, DOM.canvasEl.height);
            break;
        case 2: // TOP
            x = getRandom(0, DOM.canvasEl.width);
            y = padding;
            break;
        case 3: // RIGHT
            x = DOM.canvasEl.width - padding;
            y = getRandom(0, DOM.canvasEl.height);
            break;
        case 4: // BOTTOM
            x = getRandom(0, DOM.canvasEl.width);
            y = DOM.canvasEl.height - padding;
            break;
    }

    return { x, y };
}

function getRandom(min, max) {
    if(min > max) {
        [min, max] = [max, min];
    }
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

loop();