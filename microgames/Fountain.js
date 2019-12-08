class Particle {
    constructor(x, y){
        this.dir = randInt(0,2) ? -1 : 1;
        this.pos = new p.PVector(x,y);
        this.vel = new p.PVector(this.dir * randInt(1,50)/10, -randInt(40, 80)); 
        this.accel = new p.PVector(this.dir * -1 * 1, 10);
        this.frame = randInt(4,7);
    }

    update(delta) {
        this.vel.add(this.accel);
        this.pos.add(this.vel);

        return this.pos.y > 400;
    }
}

class Fountain extends Microgame{
    border = 'none';
    timerace = false;

    state = 'intro';

    tutorialTimer = 0;
    arrow_timer = 0;
    arrow_blink = 1;
    blink = 150;

    // water bidet pipe location
    fountainX = 300;
    fountainY = 325;

    particles = [];

    flowers = [];

    FLOWER_THRESHOLD = 500;

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
        "offset": [-34/2, -34/2]  
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
    ];

    constructor() {
        super();

        const numFlowers = randInt(2, 5);
        for (let i = 0; i < numFlowers; i++) {
            const x = randInt(100, 500);
            const y = randInt(100, 200);

            this.flowers.push([x, y, 0]);
        }
    }

    update(delta) {
        this.tutorialTimer += delta;
        this.arrow_timer += delta;
        if (this.arrow_timer > this.blink) {
            this.arrow_blink = !this.arrow_blink;
            this.arrow_timer = 0;
        }

        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].update(delta)) {
                this.particles.splice(i, 1);
            }
        }

        let numWatered = 0;
        for (let i = 0; i < this.flowers.length; i++) {
            if (this.flowers[i][2] > this.FLOWER_THRESHOLD) {
                this.flowers[i][2] += delta;
                numWatered++;
            }
        }

        if (numWatered == this.flowers.length) {
            this.state = 'won';
        }

        switch(this.state){
        case "intro" :
            if(this.tutorialTimer > 900){
                this.state = "play";
            }
            break;

        case "play" :
            if(p.mouseX > 50 && p.mouseX < 550){
               this.fountainX = p.mouseX; 
            }

            if (this.game.mouse['left']) {
                // Create droplets
                for (let i = 0; i < 3; i++) {
                   this.particles.push(new Particle(this.fountainX + 20, this.fountainY - 5));
                }

                // Increment watered time for flowers
                for (let i = 0; i < this.flowers.length; i++) {
                    if (Math.abs(this.fountainX + 20 - this.flowers[i][0]) < 20) {
                        this.flowers[i][2] += delta;
                    }
                }
            }

            break;

        case "won" :
            for (let i = 0; i < 3; i++) {
               this.particles.push(new Particle(this.fountainX + 20, this.fountainY - 5));
            }

            break;
        }

        return this.state;
    }


    draw() {    
        setBg(193,255,175);

        // Draw flowers
        for (let i = 0; i < this.flowers.length; i++) {
            p.pushMatrix();
            p.translate(this.flowers[i][0], this.flowers[i][1]);
            p.rotate(this.flowers[i][2]/100);
            if (this.flowers[i][2] > this.FLOWER_THRESHOLD) {
                p.scale(2);
            }
            imageFrame(SPRITES.fountain.sheet, this.frames[3]);
            p.popMatrix();
        }

        // Draw fountain
        p.pushMatrix();
        p.translate(this.fountainX, this.fountainY);
        imageFrame(SPRITES.fountain.sheet, this.frames[2] );
        p.popMatrix();

        // Draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            p.pushMatrix();
            p.translate(particle.pos.x, particle.pos.y);
            imageFrame(SPRITES.fountain.sheet, this.frames[particle.frame]);
            p.popMatrix();
        }

        // Draw instructions
        if(this.state === "intro"){
            p.pushMatrix();
            p.translate(this.fountainX, this.fountainY);
            imageFrame(SPRITES.fountain.sheet, this.frames[2] );
            p.popMatrix();

            p.pushMatrix();
            p.translate(70, 80);
            p.scale(1);
            warioText("Water!");
            p.popMatrix();

            p.pushMatrix();
            p.translate(265, 200);
            p.scale(3);
            imageFrame(SPRITES.text, this.frames[this.arrow_blink ? 0 : 1]); // background

            p.popMatrix();
        }
    }
}
