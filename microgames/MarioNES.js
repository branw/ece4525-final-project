class MarioNESGame extends Microgame {
    border = 'tv';

    state = "direction";
    elapsed = 0;
    total_spin = 0;

    arrow_blink = 1;
    arrow_timer = 0;

    banana_timer = 0;

    SPIN_Y = 0;
    frames = [
        {"start" : [0,0],   "size" : [120, 290], "offset" : [0, 0]},
        {"start" : [120,0], "size" : [120, 290], "offset" : [15,0]},
        {"start" : [255,0], "size" : [120, 290], "offset" : [15, 0]},
        {"start" : [395,0], "size" : [170, 290], "offset" : [-10, 0]},
        {"start" : [560,0], "size" : [170, 290], "offset" : [-10, 0]},
        {"start" : [735,0],   "size" : [170, 290], "offset" : [-10, 0]},
        {"start" : [915,0],   "size" : [270, 290], "offset" : [-45, 0]}
    ]
    curFrame = 0;
    next_input = 0;

    update(delta) {
        this.elapsed += delta;
        if(this.elapsed > 800){
            this.state = "play";
        }
        if(this.elapsed - this.arrow_timer > 150){
            this.arrow_blink *= -1;
            this.arrow_timer = this.elapsed;
        }

    }   

    draw() {
        p.background(200, 160, 0);
        p.pushMatrix();
        p.translate(45,30);
        p.scale(1.05);
        p.image(SPRITES.m_banana.get(710,382, 480,318), 0,0); // background sprite
        p.popMatrix();
        if(this.state === "direction" || this.state === "play"){
            p.pushMatrix();
            p.translate(170 ,100 - this.SPIN_Y);
            p.scale(2);
            returnText("SPIN!"); //ABCDEFGHIJKLMNOPQRSTUV
            p.popMatrix();


            if(this.arrow_blink > 0  || this.state === "play"){
                p.pushMatrix();
                p.translate(265,200 + this.SPIN_Y);
                p.scale(3);
                p.image(SPRITES.text.get(673,215, 28,20), 0,0);
                p.popMatrix();  
            }

        if(this.state === "play"){
            if(this.SPIN_Y < 300){
                this.SPIN_Y += 10;  
            }

            if (this.game.keys['left'] && this.curFrame < this.frames.length) {
                p.pushMatrix();
                imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);
                p.popMatrix(); 
                this.curFrame++;  
            } 

            if(this.elapsed - this.banana_timer > 400){

                if(this.curFrame === this.frames.length - 1){
                    this.curFrame = 0;
                }
                else{
                    this.curFrame++;
                }
                this.banana_timer = this.elapsed; 

            } 
            p.pushMatrix();
            p.translate(230, 70);
            imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);
            p.popMatrix(); 

            
        }
              

        }
        else if(this.state === "lose"){

        }
        else if(this.state === "win"){

        }
    }
}

function imageFrame(s_image, iframe){
    p.image(s_image.get(iframe["start"][0], iframe["start"][1], iframe["size"][0], iframe["size"][1]),iframe["offset"][0], iframe["offset"][1] );
}

function returnText(str){
    const alphabet = [12,44,76,108,138,170,200,232,260,290,322,352,382,418,450,482,514,546,576,606,638,668,700,734,768,800,0];
    const specials = {
        // startX, startY, width, height
        '!': [794, 64, 18, 32]
    };

    let x = 0;

    str = str.toUpperCase();
    for(let i = 0; i < str.length; i++){
        // Whitespace
        if (str[i] === ' ') {
            x += 12;
        }
        // Special characters
        else if (specials.hasOwnProperty(str[i])) {
            const data = specials[str[i]];

            p.image(SPRITES.text.get(data[0], data[1], data[2], data[3]), x, -2);
            x += data[3]; 
        }
        // Alphabetic characters
        else if (str[i] != str[i].toLowerCase()) {
            const pos = str.charCodeAt(i) - 'A'.charCodeAt(0);
            const start = alphabet[pos];
            const width = alphabet[pos + 1] - start;

            p.image(SPRITES.text.get(start, 2, width, 30), x, 0);
            x += width;
        }        
    }

}
