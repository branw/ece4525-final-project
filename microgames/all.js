const microgames = [Fountain, Chinook, LinkChase, WrongWayHighway, BananaMunch, DuckHunt, Shake, RainyCat];

function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
