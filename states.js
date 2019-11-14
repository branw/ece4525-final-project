class State {
    game;
    
    setGame(game) {
        this.game = game;
    }
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
                this.game.changeState(new OptionState());

            }
            // check start button pressed
            if (inBoundingBox(240,275,240+150,275+30, p.mouseX, p.mouseY)){
                this.started = true;
                this.transistionStart = millis();
            }
            // check if help button pressed
            if (inBoundingBox(410,275, 410+125, 275+30, p.mouseX, p.mouseY)){
                this.game.changeState(new HelpState());

            }
        }

        if (inBoundingBox(60,275,60+160,275+30, p.mouseX, p.mouseY)){
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

        setBg(0xb8, 0xb8, 0xb8);

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
            p.noStroke();
            p.fill(0,0,0,this.start_close_opq+=2);
            p.rect(30,30,540,340);
            const elapsed = millis() - this.transistionStart;

            if (this.start_close_opq >= 255 && elapsed > 2500) {
                this.game.changeState(new CounterState());
            }
        }
        else{
            this.transistionStart = millis();
        }

    }
}

class HelpState extends State{
    update(delta) {
    // check close button pressed
        if (this.game.mouse['left']) {
            if (inBoundingBox(449,77,449+22,77+ 25, p.mouseX, p.mouseY)){
                    console.log("exit button pressed");
                    this.game.changeState(new IntroState());
            }
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
        p.popMatrix();
        p.textSize(32);
        p.textAlign(p.CENTER);
        p.fill(0,0,0);
        p.text("Quick Help Guide", 300,110);
        p.textSize(16);
        p.text("Follow the instruction displayed during the \nstart of the minigame", 300, 160);
        p.text("Each minigame will either use:\nthe arrow keys, space bar, and/or the mouse", 300, 240);
        p.fill(255,255,255);
        p.textSize(15)
        p.text("WarioWare - Help Guide", 157, 59);
    }    
}

class OptionState extends State{
    wario_timer = 3000;
    offset = 0;
    update(delta) {
    // check close button pressed
        if (this.game.mouse['left']) {
            if (inBoundingBox(449,77,449+22,77+ 25, p.mouseX, p.mouseY)){
                    console.log("exit button pressed");
                    this.game.changeState(new IntroState());
            }
        }
        if(Date.now() - this.wario_timer > 300){
            if(this.offset == 0){
                this.offset = 245;
            }
            else{
                this.offset = 0;
            }
            this.wario_timer = Date.now();
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
        p.popMatrix();
        p.textSize(32);
        p.textAlign(p.CENTER);
        p.fill(0,0,0);
        p.text("Game Options", 300,110);
        p.textSize(16);
        p.text("No options available yet!", 300, 160);
        p.pushMatrix();
        p.translate(215,175);
        p.scale(.75);

        p.image(SPRITES.warioSheet.get(0,996,230,165), 0, 0);
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
        p.translate(30 ,30);
        p.scale(.90);
        p.image(SPRITES.left_boom, 0 - 400*boomboxRatio, 0);
        p.popMatrix();
        p.pushMatrix();
        p.scale(.90);
        p.translate(300 ,30);
        p.image(SPRITES.right_boom, 33 + 400*boomboxRatio, 3);
        p.popMatrix();
    }
}

// Shows current stage number and health
class CounterState extends State {
    level;
    
    elapsed = 0;

    constructor() {
        super();

        this.level = 0;
    }

    update(delta) {
        // Increment levels everytime we enter the counter screen
        if (this.elapsed === 0) {
            this.level++;
        }

        this.elapsed += delta;

        // Move to game after 5 seconds
        if (this.elapsed >= 2000) {
            const microgame = randomMicrogame();
            const duration = (5 + (5 - this.level/2)) * 1000;

            // Reset the time elapsed in the counter
            this.elapsed = 0;

            // Create the minigame and curtain over it
            this.game.pushState(new MicrogameState(microgame, duration));
            this.game.pushState(new CurtainState('open'));
        }
    }

    draw() {
        p.pushMatrix();
        p.translate(30 ,30);
        p.scale(.90);
        p.image(SPRITES.left_boom, 0, 0);
        p.popMatrix();

        p.pushMatrix();
        p.scale(.90);
        p.translate(300 ,30);
        p.image(SPRITES.right_boom, 33, 3);
        p.popMatrix();

        p.image(SPRITES.wario_border,0 ,0);
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

    update(delta) {
        this.elapsed += delta;

        // Time's up
        if (this.elapsed > this.duration) {
            this.game.changeState(new CurtainState('close'));
            return;
        }

        // Update microgame
        const status = this.microgame.update(delta);

        // Handle game over
        if (status === 'won') {
            // change state to winning screen

        } else if (status === 'lost') {
            // change state to losing screen
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

        case 'tv':
            setBorderBg(23, 23, 23);
            p.image(SPRITES.borders.tv);
            break;
        }

        const elapsedRatio = this.elapsed/this.duration;

        // Draw bomb and its fuse
        const trailIdx = Math.floor((0.99999999 - elapsedRatio)*SPRITES.bomb.trail.length);
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
