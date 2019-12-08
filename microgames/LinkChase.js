// Width and height of each tile (40 px/tile * 25 tiles = 1000 px)
var TILE_SIZE = 20;

// Pixels moved per frame for the player and NPCs
var MOVE_SPEED = 1;

// Time in ms between chase target updates
var CHASE_UPDATE = 500;

// 20x20
var TILEMAP = [
    "15555555555315555553",
    "5          46    O 5",
    "5 13 15553    3  155",
    "5 56 5 56  4556 1555",
    "5 5  5 6        4555",
    "5 4  5 L  1 13   455",
    "5 O  6   15556    55",
    "553     7     7 7 45",
    "56  1553   13   8  5",
    "5        8 4553  7 5",
    "53  1553    4553   5",
    "55   456  1 O     15",
    "553      153  8 1555",
    "5 5 1553  4553  4555",
    "5 6  16    4553  5 5",
    "6    6  13  5553 5 5",
    "153 O 8 55  4556 5 5",
    "5 456   553      4 5",
    "5      16 45553  O 5",
    "45555556    45555556"
];

var Block = function(x, y, spriteId) {
    this.spriteId = spriteId;
    this.pos = new PVector(x, y);
};

Block.prototype.draw = function() {
    p.image(SPRITES.zelda.overworld[this.spriteId], this.pos.x, this.pos.y, TILE_SIZE, TILE_SIZE);
};

var qObj = function(x, y) {
    this.x = x;
    this.y = y;
    this.fcost = 0;
};

qObj.prototype.set = function(a, b) {
    this.x = a;
    this.y = b;
};

var Octorok = function(x, y) {
    this.pos = new PVector(x, y);
    this.angle = -Math.PI/2;

    this.animationTicks = 0;

    this.lastMove = 0;

    this.graph = new Array(20);
    this.cost = new Array(20);
    this.inq = new Array(20);
    this.comefrom = new Array(20);
    for (var i=0; i<20; i++) {
        this.graph[i] = new Array(20);
        this.cost[i] = new Array(20);
        this.inq[i] = new Array(20);
        this.comefrom[i] = new Array(20);
    }

    for (var i = 0; i < TILEMAP.length; i++) {
        for (var j = 0; j < TILEMAP[i].length; j++) {
            if (TILEMAP[i][j] >= '0' && TILEMAP[i][j] <= '9') {
                this.graph[i][j] = -1;
            } else {
                this.graph[i][j] = 0;
            }
        }
    }


    this.path = [];
    this.q = [];
    for (i=0; i<400; i++) {
        this.path.push(new PVector(0, 0));
        this.q.push(new qObj(0, 0));
    }
    for (i=0; i<20; i++) {
        for(var j=0; j<20; j++) {
            this.comefrom[i][j] = new PVector(0, 0);
        }
    }
    this.pathLen = 0;
    this.pathFound = 0;
    this.qLen = 0;
    this.qStart = 0;
    this.finalDest = new PVector(0, 0);
    this.target = new PVector(0, 0);
    this.step = new PVector(0, 0);
};

Octorok.prototype.initGraph = function() {
    for (var i = 0; i< 20; i++) {
        for (var j = 0; j<20; j++) {
            if (this.graph[i][j] > 0) {
                this.graph[i][j] = 0;
            }
            this.inq[i][j] = 0;
            this.cost[i][j] = 0;
        }
    }
};

Octorok.prototype.findMinInQ = function() {
    var min = this.q[this.qStart].fcost;
    var minIndex = this.qStart;
    for (var i = this.qStart+1; i<this.qLen; i++) {
        if (this.q[i].fcost < min) {
            min = this.q[i].qStart;
            minIndex = i;
        }
    }
    if (minIndex !== this.qStart) {  // swap
        var t1 = this.q[minIndex].x;
        var t2 = this.q[minIndex].y;
        var t3 = this.q[minIndex].fcost;
        this.q[minIndex].x = this.q[this.qStart].x;
        this.q[minIndex].y = this.q[this.qStart].y;
        this.q[minIndex].fcost = this.q[this.qStart].fcost;
        this.q[this.qStart].x = t1;
        this.q[this.qStart].y = t2;
        this.q[this.qStart].fcost = t3;
    }
};

Octorok.prototype.setComeFrom = function(a, b, i, j) {
    this.inq[a][b] = 1;
    this.comefrom[a][b].set(i, j);
    this.q[this.qLen].set(a, b);
    this.cost[a][b] = this.cost[i][j] + 10;
    this.q[this.qLen].fcost = this.cost[a][b] + p.dist(b*20+10, a*20+10, this.finalDest.x,
this.finalDest.y);
    this.qLen++;
};

