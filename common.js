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
            'tv': p.loadImage('./resources/border_tv.png')
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
        'text' : p.loadImage('./resources/text.png')
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
