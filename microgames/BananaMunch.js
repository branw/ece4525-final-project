class BananaMunch extends Microgame {
    border = 'mustard';

    state = 'intro';
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

        // Blink arrow keys
        if (this.elapsed - this.arrow_timer > this.blink) {
            this.arrow_blink *= -1;
            this.arrow_timer = this.elapsed;
        }

        switch (this.state) {
        case 'intro': 
            if (this.elapsed > 800) {
                this.state = "play";
            }

            break;

        case 'play':
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

            // Check for win
            if (this.banana_count > 18){
                this.state = "win";
                this.blink = 300;
            }

            break;

        case 'win':
            this.win_text_off += this.win_text_inc;
            if(Math.abs(this.win_text_off) === 20){
                this.win_text_inc *= -1;
            }
            break;
        }

        return this.state;
    }

    draw() {
        // Draw starry background
        p.image(SPRITES.m_banana_bg, 0, 0);

        switch (this.state) {
            case 'intro':
                p.pushMatrix();
                p.translate(170, 100 - this.SPIN_Y);
                p.scale(2);
                warioText("SPIN!");
                p.popMatrix();

                if (this.arrow_blink > 0) {
                    p.pushMatrix();
                    p.translate(265, 200 + this.SPIN_Y);
                    p.scale(3);
                    p.image(SPRITES.text.get(673, 215, 28, 20), 0, 0);
                    p.popMatrix();
                }

                break;

            case 'play':
                p.pushMatrix();
                p.translate(230, 70);
                imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);
                p.popMatrix();
                
                break;

            case 'win':
                p.pushMatrix();
                p.translate(220 + this.win_text_off,60);
                warioText("YOU WIN!");
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

                break;
        }
    }
}
