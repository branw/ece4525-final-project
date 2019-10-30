const microgames = [MarioNESGame];

function randomMicrogame() {
    return microgames[Math.floor(Math.random()*microgames.length)];
}
