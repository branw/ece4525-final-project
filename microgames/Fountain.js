class particle{
    constructor(x,y){
        this.dir = randInt(0,2) ? -1 : 1;
        this.pos = new p.PVector(x,y);
        this.vel = new p.PVector( this.dir * randInt(1,5), -40); 
        this.accel = new p.Pvector(this.dir * -1 * 1, 10);
        this.frame = randInt(4,7);
    }

    update(){
        this.vel.add(this.accel);
        this.pos.add(this.vel);
    }
}


class Fountain extends Microgame{
    state = 'intro';

    tutorialTimer = 0;
    arrow_timer = 0;
    arrow_blink = 1;
    blink = 150;

    // water bidet pipe location
    fountainX = 300;
    fountainY = 325;

    wet_flowers = 3;


    particles = [];
    frames = [
    { // mouse red
        "start": [767,213],
        "size": [20, 25],
        "offset": [0, 0]
    },
    { // mouse white
        "start": [790,213],
        "size": [20, 25],
        "offset": [0, 0]
    },
    { // mouse fountain
        "start": [4,0],
        "size": [560, 28],
        "offset": [0, 0]    
    },
    { // flower
        "start": [3,42],
        "size": [34, 34],
        "offset": [0, 0]  
    },
    { // med particle 4
        "start": [51,56],
        "size": [12, 12],
        "offset": [0, 0]  
    },
    { // large particle 5
        "start": [73,55],
        "size": [18, 15],
        "offset": [0, 0]
    },
    { // small particle 6
        "start": [104,59],
        "size": [6, 6],
        "offset": [0, 0]
    }
    ]



    update(delta) {
        this.tutorialTimer += delta;
        this.arrow_timer += delta;
        if (this.arrow_timer > this.blink) {
            this.arrow_blink = !this.arrow_blink;
            this.arrow_timer = 0;
        }
        switch(this.state){
            case "init":
                for(let x=0; x < 100; x++){
                    particles.push({});
                }
                this.state = "intro";
                break;
            case "intro" :
                if(this.tutorialTimer > 900){
                    this.state = "play";
                }
                break;
            case "play" :
                if(p.mouseX > 50 && p.mouseX < 550){
                   this.fountainX = p.mouseX; 
                }

                if(this.wet_flowers === 0){
                    this.state = "win";
                }
                break;
            case "win" :
                // return win
                break;
            case "lose" : 
                // return loss
                break;
        }


    }


    draw() {    
        p.background(193,255,175);

        if(this.state === "intro"){
            p.pushMatrix();
            p.translate(this.fountainX, this.fountainY);
            imageFrame(SPRITES.fountain.sheet, this.frames[2] );
            p.popMatrix();

            p.pushMatrix();
            p.translate(70, 80);
            p.scale(1);
            warioText("WATER THE FLOWERS");
            p.popMatrix();

            p.pushMatrix();
            p.translate(265, 200);
            p.scale(3);
            imageFrame(SPRITES.text, this.frames[this.arrow_blink ? 0 : 1]); // background

            p.popMatrix();


        }
        else if(this.state === "play"){
            p.pushMatrix();
            p.translate(this.fountainX, this.fountainY);
            imageFrame(SPRITES.fountain.sheet, this.frames[2] );
            p.popMatrix();
        }
    }
}
