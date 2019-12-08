class Chinook extends Microgame {
    border = 'none';
    timerace = false;

    state = 'intro';

    truckPos = 210;
    timerLimit = 50;
    flipTimer = 0;
    flip = 0;
    curChinookPos = 300;
    curChinookDir = (Math.round(Math.random())) ? -1 : 1;
    boxDir = this.curChinookDir;
    distance = 10;
    chinookFrame = -1;
    gaitChange = 0;
    catWet = 0;
    decentTimer = 0;
    tutorialTimer = 0;
    arrow_timer = 0;
    arrow_blink = 1;
    blink = 150;
    boxHeight = 60;
    boxPos = 50;
    dropped = 0; 

    truckTimer = 0;
    truckFrame = 1;

    dropTimer = 0;
    randomDrop = randInt(450, 600);

    landed = 0

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
        "start": [176 , 122],
        "size": [146, 64],
        "offset": [0, 0]       
    },
    { // box
        "start": [244 , 26],
        "size": [64, 32],
        "offset": [0, 0]       
    }
    ];

    playGame(delta){
        this.flipTimer += delta;
        this.decentTimer += delta;
        this.truckTimer += delta;
        this.dropTimer += delta;

        if(this.chinookFrame !== 0 && this.landed === 0){
            if (this.game.keys['right']) {
                if(this.truckPos < 420){
                    this.truckPos+=4;
                }

            } 
            else if (this.game.keys['left']) {
                if(this.truckPos > 10){
                    this.truckPos-=4;
                }
            }   
        }
        // keypresses


        if(this.flipTimer > 50){
            this.flipTimer = 0;
            this.flip  = !this.flip;
        }

        if(this.decentTimer > 10 && this.dropped){
            this.decentTimer = 0;

            // p.rect(this.truckPos, 280, 70, 80);
            // p.rect(this.truckPos + 70, 320, 145, 30);
            if((this.boxHeight >=  240 && this.boxHeight <= 275) && this.boxPos >= this.truckPos && this.boxPos <= this.truckPos + 146){
                this.landed = 1;
            }
            else{
                if(!this.landed){
                    this.boxHeight += 3;
                }
            }
        }

        if(!this.landed && this.boxHeight > 275){
            this.state = 'lost';
        }

        if(!this.dropped){
            this.boxDir = this.curChinookDir
        }

        if(this.distance === 0 ){
            this.distance = randInt(15, 30);
            this.curChinookDir *= -1;
        }
        else if(this.curChinookPos < 30 && this.curChinookPos > 0){
            this.distance = randInt(15, 30);
            this.curChinookDir = 1;
        }
        else if(this.curChinookPos > 478){
            this.distance = randInt(15, 30);
            this.curChinookDir = -1;
        }

        if(this.gaitChange > 10){
            this.chinookFrame *= -1;
            this.gaitChange = 0;
            if(this.landed){
                this.truckPos -= 10;
                this.boxPos -= 10;

                this.state = 'won';
            }
        }

        if(this.truckTimer > 100){
            this.truckFrame *= -1;
            this.truckTimer = 0;

        }

        if(this.dropTimer > this.randomDrop){
            this.dropped = 1;
        }
        
        this.curChinookPos += this.curChinookDir * 3;
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
        switch (this.state) {
        case 'intro':
            this.tutorial(delta);

            if (this.tutorialTimer > 900) {
                this.state = 'playing';
            }
            break;

        case 'won':
        case 'lost':
        case 'playing':
            this.playGame(delta);
            break;
        }

        return this.state;
    }


    draw() {    

        p.background(248, 248, 160);



        p.pushMatrix();
        p.translate(this.curChinookPos,50);
        p.scale(1.3);
        if(this.curChinookDir === -1){
            p.scale(-1,1);
            if(this.chinookFrame === -1){
                p.translate(-40,0);
            }
            else{
                p.translate(-40,0);
            }
        }
        if(this.chinookFrame === -1){
            imageFrame(SPRITES.chinook.sheet, this.frames[0]);
        }
        else if(this.chinookFrame === 1){
            imageFrame(SPRITES.chinook.sheet, this.frames[1]);
        }
        p.popMatrix();



        p.pushMatrix();
        this.boxPos = this.dropped ? this.boxPos : this.curChinookPos
        if(this.boxDir === -1){
            p.translate(this.boxPos - 60,this.boxHeight + 65);
        }
        else{
            p.translate(this.boxPos + 50,this.boxHeight + 65);
        }
        // p.stroke(255,0,0);
        // p.noFill();
        // p.rect(0,0, 64, 32);

        imageFrame(SPRITES.chinook.sheet, this.frames[4]); // umbrella
        p.popMatrix();


        p.stroke(255,0,0);
        p.noFill();
        // p.rect(this.truckPos, 280, 70, 80);

        // p.rect(this.truckPos + 70, 320, 145, 30);

        p.pushMatrix();

        p.translate(this.truckPos, 280 );
        p.scale(1.5);
        if(this.truckFrame === -1){
            imageFrame(SPRITES.chinook.sheet, this.frames[2]); // truck

        }
        else{
            imageFrame(SPRITES.chinook.sheet, this.frames[3]); // truck

        }
        // make it go up and down
        p.popMatrix();


        if(this.tutorialTimer < 900){
            p.pushMatrix();
            p.translate(70, 80);
            p.scale(1);
            warioText("CATCH THE PAYLOAD!");
   
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
