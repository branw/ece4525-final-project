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
        'm_banana_bg' : p.loadImage('./resources/m_banana/banana_bg.png')
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
