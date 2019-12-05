function drawFrame(img, frame, x=0, y=0) {
    const offset = frame[0];
    const size = frame[1];
    const pos = (frame.length === 3) ? frame[2] : [0, 0];
    p.image(img.get(offset[0], offset[1], size[0], size[1]), x + pos[0], y + pos[1]);
}

// https://www.youtube.com/watch?v=1hjpHGabOaw

class Shake extends Microgame {
    border = 'none';

    state = 'intro';

    elapsed = 0;

    pawDown = false;

    pawsJump;
    handsFixed;

    pawPosX;
    pawPosY;
    handPos;
    offset;

    finalAnimationStart = 0;

    constructor() {
        super();

        this.pawsJump = Math.random() <= 0.50;
        this.handsFixed = Math.random() <= 0.50;

        this.offset = Math.PI * Math.random();    

        this.pawPosX = 200 * Math.sin(1000/400 + this.offset) + 300;
        this.pawPosY = 300;
        this.handPos = -200 * Math.sin(1000/450 + this.offset) + 300;
    }

    update(delta) {
        this.elapsed += delta;

        switch (this.state) {
        case 'intro':
            if (this.elapsed > 1000) {
                this.state = 'playing';
            }

            break;

        case 'playing':
            this.pawPosX = 200 * Math.sin(this.elapsed/400 + this.offset) + 300;

            if (!this.handsFixed) {
                this.handPos = -200 * Math.sin(this.elapsed/450 + this.offset) + 300;
            }

            if (this.pawsJump) {
                this.pawPosY = 300 + 30 * Math.sin(this.elapsed/100);
            }

            if (this.game.keys['space']) {
                this.pawDown = true;

                this.finalAnimationStart = this.elapsed;

                if (Math.abs(this.pawPosX - this.handPos) < 50) {
                    this.state = 'won';
                }
                else {
                    this.state = 'lost';
                }
            }

            break;
        }

        return this.state;
    }

    draw() {
        setBorderBg(72, 192, 8);
        p.background(255, 255, 255);
        p.image(SPRITES['shake']['border'], 0, 0, 600, 400);

        // Draw dog
        const dog = {
            'waiting': [
                [[0, 0], [245, 282]],
                [[285, 0], [245, 282]],
            ],
            'happy': [
                [[0, 0], [245, 282]],
                [[547, 0], [245, 282]],
                [[809, 0], [245, 282]],
                [[1069, 0], [245, 282]],
            ],
            'sad': [
                [[1325, 0], [245, 282]],
                [[1577, 0], [245, 282]],
            ],
        };

        let frame, frameNum;
        switch (this.state) {
        case 'intro':
        case 'playing':
            frame = 'waiting';
            frameNum = Math.floor(this.elapsed / 200) % 2;
            break;

        case 'won':
            frame = 'happy';
            frameNum = Math.min(Math.floor((this.elapsed - this.finalAnimationStart) / 400), 3);
            break;

        case 'lost':
            frame = 'sad';
            frameNum = Math.floor(this.elapsed / 300) % 2;
            break;
        }
        drawFrame(SPRITES['shake']['sheet'], dog[frame][frameNum], 200, 18);

        // Draw hand
        const hand = [[7, 312], [145, 145], [-145/2, -145/2]];
        drawFrame(SPRITES['shake']['sheet'], hand, this.handPos, 350);

        // Draw paw
        const paw = [[185, 340], [80, 117], [-80/2, -117/2]];
        drawFrame(SPRITES['shake']['sheet'], paw, this.pawPosX, this.pawDown ? 320 : this.pawPosY);

        // Draw instruction message
        if (this.state === 'intro') {
            p.pushMatrix();
            p.translate(140, 100);
            p.scale(2);
            warioText("Shake!");
            p.popMatrix();

            // Show spacebar icon
            if (Math.floor(this.elapsed / 150) % 2 == 0) {
                p.pushMatrix();
                p.translate(265, 200);
                p.scale(3);
                p.image(SPRITES.text.get(736, 222, 28, 12), 0, 0);
                p.popMatrix();
            }
        }
        else {
            p.fill(0, 0, 0);
            p.textSize(18);
            p.textAlign(p.LEFT);
            p.text('A dog lover can only love his dog; A dog trainer can love and train\n\nRichard A. Wolters', 50, 50, 160, 200);
        }
    }
}
