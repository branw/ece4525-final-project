//const microgames = [BananaMunch, DuckHunt, Chinook];
const microgames = [Fountain];
function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
