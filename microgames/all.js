const microgames = [BananaMunch];

function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
