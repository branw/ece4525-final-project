class MarioNESGame extends Microgame {
	constructor(){
		super();
	    this.warioSheet = p.loadImage("./resources/wario_sheet.gif")

	}
    update(delta) {
        return 'playing';
    }

    draw(p) {
        p.background(125, 255, 0);
        p.scale(.4);
        p.image(this.warioSheet);

    }
}
