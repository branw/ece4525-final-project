function drawFrame(img, frame, x=0, y=0) {
    const offset = frame[0];
    const size = frame[1];
    const pos = (frame.length === 3) ? frame[2] : [0, 0];
    p.image(img.get(offset[0], offset[1], size[0], size[1]), x + pos[0], y + pos[1]);
}

// https://www.youtube.com/watch?v=3PhioApN3K0

class WrongWayHighway extends Microgame {
    border = 'olive';
    timerace = true;

    state = 'intro';

    elapsed = 0;

    roadY = 0;
    markings = [];
    cars = [];

    carX = 300;

    skidToX;

    CAR_SPEED = 300;
    MOVE_SPEED = 500;

    constructor() {
        super();

        // Randomize starting position
        this.carX = 300 + (360 * Math.random() - 180);

        // Create enemy cars
        let lastInLane = [0, 0, 0, 0];
        const numCars = 10 + Math.floor(Math.random(), 3);
        for (let i = 0; i < numCars; i++) {
            const spriteNum = Math.floor(Math.random() * 3);

            const lane = Math.floor(Math.random() * 4);

            let carY = lastInLane[lane] + Math.floor(300 + 500 * Math.random());
            lastInLane[lane] = carY;

            // Ensure that there is a sufficient gap
            let numNearby = 0;
            for (let j = 0; j < 4; j++) {
                if (lane == j) continue;

                if (Math.abs(carY - lastInLane[j]) < 500) {
                    numNearby++;
                }
            }
            if (numNearby > 2) {
                carY += 600;
                lastInLane[lane] = carY;
            }

            this.cars.push({
                'sprite': spriteNum,
                'lane': lane,
                'y': carY,
            });
        }
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
            // Move road
            this.roadY += this.CAR_SPEED * (delta/1000);

            // Move and add lane markings
            let lastMarking = 9999;
            for (let i = 0; i < this.markings.length; i++) {
                this.markings[i] += this.CAR_SPEED * (delta/1000);

                if (this.markings[i] > 400) {
                    this.markings.splice(i, 1);
                }
                if (this.markings[i] < lastMarking) {
                    lastMarking = this.markings[i];
                }
            }
            if (lastMarking > 200) {
                this.markings.push(-100);
            }

            // Move car
            if (this.game.keys['left']) {
                this.carX -= this.MOVE_SPEED * (delta/1000);
            }
            else if (this.game.keys['right']) {
                this.carX += this.MOVE_SPEED * (delta/1000);
            }

            const minX = 60 + 70, maxX = 600 - 60 - 70;
            this.carX = Math.min(Math.max(this.carX, minX), maxX);

            // Check for collisions
            for (let i = 0; i < this.cars.length; i++) {
                const car = this.cars[i];
                const x = 150 + 100 * car.lane;
                const y = this.roadY - car.y;

                if (p.dist(this.carX, 300, x, y) < 60 && Math.abs(this.carX - x) < 45) {
                    this.state = 'lost';
                    this.skidToX = 
                        Math.max(Math.min(
                            (100 * (Math.random() >= 0.5 ? 1 : -1) + this.carX),
                            maxX), minX);
                    break;
                }
            }

            break;

        case 'lost':
            // Skid car
            if (this.carX != this.skidToX) {
                this.carX += (this.skidToX - this.carX > 0 ? 1 : -1) * 3;

                if (Math.abs(this.skidToX - this.carX) < 5) {
                    this.carX = this.skidToX;
                }
            }

            break;
        }
        
        return this.state;
    }

    draw() {
        // Draw road
        p.image(SPRITES['highway']['road'], 60, this.roadY % 637 - 637);
        p.image(SPRITES['highway']['road'], 60, this.roadY % 637);

        // Draw lane markings
        for (let i = 0; i < this.markings.length; i++) {
            const markingY = this.markings[i];
            p.image(SPRITES['highway']['sheet'].get(17, 227, 215, 110), 385/2, markingY);    
        }

        // Draw enemies
        const enemyFrames = [
            [[2, 362], [55, 118], [-55/2, -118/2]],
            [[67, 362], [55, 118], [-55/2, -118/2]],
            [[132, 362], [70, 162], [-70/2, -162/2]],
        ];

        for (let i = 0; i < this.cars.length; i++) {
            const car = this.cars[i];
            const x = 150 + 100 * car.lane;
            const y = this.roadY - car.y;
            drawFrame(SPRITES['highway']['sheet'], enemyFrames[car.sprite], x, y);
        }

        // Draw car
        const carFrames = {
            'good': [[1, 0], [56, 80], [-56/2, -80/2]],
            'skid': [[[67, 0], [41, 80], [-41/2, -80/2]],
                     [[112, 0], [40, 80], [-40/2, -80/2]]],
            'flip': [[162, 1], [55, 80], [-55/2, -80/2]],
        };

        let carFrame = carFrames['good'];
        if (this.state === 'lost') {
            if (this.carX != this.skidToX) {
                carFrame = carFrames['skid'][Math.floor(this.elapsed / 100) % 2];
            }
            else {
                carFrame = carFrames['flip'];
            }
        }
        drawFrame(SPRITES['highway']['sheet'], carFrame, this.carX, 300);

        // Draw instructions
        if (this.state === 'intro') {
            p.pushMatrix();
            p.translate(140, 100);
            p.scale(2);
            warioText("Dodge!");
            p.popMatrix();

            // Show arrow key icon
            if (Math.floor(this.elapsed / 150) % 2 == 0) {
                p.pushMatrix();
                p.translate(265, 200);
                p.scale(3);
                p.image(SPRITES.text.get(673, 215, 28, 20), 0, 0);
                p.popMatrix();
            }
        }
    }
}
