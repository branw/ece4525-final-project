const microgames = [WrongWayHighway]; //LinkChase];//BananaMunch, DuckHunt, Shake, RainyCat];

function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
