var p;

new Processing(document.getElementById('game'), function(processingInstance) {
    p = processingInstance;

    initSprites();

    p.size(600, 400);

    p.background(0xb8, 0xb8, 0xb8);
    setBorderBg(0xb8, 0xb8, 0xb8);

    p.frameRate(60);

    let game = new Game();

    // Enter intro state
    game.changeState(new IntroState());

    // Register input handlers
    const keyMapping = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
    p.keyPressed = function() {
        game.keyPressed(keyMapping[p.keyCode]);
    };
    p.keyReleased = function() {
        game.keyReleased(keyMapping[p.keyCode]);
    };
    p.mousePressed = function() {
        game.mousePressed(keyMapping[p.mouseButton]);
    };
    p.mouseReleased = function() {
        game.mouseReleased(keyMapping[p.mouseButton]);
    };

    // Register game loop handler
    let lastUpdate = millis();
    p.draw = function() {    
        const currentTime = millis();
        game.update(currentTime - lastUpdate);
        lastUpdate = currentTime;

        game.draw();
    };
}); 
