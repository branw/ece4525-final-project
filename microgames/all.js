//const microgames = [BananaMunch, DuckHunt, Chinook];
const microgames = [Chinook];
function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
