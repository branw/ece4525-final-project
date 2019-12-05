class Duck {
    pos;
    vel;

    xDirection;

    elapsed = 0;

    lastAnimationUpdate = 0;
    animationFrame = 0;

    hit = false;

    WIDTH = 88;
    HEIGHT = 57;
    PADDING = 20;

    constructor(x, y, xDirection, speed) {
        this.pos = new Vec(x, y);

        this.xDirection = xDirection;

        this.vel = new Vec(xDirection, -2);
        this.vel.norm();
        this.vel.mult(speed);
    }

    tryHitting(x, y) {
        if (this.hit) {
            return false;
        }

        const x1 = this.pos.x - this.WIDTH/2 - this.PADDING;
        const y1 = this.pos.y - this.HEIGHT/2 - this.PADDING;
        const x2 = this.pos.x + this.WIDTH/2 + this.PADDING;
        const y2 = this.pos.y + this.HEIGHT/2 + this.PADDING;

        if (inBoundingBox(x1, y1, x2, y2, x, y)) {
            this.hit = true;
            return true;
        }

        return false;
    }

    flewAway() {
        return !this.hit && this.pos.y >= -this.HEIGHT/2;
    }

    update(delta) {
        this.elapsed += delta;

        if (this.hit) {
            // Fall down
            const gravity = new Vec(0, 3);
            this.pos.add(gravity);
        }
        else {
            // Animate frames
            if (this.elapsed - this.lastAnimationUpdate > 100) {
                this.animationFrame++;
                this.lastAnimationUpdate = this.elapsed;
            }

            // Fly
            this.pos.add(this.vel);
        }
    }

    draw() {
        if (this.hit) {
            const frame = [[0, 78], [24, 59], [-24/2, -59/2]];

            drawFrame(SPRITES.duckHunt.sheet, frame, this.pos.x, this.pos.y);
        }
        else {
            const frames = [
                [[0, 0], [88, 57], [-88/2, -57/2]],
                [[100, 0], [88, 57], [-88/2, -57/2]],
                [[200, 0], [88, 57], [-88/2, -57/2]],
            ];

            p.pushMatrix();
            p.scale(this.xDirection, 1);
            drawFrame(SPRITES.duckHunt.sheet, frames[this.animationFrame % 3],
                this.xDirection * this.pos.x, this.pos.y);
            p.popMatrix();
        }
    }
}

function drawFrame(img, frame, x=0, y=0) {
    const offset = frame[0];
    const size = frame[1];
    const pos = (frame.length === 3) ? frame[2] : [0, 0];
    p.image(img.get(offset[0], offset[1], size[0], size[1]), x + pos[0], y + pos[1]);
}

class DuckHunt extends Microgame {
    border = 'tv';
    timerace = false;

    state = 'intro';

    elapsed = 0;

    lastMouseBlink = 0;
    showMouse = true;

    numDucks;
    ducks = [];
    numDucksRemaining;
    shotsRemaining;

    lastShot = -99999;

    lastAnimationUpdate = 0;
    tauntFrame = 0;

    lastDogUpdate = 0;
    dogY = 300;

    constructor() {
        super();

        // Randomize duck starting location and path
        
        this.numDucks = (Math.random() < 0.5) ? 1 : 2;
        for (let i = 0; i < this.numDucks; i++) {
            const x = 300, y = 300 + 20 * i;
            const xDirection = (Math.random() >= 0.5) ? 1 : -1;
            const speed = 2 + Math.random()*3;
            this.ducks.push(new Duck(x, y, xDirection, speed));
        }

        this.numDucksRemaining = this.shotsRemaining = this.numDucks;
    }

