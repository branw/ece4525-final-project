class MarioNESGame extends Microgame {
    border = 'tv';
    state = "direction";
    start = Date.now();
    total spin = 0;
    constructor(){
        super();
    }

    update(delta) {
        if(Date.now() - start > 300){
            state = "play";
        }
    }   

    draw() {
        p.background(120, 0, 0);

        if(state === "direction"){
            p.pushMatrix();
            p.translate(50,100);
            returnText("SPIN!"); //ABCDEFGHIJKLMNOPQRSTUV
            p.popMatrix();
            p.pushMatrix();
            p.translate(150,120);
            p.image(SPRITES.text.get(673,215, 28,20),0,0);
            p.popMatrix();

        }
        else if(state === "play"){

        }
        else if(state === "lose"){

        }
        else if(state === "win"){

        }

        
    }
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
