const microgames = [WrongWayHighway, BananaMunch, DuckHunt, Shake, RainyCat]; // LinkChase

function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
