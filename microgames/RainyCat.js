class RainyCat extends Microgame{
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
        "start": [80,58],
        "size": [40, 44],
        "offset": [0, 0]
    },
    { // walk 2
        "start": [136,60],
        "size": [46, 40],
        "offset": [0, 0] 
    },
    { // wet 1
        "start": [193,56],
        "size": [47, 44],
        "offset": [0, 0] 
    },
    { // wet 2
        "start": [250,54],
        "size": [46, 46],
        "offset": [0, 0] 
    },    
    { // rain
        "start": [12,146],
        "size": [162, 123],
        "offset": [0, 0] 
    },
    { // umbrella
        "start": [314,0],
        "size": [126, 102],
        "offset": [0, 0]     
    },
    { // background
        "start": [236,146],
        "size": [464, 241],
        "offset": [0, 0]     
    },
    {
        "start": [9,279],
        "size": [162, 122],
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


        // check if it hit left boundary
        if((this.curCatPos + 30 < this.umbPos) || (this.curCatPos + 46 > this.umbPos + 185 + 20)){
            this.distance = -1;
            this.catFrame = 0;
            this.
            //this.curCatPos += this.curCatDir * 6;
        }// 185 is the width of the umbrella

        else{
            if(this.distance === 0){
                this.distance = randInt(15, 30);
                this.curCatDir *= -1;
            }
            else if(this.curCatPos < 30 && this.curCatPos > 0){
                this.distance = randInt(15, 30);
                this.curCatDir = 1;
            }
            else if(this.curCatPos > 540){
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

        p.background(0, 0, 0);

        p.pushMatrix();
        p.scale(1.3);
        imageFrame(SPRITES.rainyCat.sheet, this.frames[6]); // background
        p.popMatrix();


        p.pushMatrix();
		p.translate(this.curCatPos,255);
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
          	imageFrame(SPRITES.rainyCat.sheet, this.frames[0]);
        }
        else if(this.catFrame === 1){
          	imageFrame(SPRITES.rainyCat.sheet, this.frames[1]);
        }
        else if(this.catFrame === 0){
        	imageFrame(SPRITES.rainyCat.sheet, this.frames[this.catWet ? 2 : 3]);
        }
        p.popMatrix();


        p.pushMatrix();
        //p.translate(this.umbPos + (this.flip === -1 ? 180 :  0), 0);
        p.translate(this.umbPos- 162*4,0);   
        p.scale(1.3, 1.3);
        for(var i = 0; i < 5;i++){
            p.translate(162, 0);
            imageFrame(SPRITES.rainyCat.sheet, this.frames[this.flip ? 4 : 7]); // rain
        }
        p.translate(145,120);
        for(var i =0;i < 5; i++){
            p.translate(-155,0);
            if(i != 2){
                imageFrame(SPRITES.rainyCat.sheet, this.frames[this.flip ? 4 : 7]); // rain
            }
        }
        p.popMatrix();

        // // out of bounds boxes
        // p.strokeWeight(2);
        // p.stroke(255,0,0);
        // p.line(this.umbPos,0, this.umbPos, 300);
        // p.line(this.umbPos + 185,0, this.umbPos + 190, 300);

        // p.noFill();
        // p.rect(this.curCatPos, 255, 60,60);
        // p.noStroke();





        p.pushMatrix();

        p.translate(this.umbPos, 100 );
        p.scale(1.5);
        imageFrame(SPRITES.rainyCat.sheet, this.frames[5]); // umbrella
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