    update(delta) {
        this.elapsed += delta;

        switch (this.state) {
        case 'intro':
            if (this.elapsed - this.lastMouseBlink > 150) {
                this.showMouse = !this.showMouse;
                this.lastMouseBlink = this.elapsed;
            }

            if (this.elapsed > 1000) {
                this.state = 'playing';
            }

            break;

        case 'playing':
            // Fire a shot
            if (this.game.mouse['left'] && this.shotsRemaining > 0 &&
                    this.elapsed - this.lastShot > 300) {
                for (let i = 0; i < this.ducks.length; i++) {
                    if (this.ducks[i].tryHitting(p.mouseX, p.mouseY)) {
                        this.numDucksRemaining--;
                    }
                }

                this.shotsRemaining--;
                this.lastShot = this.elapsed;
            }
            
            // Count number of visible ducks
            let numVisibleDucks = 0;
            for (let i = 0; i < this.ducks.length; i++) {
                if (this.ducks[i].flewAway()) {
                    numVisibleDucks++;
                }
            }

            // Game is over once all shots are fired, all ducks are hit, or
            // all ducks are out of frame
            if (this.shotsRemaining === 0 || this.numDucksRemaining == 0 ||
                    numVisibleDucks === 0) {
                if (this.numDucksRemaining === 0) {
                    this.state = 'won';
                }
                else {
                    this.state = 'lost';
                }
            }

    case 'won':
    case 'lost':

            // Update ducks
            for (let i = 0; i < this.ducks.length; i++) {
                this.ducks[i].update();
            }

            // Slide dog up
            if (this.dogY > 170 && this.elapsed - this.lastDogUpdate > 40) {
                this.dogY -= 2;
                this.lastDogUpdate = this.elapsed;
            }

            // Make dog laugh
            if (this.elapsed - this.lastAnimationUpdate > 100) {
                this.tauntFrame++;
                this.lastAnimationUpdate = this.elapsed;
            }

            break;
        }

        return this.state;
    }

    draw() {
        // Draw sky background
        p.background(0x38, 0xb8, 0xf8);

        // Draw ducks
        for (let i = 0; i < this.ducks.length; i++) {
            this.ducks[i].draw();
        }

        switch (this.state) {
        case 'intro':
            // Draw foreground
            p.image(SPRITES.duckHunt.bg, 0, 0);

            // Draw instruction message
            p.pushMatrix();
            p.translate(140, 100);
            p.scale(2);
            warioText("Shoot!");
            p.popMatrix();

            // Show mouse icon
            if (this.showMouse) {
                p.pushMatrix();
                p.translate(265, 200);
                p.scale(3);
                p.image(SPRITES.text.get(673+64+28, 215, 25, 25), 0, 0);
                p.popMatrix();
            }

            break;

        case 'playing':
            // Draw foreground
            p.image(SPRITES.duckHunt.bg, 0, 0);

            // Draw crosshair
            if (this.shotsRemaining) {
                p.image(SPRITES.duckHunt.sheet.get(0, 268, 57, 57),
                    p.mouseX - 57/2, p.mouseY - 57/2);
            }
            else {
                p.image(SPRITES.duckHunt.sheet.get(70, 268, 57, 57),
                    p.mouseX - 57/2, p.mouseY - 57/2);
            }
            break;

        case 'won':
            const dogHolding = {
                1: [[0, 150], [92, 110], [-92/2, 0]],
                2: [[112, 150], [120, 110], [-120/2, 0]]
            }

            // Draw dog
            drawFrame(SPRITES.duckHunt.sheet, dogHolding[this.numDucks],
                300, this.dogY);

            // Draw foreground
            p.image(SPRITES.duckHunt.bg, 0, 0);

            break;

        case 'lost':
            const dogTaunting = [
                [[247, 150], [72, 110], [-72/2, 0]],
                [[330, 150], [72, 110], [-72/2, 0]]
            ];

            // Draw dog
            drawFrame(SPRITES.duckHunt.sheet, dogTaunting[this.tauntFrame % 2], 300, 170);

            // Draw foreground
            p.image(SPRITES.duckHunt.bg, 0, 0);

            break;
        }
    }
}
