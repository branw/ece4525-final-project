class State {
    game;

    setGame(game) {
        this.game = game;
    }
}

class IntroState extends State {
    started = false;
    transistionStart = 0;

    update(delta) {
        //console.log(this.game.mouse);
        if (this.game.mouse['left']) {
            this.started = true;
            this.transistionStart = Date.now();
        }
    }

    draw(p) {
        p.background(255, 255, 255);

        p.fill(0, 0, 0);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.text("intro", 100, 100);

        if (this.started) {
            const elapsed = Date.now() - this.transistionStart;

            p.text("started!", 100 + elapsed/3, 200);

            if (elapsed >= 1000) {
                this.game.changeState(new CounterState());
            }
        }
    }
}

// Shows current stage number and health
class CounterState extends State {
    level;
    levelStart;

    constructor() {
        super();

        this.level = 0;
        this.levelStart = Date.now();
    }

    update(delta) {
        const elapsed = Date.now() - this.levelStart;

        // Move to game after 5 seconds
        if (elapsed >= 5000) {
            const microgame = randomMicrogame();
            const duration = 5 + (5 - this.level/2);

            this.game.pushState(new MicrogameState(microgame, duration));
        }
    }

    draw(p) {
        p.background(255, 0, 0);

        p.textSize(13);
        p.textAlign(p.CENTER);
        p.text("counter", 100, 100);
    }
}

// Shows game and transistions to/from it
class MicrogameState extends State {
    microgame;
    duration;
    startTime;

    playing = false;

    constructor(microgame, duration) {
        super();

        this.microgame = new microgame();
        this.duration = duration;

        this.startTime = Date.now();
    }

    update(delta) {
        // Time's up
        if (this.startTime + this.duration > Date.now()) {
            this.playing = false;
        }

        // Update microgame
        const status = this.microgame.update(delta);
        if (status === 'won') {

        } else if (status === 'lost') {

        }
    }

    draw(p) {
        // Draw game
        this.microgame.draw(p);

        p.fill(0, 0, 0);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.text("game", 100, 100);

        // Draw overlay
        p.noStroke();
        p.fill(255, 255, 255);
        p.rect(0, 0, 600, 50);
        p.rect(0, 0, 50, 400);
        p.rect(600-50, 0, 50, 400);
        p.rect(0, 400-50, 600, 50);

        const elapsed = Date.now() - this.startTime;

        // Draw an opening curtain
        if (elapsed < 1000) {
            p.fill(255, 0, 0);

            const curtainRatio = (1000 - elapsed)/1000;
            p.rect(0, 0, 300 * curtainRatio, 400);
            p.rect(600 - 300 * curtainRatio, 0, 600, 400);
        }
    }
}
