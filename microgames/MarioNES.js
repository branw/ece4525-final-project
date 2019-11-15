class MarioNESGame extends Microgame {
    border = 'tv';

    state = "direction";
    elapsed = 0;
    total_spin = 0;

    arrow_blink = 1;
    arrow_timer = 0;

    banana_timer = 0;

    keypress_order = ["left", "down", "right", "up"];
    current = "up";
    banana_count = 0;
    SPIN_Y = 0;
    win_banana_rot = 0;
    win_text_off = 0;
    win_text_inc = 1;
    blink = 150;
    frames = [{
            "start": [0, 0],
            "size": [120, 290],
            "offset": [0, 0]
        },
        {
            "start": [120, 0],
            "size": [120, 290],
            "offset": [15, 0]
        },
        {
            "start": [255, 0],
            "size": [120, 290],
            "offset": [15, 0]
        },
        {
            "start": [395, 0],
            "size": [170, 290],
            "offset": [-10, 0]
        },
        {
            "start": [560, 0],
            "size": [170, 290],
            "offset": [-10, 0]
        },
        {
            "start": [735, 0],
            "size": [170, 290],
            "offset": [-10, 0]
        },
        {
            "start": [915, 0],
            "size": [270, 290],
            "offset": [-45, 0]
        }
    ]
    curFrame = 0;
    next_input = 0;

    update(delta) {
        this.elapsed += delta;
        if (this.elapsed > 800) {
            this.state = "play";
        }
        if (this.elapsed - this.arrow_timer > this.blink) {
            this.arrow_blink *= -1;
            this.arrow_timer = this.elapsed;
        }

        if (this.state === "play") {
            if (this.SPIN_Y < 300) {
                this.SPIN_Y += 10;
            }

            let changed = 0;
            if (this.current === "left" && this.game.keys['down']) {
                this.current = "down";
                changed++;
            } else if (this.current === "down" && this.game.keys['right']) {
                this.current = "right";
                changed++;
            } else if (this.current === "right" && this.game.keys['up']) {
                this.current = "up";
                changed++;
            } else if (this.current === "up" && this.game.keys['left']) {
                this.current = "left";
                changed++;
            }

            if (changed) {
                this.banana_count++;
                if (this.curFrame === this.frames.length - 1) {
                    this.curFrame = 0;
                } else {
                    this.curFrame++;
                }
                changed = 0;
            }
        }

        if(this.banana_count > 18){
            this.state = "win";
            this.blink = 300;
        }
        if(this.state === "win"){
            this.win_text_off += this.win_text_inc;
            if(Math.abs(this.win_text_off) === 20){
                this.win_text_inc *= -1;
            }
        }
    }

    draw() {
        p.background(200, 160, 0); // gay yello
        p.pushMatrix();
        p.translate(45, 30);
        p.scale(1.05);
        p.image(SPRITES.m_banana.get(710, 382, 480, 318), 0, 0); // background sprite
        p.popMatrix();
        if (this.state === "direction" || this.state === "play") {
            p.pushMatrix();
            p.translate(170, 100 - this.SPIN_Y);
            p.scale(2);
            returnText("SPIN!"); //ABCDEFGHIJKLMNOPQRSTUV
            p.popMatrix();


            if (this.arrow_blink > 0 || this.state === "play") {
                p.pushMatrix();
                p.translate(265, 200 + this.SPIN_Y);
                p.scale(3);
                p.image(SPRITES.text.get(673, 215, 28, 20), 0, 0);
                p.popMatrix();
            }
            if(this.state === "play"){
                p.pushMatrix();
                p.translate(230, 70);
                imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);
                p.popMatrix();
            }
        } else if (this.state === "lose") {

        } else if (this.state === "win") {
            p.pushMatrix();
            p.translate(220 + this.win_text_off,60);
            returnText("YOU WIN!");
            p.popMatrix();
            this.win_banana_rot += 3.14/180;
            if(this.arrow_blink > 0){

                p.pushMatrix();
                p.translate(230, 70);
                imageFrame(SPRITES.m_banana, this.frames[6]);
                p.popMatrix();    
            }
            p.imageMode(p.CENTER);

            p.pushMatrix();
            p.translate(150,100);
            p.scale(.5);
            p.rotate(this.win_banana_rot + 3.14* (1/4));
            imageFrame(SPRITES.m_banana, this.frames[0]);
            p.popMatrix();

            p.pushMatrix();
            p.translate(450,120);
            p.scale(.5);
            p.rotate(this.win_banana_rot + 3.14* (2/4));
            imageFrame(SPRITES.m_banana, this.frames[0]);
            p.popMatrix();

            p.pushMatrix();
            p.translate(320,170);
            p.scale(.5);
            p.rotate(this.win_banana_rot + 3.14* (3/4));
            imageFrame(SPRITES.m_banana, this.frames[0]);
            p.popMatrix();

            p.pushMatrix();
            p.translate(150,250);
            p.scale(.5);
            p.rotate(this.win_banana_rot);
            imageFrame(SPRITES.m_banana, this.frames[0]);
            p.popMatrix();
            p.imageMode(p.CORNER);


        }
    }
}

function imageFrame(s_image, iframe) {
    p.image(s_image.get(iframe["start"][0], iframe["start"][1], iframe["size"][0], iframe["size"][1]), iframe["offset"][0], iframe["offset"][1]);
}

function returnText(str) {
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