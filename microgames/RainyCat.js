class RainyCat extends Microgame{
    state = 'intro';

    umbPos = 210;

    flipTimer = 0;
    flip = 0;
    frames = [
    { // walk 1
        "start": [80,58],
        "size": [40, 44],
        "offset": [0, 0]
    },
    { // walk 2
        "start": [80,58],
        "size": [40, 44],
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


    update(delta) {
        if (this.game.keys['right']) {
            this.umbPos+=4;
        } 
        else if (this.game.keys['left']) {
            this.umbPos-=4;
        } 
        this.flipTimer += delta;

        if(this.flipTimer > 100){
            this.flipTimer = 0;
            this.flip  = !this.flip;
        }

    }


    draw() {    
        p.background(0, 0, 0);
        p.pushMatrix();
        p.scale(1.3);
        imageFrame(SPRITES.rainyCat.sheet, this.frames[6]); // background
        p.popMatrix();


        p.pushMatrix();
        //p.translate(this.umbPos + (this.flip === -1 ? 180 :  0), 0);
        p.translate(this.umbPos- 162*4,0);   

        p.scale(1.3, 1.3);
        for(var i = 0; i < 5;i++){
            p.translate(162, 0);
            imageFrame(SPRITES.rainyCat.sheet, this.frames[this.flip ? 4 : 7]); // rain
        }
        p.translate(162,120 );
        for(var i =0;i < 5; i++){
            p.translate(-162,0);
            if(i != 2){
                imageFrame(SPRITES.rainyCat.sheet, this.frames[this.flip ? 4 : 7]); // rain
            }
        }
        p.popMatrix();





        p.pushMatrix();

        p.translate(this.umbPos, 100 );
        p.scale(1.5);
        imageFrame(SPRITES.rainyCat.sheet, this.frames[5]); // umbrella
        p.popMatrix();
    }
}
