const microgames = [Shake];//BananaMunch, DuckHunt];

function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
