class BananaMunch extends Microgame {
    border = 'mustard';
    timerace = false;

    state = 'intro';
    elapsed = 0;
    total_spin = 0;

    arrow_blink = 1;
    arrow_timer = 0;

    banana_timer = 0;

    current = '';
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

    lastChangeTime = 0;

    update(delta) {
        this.elapsed += delta;

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

            const keypressOrder = ["left", "down", "right", "up"];
            const keyDown = this.game.keys['down'] ? 'down' :
                            this.game.keys['up'] ? 'up' :
                            this.game.keys['left'] ? 'left' :
                            this.game.keys['right'] ? 'right' : '';
            const nextKeyDown = keypressOrder[
                (keypressOrder.indexOf(this.current) + 1) % 4];

            let changed = 0;
            if ((this.current === '' && keyDown !== '') ||
                    (this.current !== '' && keyDown === nextKeyDown)) {
                this.current = keyDown;
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

                console.log(this.banana_count)

                if (this.banana_count == 6 || this.banana_count == 13) {
                    this.lastChangeTime = this.elapsed;
                }
            }

            // Check for win
            if (this.banana_count > 18){
                this.state = 'won';
                this.blink = 300;
                this.curFrame++;
            }

            break;

        case 'won':
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

                if (this.lastChangeTime > 0 && 
                        this.elapsed - this.lastChangeTime < 500) {
                    p.pushMatrix();
                    p.translate(100, 80);
                    warioText("KEEP SPINNING!");
                    p.popMatrix();
                }
                
                break;

            case 'won':
                p.pushMatrix();
                p.translate(220 + this.win_text_off,60);
                warioText("YUMMY!");
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

                if(this.arrow_blink > 0){
                    p.pushMatrix();
                    p.translate(230, 70);
                    imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);
                    p.popMatrix();
                }

                break;
        }
    }
}
