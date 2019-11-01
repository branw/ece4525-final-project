class State {
    game;
    wario_border = p.loadImage("./resources/wario_border.png");
    wario_background = p.loadImage("./resources/wario_background.png");
    wario_logo = p.loadImage("./resources/warioware_logo.png");
    left_boom = p.loadImage("./resources/leftboom.png");
    right_boom = p.loadImage("./resources/rightboom.png");
    inner_window = p.loadImage("./resources/inner_window.png");
    warioSheet = p.loadImage("./resources/wario_sheet.gif")
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

    start_button = p.loadImage("./resources/start_button.png");
    help_button = p.loadImage("./resources/help_button.png");
    option_button = p.loadImage("./resources/option_button.png")

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
                this.transistionStart = Date.now();
            }
            // check if help button pressed
            if (inBoundingBox(410,275, 410+125, 275+30, p.mouseX, p.mouseY)){
                this.game.changeState(new HelpState());

            }
        }

        if (inBoundingBox(60,275,60+160,275+30, p.mouseX, p.mouseY)){
            if(Date.now() - this.bounceTimer > this.bounce_speed){
                if(this.option_offset == 0){
                    this.option_offset = 5;
                }
                else{
                    this.option_offset = 0;
                }
                this.bounceTimer = Date.now();
            }
        }
        // check start button pressed
        else if (inBoundingBox(240,275,240+150,275+30, p.mouseX, p.mouseY)){
            if(Date.now() - this.bounceTimer > this.bounce_speed){
                if(this.start_offset == 0){
                    this.start_offset = 5;
                }
                else{
                    this.start_offset = 0;
                }
                this.bounceTimer = Date.now();
            }
        }
        // check if help button pressed
        else if (inBoundingBox(410,275, 410+125, 275+30, p.mouseX, p.mouseY)){
            if(Date.now() - this.bounceTimer > this.bounce_speed){
                if(this.help_offset == 0){
                    this.help_offset = 5;
                }
                else{
                    this.help_offset = 0;
                }
                this.bounceTimer = Date.now();
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
        //     if((Date.now() - this.danceTimer) > 300 || this.danceTimer == -1){
        //         this.danceTimer = Date.now();
        //         this.offset_wario_dance += 44; 
        //     }
        // }

        
        if((Date.now() - this.danceTimer) > 100 || this.danceTimer == -1){
            this.danceTimer = Date.now();
            this.offset_wario_dance += (44 * this.dir_wario_dance); 
            if(this.offset_wario_dance >= 4*44){
                this.dir_wario_dance = -1;
            }
            else if(this.offset_wario_dance <= 0 ){
                this.dir_wario_dance = 1;
            }
        }
        
    }
    draw(p) {
        //p.background(255, 255, 255);
        p.fill(255,255,255,0);
        p.rect(0,0,600-1,400-1);
        p.fill(0, 0, 0);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.image(this.wario_border,0 ,0);

        p.pushMatrix();
        p.translate(25,25);
        p.scale(1.25);
        p.image(this.wario_background,0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.scale(this.logo_size);
        p.image(this.wario_logo, 190/this.logo_size, 100/this.logo_size);
        p.popMatrix();

        p.pushMatrix();
        p.translate(65,275);
        p.scale(.5);
        p.image(this.option_button,0 , 0 - this.option_offset*2);
        p.image(this.start_button, 360, 0 - this.start_offset*2);
        p.image(this.help_button, 700,0 - this.help_offset*2);
        p.popMatrix();

        p.pushMatrix();
        p.translate(50,100);
        p.scale(3);
        p.image(this.warioSheet.get(212 + this.offset_wario_dance,827, 45, 50), 0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.translate(550,100);
        p.scale(-3,3);
        p.image(this.warioSheet.get(212 + this.offset_wario_dance,827, 45, 50), 0 ,0);
        p.popMatrix();

        if (this.started) {
            p.noStroke();
            p.fill(0,0,0,this.start_close_opq+=2);
            p.rect(30,30,540,340);
            const elapsed = Date.now() - this.transistionStart;

            if (this.start_close_opq >= 255 && elapsed > 2500) {
                this.game.changeState(new CounterState());
            }
        }
        else{
            this.transistionStart = Date.now();
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
    draw(p) {
        p.fill(255,255,255,0);
        p.rect(0,0,600-1,400-1);
        // p.fill(0, 0, 0);
        // p.textSize(13);
        // p.textAlign(p.CENTER);
        
        p.pushMatrix();
        p.translate(70,45);
        p.scale(1);
        p.image(this.inner_window,0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.translate(70,45);
        p.scale(.75);
        //p.image(this.wario_border,0 ,0);
        p.popMatrix();
        p.textSize(32);
        p.textAlign(p.CENTER);
        p.fill(0,0,0);
        p.text("Quick Help Guide", 300,110);
        p.textSize(16);
        p.text("Follow the instruction displayed during the \nstart of the minigame", 300, 160);
        p.text("Each minigame will either use:\nthe arrow keys, space bar, and/or the mouse", 300, 240);
    }    
}

class OptionState extends State{
    update(delta) {
    // check close button pressed
        if (this.game.mouse['left']) {
            if (inBoundingBox(449,77,449+22,77+ 25, p.mouseX, p.mouseY)){
                    console.log("exit button pressed");
                    this.game.changeState(new IntroState());
            }
        }
    }
    draw(p) {
        p.fill(255,255,255,0);
        p.rect(0,0,600-1,400-1);
        // p.fill(0, 0, 0);
        // p.textSize(13);
        // p.textAlign(p.CENTER);
        
        p.pushMatrix();
        p.translate(70,45);
        p.scale(1);
        p.image(this.inner_window,0 ,0);
        p.popMatrix();

        p.pushMatrix();
        p.translate(70,45);
        p.scale(.75);
        //p.image(this.wario_border,0 ,0);
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
        p.image(this.warioSheet.get(0,996,230,165), 0, 0);
        p.popMatrix();
    }    

}
// Shows current stage number and health
class CounterState extends State {
    level;
    levelStart;
    start_open_opq = 255;
    constructor() {
        super();

        this.level = 0;
        this.levelStart = Date.now();
    }

    update(delta) {
        const elapsed = Date.now() - this.levelStart;

        // Move to game after 5 seconds
        if (elapsed >= 2800) {
            const microgame = randomMicrogame();
            const duration = 5 + (5 - this.level/2);

            this.game.pushState(new MicrogameState(microgame, duration));
        }
    }

    draw(p) {

        const elapsed = Date.now() - this.levelStart;

        //p.rect(0,0,600-1,400-1);
        p.background(0,0,255);

        let curtainRatio = 0;
        if (elapsed > 2000) {
            curtainRatio = (2000 - elapsed)/2;

        }
        else{
            curtainRatio = 0;

        }

        p.pushMatrix();
        p.translate(30 ,30);
        p.scale(.90);
        p.image(this.left_boom, 0 + curtainRatio, 0);
        p.popMatrix();
        p.pushMatrix();
        p.scale(.90);
        p.translate(300 ,30);
        p.image(this.right_boom, 33 - curtainRatio, 3);
        p.popMatrix();
        p.image(this.wario_border,0 ,0);
        p.fill(0,0,0,this.start_open_opq -= 2);
        p.rect(30,30,540,340);
    }
}

// Shows game and transistions to/from it
class MicrogameState extends State {
    microgame;
    duration;
    startTime;

    playing = false;

    constructor(microgame, duration) {
        super();

        this.microgame = new microgame();
        this.duration = duration;

        this.startTime = Date.now();
    }

    update(delta) {
        // Time's up
        if (this.startTime + this.duration > Date.now()) {
            this.playing = false;
        }

        // Update microgame
        const status = this.microgame.update(delta);
        if (status === 'won') {
            // change state to winning screen

        } else if (status === 'lost') {
            // change state to losing screen
        }
    }

    draw(p) {
        // Draw game
        this.microgame.draw(p);

        p.fill(0, 0, 0);
        p.textSize(13);
        p.textAlign(p.CENTER);


        const elapsed = Date.now() - this.startTime;


    }
}
