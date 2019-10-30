class Game {
    keys = {};
    mouse = {};
    states = [];

    pushState(newState) {
        newState.setGame(this);

        this.states.push(newState);
    }

    popState() {
        this.states.pop();
    }

    changeState(newState) {
        if (this.states.length > 0) {
            this.popState();
        }

        this.pushState(newState);
    }

    currentState() {
        return this.states[this.states.length-1];
    }

    keyPressed(key) {
        this.keys[key] = true;
    }

    keyReleased(key) {
        this.keys[key] = false;
    }

    mousePressed(button) {
        this.mouse[button] = true;
    }

    mouseReleased(button) {
        this.mouse[button] = false;
    }

    update(delta) {
        this.currentState().update(delta);
    }

    draw(p) {
        this.currentState().draw(p);
    }
}
