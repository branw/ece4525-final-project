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

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

class LostState extends State {
    elapsed = 0;
    frames = [
        { // sad 0
            "start": [0, 1164],
            "size": [240, 160],
            "offset": [-14, 0]
        },
        { // neutral 1
            "start": [0, 996],
            "size": [240, 160],
            "offset": [0, 0]    
        },
        { // happy 2 
            "start": [246, 996],
            "size": [240, 160],
            "offset": [0, 0]
        },
        { // keyboard1 3 
            "start": [597, 343],
            "size": [88, 79],
            "offset": [0, 0]
        },
        { // keyboard 4
            "start": [597, 430],
            "size": [88, 79],
            "offset": [0, 0]
        },
        { // border 5
            "start": [0, 0],
            "size": [600, 400],
            "offset": [0, 0]
        }

    ];

    mainWarioTimer = 0;
    mainWarioFrame = 0;

    keyboardWarioTimer = 0;
    keyboardWarioFrame = 0;
    update(delta) {
        this.elapsed += delta;

        if(this.elapsed - this.mainWarioTimer > 300){
            this.mainWarioFrame = !this.mainWarioFrame;
            this.mainWarioTimer = this.elapsed;
        }
        if(this.elapsed - this.keyboardWarioTimer > 150){
            this.keyboardWarioFrame = !this.keyboardWarioFrame;
            this.keyboardWarioTimer = this.elapsed;
        }




    }

    draw() {
        p.background(255, 175, 0);

        imageFrame(SPRITES.borders.tv, this.frames[5]);
        //imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);

        p.pushMatrix();
        p.translate(210,220);
        imageFrame(SPRITES.general, this.frames[this.mainWarioFrame ? 0 : 1]);
        p.popMatrix();

        p.pushMatrix();
        p.translate(30,240);
        p.scale(1.5);
        imageFrame(SPRITES.general, this.frames[this.keyboardWarioFrame ? 3 : 4]);
        p.popMatrix();

        p.pushMatrix();
        p.translate(570,240);
        p.scale(-1.5, 1.5);
        imageFrame(SPRITES.general, this.frames[this.keyboardWarioFrame ? 3 : 4]);
        p.popMatrix();
        
        p.pushMatrix();
        p.translate(170,50);
        warioText("You Lost!");
        p.translate(-20, 50);
        warioText("Try Again!");
        p.popMatrix();
        

    }
}

class WinState extends State {
    elapsed = 0;
    frames = [
        { // sad 0
            "start": [0, 1164],
            "size": [240, 160],
            "offset": [-14, 0]
        },
        { // neutral 1
            "start": [0, 996],
            "size": [240, 160],
            "offset": [0, 0]    
        },
        { // happy 2 
            "start": [246, 996],
            "size": [240, 160],
            "offset": [0, 0]
        },
        { // keyboard1 3 
            "start": [597, 343],
            "size": [88, 79],
            "offset": [0, 0]
        },
        { // keyboard 4
            "start": [597, 430],
            "size": [88, 79],
            "offset": [0, 0]
        },
        { // border 5
            "start": [0, 0],
            "size": [600, 400],
            "offset": [0, 0]
        }

    ];

    jimmyFrames =[
        {
            "start": [0, 0],
            "size": [128, 220],
            "offset": [0, 0]
        },
        {
            "start": [126, 0],
            "size": [126, 210],
            "offset": [0, 0]
        },
        {
            "start": [253, 0],
            "size": [128, 210],
            "offset": [0, 0]
        }
    ];

    secondJimmyFrames = [
        {
            "start": [0, 212],
            "size": [126, 210],
            "offset": [0, 0]
        },
        {
            "start": [126, 212],
            "size": [126, 210],
            "offset": [0, 0]
        },
        {
            "start": [253, 212],
            "size": [126, 210],
            "offset": [0, 0]
        }

    ];

    mainWarioTimer = 0;
    mainWarioFrame = 0;

    keyboardWarioTimer = 0;
    keyboardWarioFrame = 0;
    curJimmyFrame = 0;

    jimmyTimer = 0;

    update(delta) {
        this.elapsed += delta;

        if(this.elapsed - this.mainWarioTimer > 300){
            this.mainWarioFrame = !this.mainWarioFrame;
            this.mainWarioTimer = this.elapsed;
        }
        if(this.elapsed - this.keyboardWarioTimer > 150){
            this.keyboardWarioFrame = !this.keyboardWarioFrame;
            this.keyboardWarioTimer = this.elapsed;
        }

        if(this.elapsed - this.jimmyTimer > 100){
            if(this.curJimmyFrame === this.jimmyFrames.length - 1){
                this.curJimmyFrame = 0;
            }
            else{
                this.curJimmyFrame++;
  
            }
            this.jimmyTimer = this.elapsed;
        }



    }

    draw() {
        p.background(0, 0, 255);

        imageFrame(SPRITES.borders.tv, this.frames[5]);
        //imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);

        p.pushMatrix();
        p.translate(210,220);
        imageFrame(SPRITES.general, this.frames[this.mainWarioFrame ? 1 : 2]);
        p.popMatrix();

        p.pushMatrix();
        p.translate(70,140);
        p.scale(1);
        imageFrame(SPRITES.jimmy, this.jimmyFrames[this.curJimmyFrame]);
        p.popMatrix();

        p.pushMatrix();
        p.translate(420,140);
        p.scale(1);
        imageFrame(SPRITES.jimmy, this.secondJimmyFrames[this.curJimmyFrame]);
        p.popMatrix();


        p.pushMatrix();
        p.translate(190,50);
        warioText("You Won!");
        p.translate(-120, 50);
        warioText("congratulations!");
        p.popMatrix();
        

    }
}

