class Chinook extends Microgame{
    state = 'intro';

    umbPos = 210;
    timerLimit = 50;
    flipTimer = 0;
    flip = 0;
    curCatPos = 300;
    curCatDir = (Math.round(Math.random())) ? -1 : 1;
    distance = 10;
    catFrame = -1;
    gaitChange = 0;
    catWet = 0;
    catWetTimer = 0;
    tutorialTimer = 0;
    arrow_timer = 0;
    arrow_blink = 1;
    blink = 150;

    frames = [
       { // walk 1
        "start": [0, 0],
        "size": [122, 58],
        "offset": [0, 0]
    },
    {
        "start": [122 , 0],
        "size": [122, 58],
        "offset": [0, 0]
    },
    {
        "start": [11 , 122],
        "size": [146, 64],
        "offset": [0, 0]   
    },
    {
        "start": [176 , 126],
        "size": [146, 64],
        "offset": [0, 0]       
    }
    ]


    playGame(delta){
        this.flipTimer += delta;
        this.catWetTimer += delta;
        
        if(this.catFrame !== 0){
            if (this.game.keys['right']) {
                if(this.umbPos < 420){
                    this.umbPos+=4;
                }

            } 
            else if (this.game.keys['left']) {
                if(this.umbPos > 10){
                    this.umbPos-=4;
                }
            }   
        }
        // keypresses


        if(this.flipTimer > 50){
            this.flipTimer = 0;
            this.flip  = !this.flip;
        }

        if(this.catWetTimer > 100){
            this.catWetTimer = 0;
            this.catWet = !this.catWet;
        }

        if(this.distance === 0){
            this.distance = randInt(15, 30);
            this.curCatDir *= -1;
        }
        else if(this.curCatPos < 30 && this.curCatPos > 0){
            this.distance = randInt(15, 30);
            this.curCatDir = 1;
        }
        else if(this.curCatPos > 478){
            this.distance = randInt(15, 30);
            this.curCatDir = -1;
        }

        if(this.gaitChange > 30){
            this.catFrame *= -1;
            this.gaitChange = 0;
        }
        
        this.curCatPos += this.curCatDir * 3;
        this.distance -= 3;
        this.gaitChange += 3;
        
    }

    tutorial(delta){
        this.arrow_timer += delta;
        if (this.arrow_timer > this.blink) {
            this.arrow_blink *= -1;
            this.arrow_timer = 0;
        }
    }
    update(delta) {
        this.tutorialTimer += delta;
        if(this.tutorialTimer > 900){
            this.playGame(delta);
        }
        else{
            this.tutorial(delta);
        }
    }


    draw() {    
        warioText("MOVE UMBRELLA!");

        p.background(248, 248, 160);



        p.pushMatrix();
        p.translate(this.curCatPos,50);
        p.scale(1.3);
        if(this.curCatDir === -1){
            p.scale(-1,1);
            if(this.catFrame === -1){
                p.translate(-40,0);
            }
            else{
                p.translate(-46,0);
            }
        }
        if(this.catFrame === -1){
            imageFrame(SPRITES.chinook.sheet, this.frames[0]);
        }
        else if(this.catFrame === 1){
            imageFrame(SPRITES.chinook.sheet, this.frames[1]);
        }
        else if(this.catFrame === 0){
            imageFrame(SPRITES.chinook.sheet, this.frames[this.catWet ? 2 : 3]);
        }
        p.popMatrix();


        p.pushMatrix();

        p.translate(this.umbPos, 280 );
        p.scale(1.5);
        imageFrame(SPRITES.chinook.sheet, this.frames[2]); // umbrella

        // make it go up and down
        p.popMatrix();


        if(this.tutorialTimer < 900){
            p.pushMatrix();
            p.translate(70, 80);
            p.scale(1);
            warioText("KEEP THE CAT DRY!");
            p.popMatrix();

            if (this.arrow_blink > 0) {
                p.pushMatrix();
                p.translate(265, 200);
                p.scale(3);
                p.image(SPRITES.text.get(673, 215, 28, 20), 0, 0);
                p.popMatrix();
            }
        }



    }
}