Octorok.prototype.solveGraph = function(target) {
    var y = Math.floor(this.pos.x / TILE_SIZE), x = Math.floor(this.pos.y / TILE_SIZE);

    var i, j, a, b;
    this.finalDest = target;
    this.qLen = 0;
    this.graph[x][y] = 1;
    this.inq[x][y] = 1;
    this.q[this.qLen].set(x, y);
    this.q[this.qLen].fcost = 0;
    this.qLen++;
    this.pathLen = 0;
    this.qStart = 0;
    
    while ((this.qStart < this.qLen) && (this.pathFound === 0)) {
        this.findMinInQ();
        i = this.q[this.qStart].x;
        j = this.q[this.qStart].y;
        this.graph[i][j] = 1;
        this.qStart++;
        
        if ((i === Math.floor(target.y / 20)) && (j === Math.floor(target.x / 20))) {
            this.pathFound = 1;
            this.path[this.pathLen].set(j*20+10, i*20+10);
            this.pathLen++;
        }
        
        a = i+1;
        b = j;
        if ((a < 20) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.setComeFrom(a, b, i, j);
            }
        }
        a = i-1;
        b = j;
        if ((a >= 0) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.setComeFrom(a, b, i, j);
            }
        }
        a = i;
        b = j+1;
        if ((b < 20) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.setComeFrom(a, b, i, j);
            }
        }
        a = i;
        b = j-1;
        if ((b >= 0) && (this.pathFound === 0)) {
            if ((this.graph[a][b] === 0) && (this.inq[a][b] === 0)) {
                this.setComeFrom(a, b, i, j);
            }
        }
    }   // while
    
    while ((i !== x) || (j !== y)) {
        a = this.comefrom[i][j].x;
        b = this.comefrom[i][j].y;
        this.path[this.pathLen].set(b*20 + 10, a*20+10);
        this.pathLen++;
        i = a;
        j = b;
    }
};

Octorok.prototype.update = function(target) {
    if (millis() - this.lastMove > CHASE_UPDATE) {
        this.initGraph();
        this.pathFound = 0;
        this.pathLen = 0;
        this.solveGraph(target);

        this.pathLen--;
        this.target.set(this.path[this.pathLen].x, this.path[this.pathLen].y);

        this.lastMove = millis();
    }

    if (this.pathLen > 0) {
        // Select the next step
        if (p.dist(this.target.x, this.target.y, this.pos.x, this.pos.y) < 2) {
            this.pathLen--;
            this.target.set(this.path[this.pathLen].x, this.path[this.pathLen].y);
        }
        
        // Take the step
        this.step.set(this.target.x - this.pos.x, this.target.y - this.pos.y);
        this.step.normalize();
        this.step.mult(0.6);
        this.pos.add(this.step);
    }

    console.log(p.dist(target.x, target.y, this.pos.x, this.pos.y));

    return p.dist(target.x, target.y, this.pos.x, this.pos.y) < 13;
};

Octorok.prototype.draw = function(chargingFrame, releasedFrame) {
    var spriteNum = +(this.animationTicks++ % 20 > 10);

    var angle = -Math.PI/2; // right

    if (this.step.y > 0 && Math.abs(this.step.y) > Math.abs(this.step.x)) {
        angle = 0; // up
    }
    else if (this.step.y < 0 && Math.abs(this.step.y) > Math.abs(this.step.x)) {
        angle = -Math.PI; // down
    }
    else if (this.step.x < 0 && Math.abs(this.step.x) > Math.abs(this.step.y)) {
        angle = Math.PI/2; // left
    }

    p.pushMatrix();
    p.translate(this.pos.x, this.pos.y);
    p.rotate(angle);
    p.image(SPRITES.zelda.octorok[spriteNum], -TILE_SIZE/2, -TILE_SIZE/2, TILE_SIZE, TILE_SIZE);
    p.popMatrix();
};

var Link = function(x, y) {
    this.pos = new PVector(x, y);
    
    this.walking = false;
    this.dir = 'right';

    this.walkingTicks = 0;
};

var hitsObject = function(a, b) {
    return (a.x < b.x + TILE_SIZE) && (a.x + TILE_SIZE > b.x) && (a.y < b.y + TILE_SIZE) && (a.y + TILE_SIZE > b.y);
};

