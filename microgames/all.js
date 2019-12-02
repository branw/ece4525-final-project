//const microgames = [BananaMunch, DuckHunt];
const microgames = [RainyCat];
function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
