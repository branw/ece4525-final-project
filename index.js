var p;
new Processing(document.getElementById('game'), function(processingInstance) {
    p = processingInstance;

    with (processingInstance) {

        size(600, 400); 
        frameRate(60);

        let game = new Game();

        // Enter intro state
        game.changeState(new IntroState());

        // Register input handlers
        const keyMapping = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
        keyPressed = function() {
            game.keyPressed(keyMapping[keyCode]);
        };
        keyReleased = function() {
            game.keyReleased(keyMapping[keyCode]);
        };
        mousePressed = function() {
            game.mousePressed(keyMapping[mouseButton]);
        };
        mouseReleased = function() {
            game.mouseReleased(keyMapping[mouseButton]);
        };

        // Register game loop handler
        let lastUpdate = millis();
        draw = function() {
            game.update(millis() - lastUpdate);
            lastUpdate = millis();

            game.draw(processingInstance);
        };
    }
}); 
