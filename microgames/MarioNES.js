class MarioNESGame extends Microgame {
    update(delta) {
        return 'playing';
    }

    draw(p) {
        p.background(0, 255, 0);
    }
}