// Shows current stage number and health
class CounterState extends State {
    elapsed = 0;

    microgames;
    gameDuration;

    lastLives = -1;
    lastMicrogame;

    state = 'normal';
    speedup = false;

    constructor() {
        super();

        this.microgames = [...microgames];
        shuffle(this.microgames);
    }

    update(delta) {
        // Increment levels everytime we enter the counter screen
        if (this.elapsed === 0) {
            // Lost last game
            if (this.lastLives >= 0 && this.lastLives != this.game.lives) {
                // Out of lives
                if (this.game.lives == 0) {
                    this.state = 'lost';
                }
                // Still has lives left
                else {
                    this.state = 'hurt';
                }

                // Reinsert the lost microgame into the rotation
                const index = Math.min(3, this.microgames.length);
                this.microgames.splice(index, 0, this.lastMicrogame);

                console.log(this.game.lives + ' lives left');
            }
            // Just started or won last game
            else {
                this.state = 'normal';
                this.game.level++;
            }

            if (this.game.level >= 10) {
                this.state = 'won';
            }

            this.lastLives = this.game.lives;

            // Select level duration/difficulty
            const lastDuration = this.gameDuration;
            if (this.game.level === 10) {
                this.gameDuration = 3000;
            }
            else if (this.game.level >= 7) {
                this.gameDuration = 4500;
            }
            else if (this.game.level >= 3) {
                this.gameDuration = 5500;
            }
            else {
                this.gameDuration = 7000;
            }

            // Indicate that the next level will be quicker/harder
            this.speedup = (lastDuration != this.gameDuration);
        }

        this.elapsed += delta;

        // Move to game after 5 seconds
        if (this.state !== 'lost' && this.elapsed >= 2000) {
            // Take the next minigame
            const microgame = this.microgames.shift();

            // Recycle games when we run out
            if (this.microgames.length == 0) {
                this.microgames = [...microgames];
                shuffle(this.microgames);
            }

            console.log('Level ' + this.game.level + ' "' + microgame.name + '" for ' + this.gameDuration/1000 + ' s');

            // Reset the time elapsed in the counter
            this.elapsed = 0;

            // Create the minigame and curtain over it
            this.game.pushState(new MicrogameState(microgame, this.gameDuration));
            this.game.pushState(new CurtainState('open'));

            this.lastMicrogame = microgame;
        }

        if (this.state === 'hurt' && this.elapsed / 5 >= 127) {
            this.state = 'normal';
        }

        if (this.state === 'lost' && this.elapsed > 1000) {
            this.game.pushState(new LostState());
        }

        if (this.state === 'won' && this.elapsed > 1000) {
            this.game.pushState(new WonState());
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

        // Draw lives as VU meters
        const vuFrames = [
            [[0*80, 0], [80, 40]],
            [[1*80, 0], [80, 40]],
            [[2*80, 0], [80, 40]],
            [[3*80, 0], [80, 40]],
            [[4*80, 0], [80, 40]],
            [[5*80, 0], [80, 40]],
            [[6*80, 0], [80, 40]],
            [[7*80, 0], [80, 40]],
            [[8*80, 0], [80, 40]],
            [[9*80, 0], [80, 40]],
            [[10*80, 0], [80, 40]],
        ];

        const numFrames = vuFrames.length - 1;
        const frameNum = Math.min(8 + Math.floor(8 * Math.sin(this.elapsed/100)), numFrames);
        switch (this.game.lives) {
        case 4:
            drawFrame(SPRITES['vu'], vuFrames[frameNum], 30, 82);

        case 3:
            drawFrame(SPRITES['vu'], vuFrames[(frameNum + 2) % numFrames], 120, 82);

        case 2:
            drawFrame(SPRITES['vu'], vuFrames[(frameNum + 4) % numFrames], 400, 82);

        case 1:
            drawFrame(SPRITES['vu'], vuFrames[(frameNum + 6) % numFrames], 490, 82);
        }

        // Draw level count
        p.pushMatrix();
        p.translate(258, 184);
        p.scale(0.95);
        warioText(pad(this.game.level, 3));
        p.popMatrix();

        // Draw hurting/lost overlay
        if (this.elapsed > 0 && this.state === 'hurt') {
            p.fill(255, 0, 0, Math.max(0, 127 - this.elapsed / 5));
            p.rect(0, 0, 600, 400);
        }
        else if (this.elapsed > 0 && this.state === 'lost') {
            p.fill(255, 0, 0, Math.max(0, 127 + this.elapsed / 5));
            p.rect(0, 0, 600, 400);
        }
        else if (this.elapsed > 0 && this.state === 'won') {
            p.fill(0, 0, 255, Math.max(0, 127 + this.elapsed / 5));
            p.rect(0, 0, 600, 400);
        }
    }
}

// Shows game and transistions to/from it
class MicrogameState extends State {
    microgame;
    duration;

    elapsed = 0;

    finishedTime = 0;

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

        // Count down after an early win/lose
        if (this.finishedTime == 0 &&
                (status === 'won' || status === 'lost')) {
            this.finishedTime = this.elapsed;
        }

        // If the game timed out or finished long enough ago
        const timesUp = this.elapsed > this.duration;
        const finishedLongAgo = (this.finishedTime > 0) && 
            (this.elapsed - this.finishedTime) > 2000;
        if (timesUp || finishedLongAgo) {
            // Subtract lives, but leave handling the lives to CounterState
            const won = (status === 'won' ||
                (this.microgame.timerace && status !== 'lost'));
            if (!won) {
                this.game.lives--;
            }

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

        case 'olive':
            setBorderBg(104, 136, 101);
            p.image(SPRITES.borders.olive);
            break;

        case 'none':
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
