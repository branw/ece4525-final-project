class State {
    game;
    
    setGame(game) {
        this.game = game;
    }
}

class IntroState extends State {
    started = false;
    transistionStart = 0;
    logo_size = .2;
    start_close_opq = 0;

    offset_wario_dance = 0;
    dir_wario_dance = 1;
    danceTimer = -1;

    bounceTimer = -1;
    option_offset = 0;
    start_offset = 0;
    help_offset = 0;
    bounce_speed = 100;

    update(delta) {
        if (this.game.mouse['left']) {
            // options button pressed

            if (inBoundingBox(60,275,60+160,275+30, p.mouseX, p.mouseY)){
                this.game.pushState(new OptionState());

            }
            // check start button pressed
            if (inBoundingBox(240,275,240+150,275+30, p.mouseX, p.mouseY)){
                this.started = true;
                this.transistionStart = millis();
            }
            // check if help button pressed
            if (inBoundingBox(410,275, 410+125, 275+30, p.mouseX, p.mouseY)){
                this.game.pushState(new HelpState());
            }
        }

        if (inBoundingBox(60,275,60+160,275+30, p.mouseX, p.mouseY)){
            setCursor(true);
            if(millis() - this.bounceTimer > this.bounce_speed){
                if(this.option_offset == 0){
                    this.option_offset = 5;
                }
                else{
                    this.option_offset = 0;
                }
                this.bounceTimer = millis();
            }
        }
        // check start button pressed
        else if (inBoundingBox(240,275,240+150,275+30, p.mouseX, p.mouseY)){
            setCursor(true);
            if(millis() - this.bounceTimer > this.bounce_speed){
                if(this.start_offset == 0){
                    this.start_offset = 5;
                }
                else{
                    this.start_offset = 0;
                }
                this.bounceTimer = millis();
            }
        }
        // check if help button pressed
        else if (inBoundingBox(410,275, 410+125, 275+30, p.mouseX, p.mouseY)){
            setCursor(true);
            if(millis() - this.bounceTimer > this.bounce_speed){
                if(this.help_offset == 0){
                    this.help_offset = 5;
                }
                else{
                    this.help_offset = 0;
                }
                this.bounceTimer = millis();
            }

        }
        else{
            setCursor(false);
            this.help_offset = 0;
            this.start_offset = 0;
            this.option_offset = 0;
        }

        // if(this.offset_wario_dance >= 200){
        //     this.offset_wario_dance = 0;
        // }
        // else{
        //     if((millis() - this.danceTimer) > 300 || this.danceTimer == -1){
        //         this.danceTimer = millis();
        //         this.offset_wario_dance += 44; 
        //     }
        // }

        
        if((millis() - this.danceTimer) > 100 || this.danceTimer == -1){
            this.danceTimer = millis();
            this.offset_wario_dance += (44 * this.dir_wario_dance); 
            if(this.offset_wario_dance >= 4*44){
                this.dir_wario_dance = -1;
            }
            else if(this.offset_wario_dance <= 0 ){
                this.dir_wario_dance = 1;
            }
        }
        
    }
    draw() {
        if (!areSpritesLoaded()) {
            return;
        }

        if (!this.started) {
            setBg(0xb8, 0xb8, 0xb8);
        }

        //p.background(255, 255, 255);
        p.fill(255,255,255,0);
        p.rect(0,0,600-1,400-1);
        p.fill(0, 0, 0);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.image(SPRITES.wario_border,0 ,0);

        p.pushMatrix();
        p.translate(25,25);
        p.scale(1.25);
        p.image(SPRITES.wario_background,0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.scale(this.logo_size);
        p.image(SPRITES.wario_logo, 190/this.logo_size, 100/this.logo_size);
        p.popMatrix();

        p.pushMatrix();
        p.translate(65,275);
        p.scale(.5);
        p.image(SPRITES.option_button,0 , 0 - this.option_offset*2);
        p.image(SPRITES.start_button, 360, 0 - this.start_offset*2);
        p.image(SPRITES.help_button, 700,0 - this.help_offset*2);
        p.popMatrix();

        p.pushMatrix();
        p.translate(50,100);
        p.scale(3);
        p.image(SPRITES.warioSheet.get(212 + this.offset_wario_dance,827, 45, 50), 0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.translate(550,100);
        p.scale(-3,3);
        p.image(SPRITES.warioSheet.get(212 + this.offset_wario_dance,827, 45, 50), 0 ,0);
        p.popMatrix();

        if (this.started) {
            setBorderBg(0, 0, 0);

            const elapsed = millis() - this.transistionStart;
            p.noStroke();
            p.fill(0, 0, 0, elapsed/800 * 255);
            p.rect(0, 0, 600, 400);//30,30,540,340);
            

            if (elapsed > 800) {
                setCursor(false);
                this.game.changeState(new CounterState());
            }
        }
    }
}

class HelpState extends State{
    elapsed = 0;
    blink_timer = 0;
    blink_dir = 1;

    update(delta) {
    // check close button pressed
        if (this.game.mouse['left']) {
            if (inBoundingBox(449,77,449+22,77+ 25, p.mouseX, p.mouseY)){
                    console.log("exit button pressed");
                    this.game.changeState(new IntroState());
            }
        }
        this.elapsed += delta;

        if(this.elapsed - this.blink_timer > 400){
            this.blink_dir  *= -1;
            this.blink_timer = this.elapsed; 
        }

    }
    draw() {
        p.pushMatrix();
        p.translate(70,45);
        p.scale(1);
        p.image(SPRITES.inner_window,0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.translate(70,45);
        p.scale(.75);
        //p.image(SPRITES.wario_border,0 ,0);
        let scale = .5;

        p.popMatrix();
        //p.textSize(32);
        p.textAlign(p.CENTER);
        p.fill(0,0,0);
        //p.text("Help Guide", 300,110);
        p.pushMatrix();
        p.translate(150,80);
        warioText("HELP GUIDE");
        p.popMatrix();
        p.textSize(16);
        p.text("Each game will have a one word instruction!\nIt is your responsiblilty to decipher\nand complete the minigame!", 290, 140);
        p.pushMatrix();
        p.translate(130,194);
        p.scale(scale);
        warioText("SPIN!");
        p.scale(1/scale);
        p.translate(110,0);
        p.scale(scale);
        warioText("SHOOT!");
        p.scale(1/scale);
        p.translate(120, 0);
        p.scale(scale);
        warioText("BOUNCE!");
        p.popMatrix();

        p.text("Each minigame will either use:\nthe arrow keys, space bar, and/or the mouse", 300, 240);

        let tx = 160;
        let ty = 235;
        p.pushMatrix();
        p.scale(1.2);
        if(this.blink_dir === 1){
            
            p.translate(tx,ty);
            p.image(SPRITES.text.get(448,214,28,20),0,0); // arrow - no
            p.translate(70,5);
            p.image(SPRITES.text.get(704,222,28,12),0,0); // space - no
            p.translate(70,-6);
            p.image(SPRITES.text.get(790,214,20,24),0,0); // mouse - no
        }
        else{
            p.translate(tx,ty);
            p.image(SPRITES.text.get(672,214,28,20),0,0); // arrow - or
            p.translate(70,5);
            p.image(SPRITES.text.get(736,222,28,12),0,0); // space - or
            p.translate(70,-6);
            p.image(SPRITES.text.get(767,214,20,24),0,0); // mouse - or
        }
            p.popMatrix();






        p.fill(255,255,255);
        p.textSize(15)
        p.text("WarioWare - Help Guide", 157, 59);
    }    
}

class OptionState extends State {
    update(delta) {
        // Handle exit button click
        if (isPointInRect(449,77,22,25, p.mouseX, p.mouseY)) {
            setCursor(true);
            if (this.game.mouse['left']) {
                this.game.popState();
            }    
        }
        
        // Handle difficulty selector click
        else if (isPointInRect(300, 158, 180, 25, p.mouseX, p.mouseY)) {
            setCursor(true);
            if (this.game.mouse['left']) {
                if (p.mouseX < 360) {
                    this.game.difficulty = 0;
                }
                else if (p.mouseX < 420) {
                    this.game.difficulty = 1;
                }
                else {
                    this.game.difficulty = 2;
                }
            }
        }
        else {
            setCursor(false);
        }
    }

    draw() {
        p.pushMatrix();
        p.translate(70,45);
        p.scale(1);
        p.image(SPRITES.inner_window,0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.scale(1.1);
        p.translate(160, 75);
        warioText('Options');
        p.popMatrix();

        p.pushMatrix();
        p.translate(100, 160);
        p.scale(0.6);
        warioText('Difficulty');
        p.popMatrix();

        // Select background
        p.stroke(0, 0, 0);
        p.fill(255, 255, 255);
        p.rect(300, 158, 180, 25);

        // Select active item
        const highlightOffset = this.game.difficulty * 60;
        p.fill(0xb0, 0xc8, 0xf8);
        p.rect(300 + highlightOffset, 158, 60, 25);

        // Select text
        p.pushMatrix();
        p.translate(305, 165);
        p.scale(0.4);
        warioText('Easy');
        p.popMatrix();
        p.pushMatrix();
        p.translate(365, 165);
        p.scale(0.4);
        warioText('Mild');
        p.popMatrix();
        p.pushMatrix();
        p.translate(425, 165);
        p.scale(0.4);
        warioText('Hard');
        p.popMatrix();
    }
}

class CurtainState extends State {
    duration;
    direction;

    startTime;

    constructor(direction, duration=800) {
        super();

        this.direction = direction;
        this.duration = duration;

        this.startTime = millis();
    }

    update(delta) {
        // Exit state when the animation is complete
        if (millis() - this.startTime > this.duration) {
            this.game.popState();
        }
    }

    draw() {
        const elapsed = millis() - this.startTime;
        const elapsedRatio = elapsed/this.duration;

        let boomboxRatio = 1 - elapsedRatio;
        if (this.direction === 'open') {
            boomboxRatio = elapsedRatio;

            this.game.previousState(this).draw();

            // Fade
            p.fill(0, 0, 0, (1 - elapsedRatio) * 255);
            p.rect(0, 0, 600, 400);
        }
        
        // Slide halves of boombox
        p.pushMatrix();
        p.image(SPRITES.left_boom, -400*boomboxRatio, 0);
        p.popMatrix();
        p.pushMatrix();
        p.translate(300, 0);
        p.image(SPRITES.right_boom, 400*boomboxRatio, 0);
        p.popMatrix();
    }
}

// Shows current stage number and health
class CounterState extends State {
    elapsed = 0;

    constructor() {
        super();
    }

    update(delta) {
        // Increment levels everytime we enter the counter screen
        if (this.elapsed === 0) {
            this.game.level++;
        }

        this.elapsed += delta;

        // Move to game after 5 seconds
        if (this.elapsed >= 2000) {
            const microgame = randomMicrogame();
            const duration = (5 + Math.max(4 - this.game.level/2, 0)) * 1000;
            console.log('Level ' + this.game.level + ' "' + microgame.name + '" for ' + duration/1000 + ' s');

            // Reset the time elapsed in the counter
            this.elapsed = 0;

            // Create the minigame and curtain over it
            this.game.pushState(new MicrogameState(microgame, duration));
            this.game.pushState(new CurtainState('open'));
        }
    }

    draw() {
        setBorderBg(0, 0, 0);

        p.pushMatrix();
        p.translate(0, 0);
        p.image(SPRITES.left_boom, 0, 0);
        p.popMatrix();

        p.pushMatrix();
        p.translate(300, 0);
        p.image(SPRITES.right_boom, 0, 0);
        p.popMatrix();
    }
}

// Shows game and transistions to/from it
class MicrogameState extends State {
    microgame;
    duration;

    elapsed = 0;

    constructor(microgame, duration) {
        super();

        this.microgame = new microgame();
        this.duration = duration;
    }

    setGame(game) {
        super.setGame(game);
        this.microgame.setGame(game);
    }

    update(delta) {
        // Update microgame
        const status = this.microgame.update(delta);
        
        // Count elapsed time when playing the game
        if (status !== 'intro') {
            this.elapsed += delta;
        }

        // If the game timed out or is over
        const timesUp = this.elapsed > this.duration;
        if (timesUp) {
            const won = (status === 'win');

            //TODO lives

            this.game.changeState(new CurtainState('close'));
        }
    }

    draw() {
        // Draw game
        this.microgame.draw();

        // Draw border
        switch (this.microgame.border) {
        case 'purple':
            setBorderBg(160, 80, 200);
            p.image(SPRITES.borders.purple);
            break;

        case 'mustard':
            setBorderBg(200, 160, 0);
            p.image(SPRITES.borders.mustard);
            break;

        case 'tv':
            setBorderBg(23, 23, 23);
            p.image(SPRITES.borders.tv);
            break;
        }

        const elapsedRatio = this.elapsed/this.duration;

        // Draw bomb and its fuse
        const trailIdx = Math.max(Math.floor((0.99999999 - elapsedRatio)*SPRITES.bomb.trail.length), 0);
        p.image(SPRITES.bomb.trail[trailIdx], 10, 400 - 40 - 5);

        // Draw flame on end of fuse
        const flameInterval = this.duration/50;
        const flameIdx = Math.floor(this.elapsed/flameInterval) % SPRITES.bomb.flame.length;
        const flameOffset = [
            [47, -35], [80, 0], [195, 0], [315, 0], [435, 0], [555, 0]
        ];
        p.image(SPRITES.bomb.flame[flameIdx],
            10 + flameOffset[trailIdx][0],
            400 - 40 - 5 + flameOffset[trailIdx][1]);
    }
}
