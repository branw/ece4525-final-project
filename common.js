let SPRITES;

function initSprites() {
    SPRITES = {
        'wario_border': p.loadImage('./resources/wario_border.png'),
        'wario_background': p.loadImage('./resources/wario_background.png'),
        'wario_logo': p.loadImage('./resources/warioware_logo.png'),
        'left_boom': p.loadImage('./resources/leftboom.png'),
        'right_boom': p.loadImage('./resources/rightboom.png'),
        'inner_window': p.loadImage('./resources/inner_window.png'),
        'warioSheet': p.loadImage('./resources/wario_sheet.gif'),

        // For IntroState
        'start_button': p.loadImage('./resources/start_button.png'),
        'help_button': p.loadImage('./resources/help_button.png'),
        'option_button': p.loadImage('./resources/option_button.png'),

        // For CounterState
        'vu': p.loadImage('./resources/vu.png'),

        // For MicrogameState
        'borders': {
            'purple': p.loadImage('./resources/border_purple.png'),
            'mustard': p.loadImage('./resources/border_mustard.png'),
            'tv': p.loadImage('./resources/border_tv.png'),
        },
        'bomb': {
            'trail': [
                p.loadImage('./resources/bomb_trail0.png'),
                p.loadImage('./resources/bomb_trail1.png'),
                p.loadImage('./resources/bomb_trail2.png'),
                p.loadImage('./resources/bomb_trail3.png'),
                p.loadImage('./resources/bomb_trail4.png'),
                p.loadImage('./resources/bomb_trail5.png'),
            ],
            'flame': [
                p.loadImage('./resources/bomb_flame0.png'),
                p.loadImage('./resources/bomb_flame1.png')
            ],
        },
        
        'text' : p.loadImage('./resources/text.png'),

        // For BananaMunch
        'm_banana' : p.loadImage('./resources/m_banana/banana.png'),
        'm_banana_bg' : p.loadImage('./resources/m_banana/banana_bg.png'),

        // For DuckHunt
        'duckHunt': {
            'bg': p.loadImage('./resources/duck_hunt/bg.png'),
            'sheet': p.loadImage('./resources/duck_hunt/sheet.png'),
        },

        // For RainyCat
        'rainyCat' : {
            'sheet' : p.loadImage('./resources/rainy_cat/rainy_cat.png')
        },

        // For Shake
        'shake': {
            'border': p.loadImage('./resources/shake/border.png'),
            'sheet': p.loadImage('/resources/shake/sheet.png'),
        },
    };
}

function areSpritesLoaded(obj = SPRITES) {
    for (const [key, value] of Object.entries(obj)) {
        if (!value.hasOwnProperty('loaded')) return areSpritesLoaded(value);
        if (!value.loaded) return false;
    }

    return true;
}

function setBorderBg(r, g, b) {
    const cssColor = "rgb(" + r + ", " + g + ", " + b + ")";
    document.querySelector('body').style.backgroundColor = cssColor;
}

function setBg(r, g, b) {
    p.background(r, g, b);

    setBorderBg(r, g, b);
}

function millis() {
    return Date.now();
}

function imageFrame(s_image, iframe) {
    p.image(s_image.get(iframe["start"][0], iframe["start"][1], iframe["size"][0], iframe["size"][1]), iframe["offset"][0], iframe["offset"][1]);
}

function setCursor(active) {
    document.querySelector('canvas').style.cursor = active ? "pointer" : "auto";
}

