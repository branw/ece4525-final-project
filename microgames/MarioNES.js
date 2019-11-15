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
    constructor(){
        super();
    }

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
            //    const keyMapping = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

            // if(this.game.keys['left']){ // no access to the keys yet
            //     p.pushMatrix();
            //     imageFrame(SPRITES.m_banana, this.frames[this.curFrame]);
            //     p.popMatrix(); 
            //     this.curFrame++;  
            // } 
            if(this.elapsed - this.banana_timer > 400){ // no access to the keys yet

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

function returnText(character){
    // A =  12,2
    let curCursor = 0;
    let lookup = [12,44,76,108,138,170,200,232,260,290,322,352,382,418,450,482,514,546,576,606,638,668,700,734,768,800,0];
    let charWidth = 0;
    for(let i=0;i < character.length;i++){
        if(character[i] === "!"){
            p.image(SPRITES.text.get(794, 64, 18, 32) ,curCursor , -2);
            curCursor += 32; 
        }
        else{
            const offset =  character.charCodeAt(i) - "A".charCodeAt(0);
            if(character[i] === "M"){
                charWidth = 4
            }
            else{
                charWidth = 0;
            }
            if(character.charCodeAt(i) === 32){
                curCursor += 12;
            }
            else{
                p.image(SPRITES.text.get(lookup[offset], 2, 30 + charWidth, 30) ,curCursor , 0);
                curCursor += 32 + charWidth;    
            }
  
        }
        
    }

}
