class MarioNESGame extends Microgame {
    border = 'tv';

	constructor(){
		super();
	}

    update(delta) {
        return 'playing';
    }

    draw() {
        p.background(120, 0, 0);

        p.pushMatrix();
        p.scale(.4);
        p.image(SPRITES.warioSheet);
        p.popMatrix();
    }
}