function warioText(str) {
    const alphabet = [12, 44, 76, 108, 138, 170, 200, 232, 260, 290, 322, 352, 382, 418, 450, 482, 514, 546, 576, 606, 638, 668, 700, 734, 768, 800, 0];
    const specials = {
        // startX, startY, width, height
        '!': [794, 64, 18, 32]
    };

    let x = 0;

    str = str.toUpperCase();
    for (let i = 0; i < str.length; i++) {
        // Whitespace
        if (str[i] === ' ') {
            x += 12;
        }
        // Special characters
        else if (specials.hasOwnProperty(str[i])) {
            const data = specials[str[i]];

            p.image(SPRITES.text.get(data[0], data[1], data[2], data[3]), x, -2);
            x += data[3];
        }
        // Alphabetic characters
        else if (str[i] != str[i].toLowerCase()) {
            const pos = str.charCodeAt(i) - 'A'.charCodeAt(0);
            const start = alphabet[pos];
            const width = alphabet[pos + 1] - start;

            p.image(SPRITES.text.get(start, 2, width, 30), x, 0);
            x += width;
        }
    }
}

function isListOfNumbers(list) {
    for (let i = 0; i < list.length; i++) {
        if (isNaN(list[i])) {
            return false;
        }
    }

    return true;
}

function shuffle(a) {
    // Fisher-Yates shuffle
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor((i + 1) * Math.random());
        [a[i], a[j]] = [a[j], a[i]];
    }
}

class Vec {
    data;
    shape;

    constructor(...components) {
        if (!isListOfNumbers(components)) {
            throw "Invalid component";
        }

        this.data = components;
        this.shape = this.data.length;

        const componentMapping = {
            'x': 0, 'y': 1, 'z': 2, 'w': 3
        };

        return new Proxy(this, {
            set(obj, prop, value) {
                // 
                if (obj.hasOwnProperty(prop)) {
                    obj[prop] = value;
                }
                // Handle xyz
                else if (componentMapping.hasOwnProperty(prop)) {
                    const idx = componentMapping[prop];
                    obj.data[idx] = value;
                }
                // Handle numerics
                else if (!isNaN(prop)) {
                    obj.data[prop] = value;
                }
            },

            get(obj, prop) {
                if (prop in obj) {
                    return obj[prop];
                }
                // Handle xyz
                else if (componentMapping.hasOwnProperty(prop)) {
                    const idx = componentMapping[prop];
                    return obj.data[idx];
                }
                // Handle numerics
                else if (!isNaN(prop)) {
                    return obj.data[prop];
                }
            }
        });
    }

    add(other) {
        // Add Vec
        if (other instanceof Vec) {
            if (this.shape != other.shape) {
                throw "Shape disagreement";
            }

            for (let i = 0; i < this.shape; i++) {
                this.data[i] += other.data[i];
            }
        }
        // Add scalar
        else if (!isNaN(other)) {
            for (let i = 0; i < this.shape; i++) {
                this.data[i] += other;
            }
        }
        // Add vector in form of list
        else if (Array.isArray(other) && isListOfNumbers(other)) {
            if (this.shape != other.length) {
                throw "Shape disagreement";
            }

            for (let i = 0; i < this.shape; i++) {
                this.data[i] += other[i];
            }
        }
    }

    mag() {
        let sumSquares = 0;
        for (let i = 0; i < this.shape; i++) {
            sumSquares += this.data[i] * this.data[i];
        }

        return Math.sqrt(sumSquares);
    }

    norm() {
        this.div(this.mag());
    }

    mult(scalar) {
        if (isNaN(scalar)) {
            throw "Multiplier is not a scalar";
        }

        for (let i = 0; i < this.shape; i++) {
            this.data[i] *= scalar;
        }
    }

    div(scalar) {
        if (isNaN(scalar)) {
            throw "Divisor is not a scalar";
        }

        for (let i = 0; i < this.shape; i++) {
            this.data[i] /= scalar;
        }
    }
}

function isPointInRect(x, y, w, h, px, py) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
}

function inBoundingBox(x1,y1,x2,y2,px,py){
    // check if point is inside bounding box
    if(px >=x1 && px <= x2 && py >=y1 && py <= y2 ){
        return true;
    }
    else{
        return false;
    }
}

function randInt(min, max) {
  return Math.floor(min + Math.random() * Math.floor(max-min));
}