Link.prototype.move = function(newPos, walls) {
    for (var i = 0; i < walls.length; i++) {
        if (hitsObject(newPos, walls[i].pos)) {
            return;
        }
    }

    this.pos = newPos;
};

Link.prototype.update = function(keys, walls) {
    var x = this.pos.x, y = this.pos.y;
    
    this.walking = false;

    if (keys['left']) {
        x -= MOVE_SPEED;
        this.dir = 'left';
        this.walking = true;
    }
    if (keys['right']) {
        x += MOVE_SPEED;
        this.dir = 'right';
        this.walking = true;
    }
    if (keys['up']) {
        y -= MOVE_SPEED;
        this.dir = 'up';
        this.walking = true;
    }
    if (keys['down']) {
        y += MOVE_SPEED;
        this.dir = 'down';
        this.walking = true;
    }
    
    // Attempt to move in each direction independently
    this.move(new PVector(x, this.pos.y), walls);
    this.move(new PVector(this.pos.x, y), walls);
};

Link.prototype.draw = function(scale) {
    scale = scale || 1;

    // Change feet every so many steps
    if (this.walking) {
        this.walkingTicks++;
        
        if (this.walkingTicks > 10) {
            this.walkingTicks = 0;
        }
    }
    var spriteNum = +(this.walkingTicks % 10 > 5);

    // Create left-facing sprite by mirroring the right sprite
    var spriteDir = this.dir;
    var xFactor = 1;
    if (spriteDir === 'left') {
        spriteDir = 'side';
        xFactor = -1;
    } else if (spriteDir === 'right') {
        spriteDir = 'side';
    }
    
    p.pushMatrix();
    p.translate(this.pos.x + TILE_SIZE/2 + (xFactor > 0 ? 0 : TILE_SIZE), this.pos.y);
    p.scale(scale * xFactor, scale);
    p.image(SPRITES.zelda.link[spriteDir][spriteNum], -xFactor * TILE_SIZE/2, 0, TILE_SIZE, TILE_SIZE);
    p.popMatrix();
};

class LinkChase extends Microgame {
    border = 'none';
    timerace = true;

    state = 'intro';

    elapsed = 0;

    player;
    octoroks = [];
    walls = [];

    lastOctorokUpdate = 0;

    lostTime = 0;

    constructor() {
        super();

        for (var i = 0; i < TILEMAP.length; i++) {
            for (var j = 0; j < TILEMAP[i].length; j++) {
                var x = j * TILE_SIZE, y = i * TILE_SIZE;

                var tile = TILEMAP[i][j];
                switch (tile) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    var spriteId = tile.charCodeAt(0) - '1'.charCodeAt(0);
                    this.walls.push(new Block(x, y, spriteId));
                    break;

                case 'L':
                    this.player = new Link(x, y);
                    break;

                case 'O':
                    this.octoroks.push(new Octorok(x, y));
                    break;
                }
            }
        }
    }

    update(delta) {
        this.elapsed += delta;

        switch (this.state) {
        case 'intro':
            if (this.elapsed > 1000) {
                this.state = 'playing';
            }

            break;

        case 'playing':
            let hit = false;
            if (this.elapsed - this.lastOctorokUpdate > 100) {
                this.lastOctorokUpdate = this.elapsed;
                for (var i = 0; i < this.octoroks.length; i++) {
                    if (this.octoroks[i].update(this.player.pos)) {
                        hit = true;
                    }
                }
            }

            this.player.update(this.game.keys, this.walls);

            if (hit) {
                this.state = 'lost';
                this.lostTime = this.elapsed;
            }

            break;

        case 'lost':

            break;
        }

        return this.state;
    }

    draw() {
        setBg(252, 216, 168);
        
        p.pushMatrix();
        p.translate(100, 0);

        // Draw the overworld
        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].draw();
        }

        // Draw Links
        for (var i = 0; i < this.octoroks.length; i++) {
            this.octoroks[i].draw();
        }
        
        this.player.draw((this.state === 'lost') ? 1 + (this.elapsed - this.lostTime) / 200 : 1);

        p.popMatrix();

        if (this.state === 'intro') {
            p.pushMatrix();
            p.translate(140, 100);
            p.scale(2);
            warioText("Avoid!");
            p.popMatrix();

            // Show arrow key icon
            if (Math.floor(this.elapsed / 150) % 2 == 0) {
                p.pushMatrix();
                p.translate(265, 200);
                p.scale(3);
                p.image(SPRITES.text.get(673, 215, 28, 20), 0, 0);
                p.popMatrix();
            }
        }
    }
}
