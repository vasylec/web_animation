alert("Controale:\nWASD - Te misti\nMouse Click - Impusti\nR - Reincarci arma\nShift - Alergi\nT - Instant Reload (Cheat)");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");    

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* -----------------------------------------------------
   UTILS
----------------------------------------------------- */
function rectsIntersect(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

/* -----------------------------------------------------
   CLASE
----------------------------------------------------- */
class Player {
    constructor() {
        this.x = 120;
        this.y = 120;
        this.width = 60;
        this.height = 85;
        this.speed = 3;
        this.hp = 100;

        this.flash = 0;

        this.ammo = 7;           
        this.maxAmmo = 7;        
        this.reserve = 21;       
        this.isReloading = false;
        this.reloadTime = 2000; 

        this.img = new Image();
        this.img.src = "playergun.png";
    }

    update(keys, walls) {
        if (this.hp <= 0) return;

        let dx = 0, dy = 0;

        this.speed = (keys["ShiftLeft"] || keys["ShiftRight"]) ? 6 : 3;

        if (keys["KeyW"]) dy -= 1;
        if (keys["KeyS"]) dy += 1;
        if (keys["KeyA"]) dx -= 1;
        if (keys["KeyD"]) dx += 1;

        if (dx || dy) {
            let len = Math.hypot(dx, dy);
            dx /= len; dy /= len;
        }

        this.tryMove(dx * this.speed, dy * this.speed, walls);
        if (this.flash > 0) this.flash--;
    }

    tryMove(dx, dy, walls) {
        this.x += dx;
        if (walls.some(w => rectsIntersect(this, w))) this.x -= dx;

        this.y += dy;
        if (walls.some(w => rectsIntersect(this, w))) this.y -= dy;
    }

    startReload() {
        if (this.isReloading) return;
        if (this.ammo === this.maxAmmo) return; 
        if (this.reserve <= 0) return; 

        this.isReloading = true;

        let bar = document.getElementById("reloadBar");
        let fill = document.getElementById("reloadFill");
        bar.style.display = "block";
        fill.style.width = "0%";

        let start = Date.now();

        let interval = setInterval(() => {
            let progress = (Date.now() - start) / this.reloadTime;
            fill.style.width = Math.min(progress * 100,100) + "%";

            if (progress >= 1) {
                clearInterval(interval);
                let need = this.maxAmmo - this.ammo;
                let transfer = Math.min(need, this.reserve);
                this.ammo += transfer;
                this.reserve -= transfer;
                this.isReloading = false;
                bar.style.display = "none";
                updateHUD();
            }
        }, 20);
    }

    instantReload() {
        let need = this.maxAmmo - this.ammo;
        let transfer = Math.min(need, this.reserve);
        this.ammo += transfer;
        this.reserve -= transfer;
        this.isReloading = false;
        document.getElementById("reloadBar").style.display = "none";
        updateHUD();
    }

    hit(dmg) {
        this.hp -= dmg;
        this.flash = 10;
        if (this.hp <= 0) this.hp = 0;
        updateHUD();
    }

    draw() {
        if (this.flash > 0) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        } else {
            if (this.img.complete) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            else {
                ctx.fillStyle = "blue";
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 85;
        this.speed = 1.3;
        this.hp = 100;
        this.shootCooldown = 0;

        this.flash = 0;

        this.img = new Image();
        this.img.src = "enemy.png";
    }

    update(player, walls, enemyBullets) {
        if (this.hp <= 0) return;

        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;

        this.tryMove(dx * this.speed, dy * this.speed, walls);

        if (this.shootCooldown <= 0) {
            enemyBullets.push(new Bullet(
                this.x + this.width/2,
                this.y + this.height/2,
                player.x + player.width/2,
                player.y + player.height/2,
                "black"
            ));
            this.shootCooldown = 50 + Math.random() * 40;
        } else this.shootCooldown--;

        if (this.flash > 0) this.flash--;
    }

    tryMove(dx, dy, walls) {
        this.x += dx;
        if (walls.some(w => rectsIntersect(this, w))) this.x -= dx;

        this.y += dy;
        if (walls.some(w => rectsIntersect(this, w))) this.y -= dy;
    }

    hit(dmg) {
        this.hp -= dmg;
        this.flash = 10;
    }

    draw() {
        if (this.hp <= 0) return;

        if (this.flash > 0) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1;
        } else {
            if (this.img.complete) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            else { ctx.fillStyle = "maroon"; ctx.fillRect(this.x, this.y, this.width, this.height); }
        }
    }
}

class Bullet {
    constructor(x, y, tx, ty, color="red") {
        this.x = x; this.y = y;
        this.width = 6; this.height = 6;
        this.speed = 10;
        this.color = color;

        let dx = tx - x;
        let dy = ty - y;
        let len = Math.hypot(dx, dy) || 1;
        this.vx = dx / len;
        this.vy = dy / len;
    }

    update() {
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Wall {
    constructor(x, y, w, h) {
        this.x = x; this.y = y;
        this.width = w; this.height = h;
    }
    draw() {
        ctx.fillStyle = "#888";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class AmmoPickup {
    constructor() {
        this.width = 20; this.height = 20;
        this.x = 60 + Math.random() * (canvas.width - 120);
        this.y = 60 + Math.random() * (canvas.height - 120);
    }
    draw() {
        ctx.fillStyle = "gold";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText('+2', this.x+3, this.y+14);
    }
}

/* -----------------------------------------------------
   WALLS
----------------------------------------------------- */
function makeWalls() {
    const w = canvas.width, h = canvas.height;
    const padding = 40;
    let list = [];
    list.push(new Wall(0,0,w,20)); 
    list.push(new Wall(0,h-20,w,20)); 
    list.push(new Wall(0,0,20,h));
    list.push(new Wall(w-20,0,20,h)); 

    list.push(new Wall(w*0.6, h*0.2, 20, h*0.5));
    list.push(new Wall(120, h*0.5, w*0.15, 20));

    list.push(new Wall(60, 60, w*0.2, 20));
    list.push(new Wall(60, 60, 20, h*0.18));

    return list;
}

let walls = makeWalls();

/* -----------------------------------------------------
   OBJECTS
----------------------------------------------------- */
let player = new Player();

let enemies = [
    new Enemy(canvas.width - 220, canvas.height - 200),
    new Enemy(canvas.width - 420, canvas.height - 320),
    new Enemy(canvas.width - 320, canvas.height - 520),
    new Enemy(canvas.width - 620, canvas.height - 240),
];

let bullets = [];
let enemyBullets = [];
let pickups = [];

let keys = {};
let gameOver = false;
let win = false;

/* -----------------------------------------------------
   INPUT
----------------------------------------------------- */
document.addEventListener("keydown", e => {
    keys[e.code] = true;

    if (e.code === "KeyR") player.startReload();
});
document.addEventListener("keyup", e => keys[e.code] = false);

canvas.addEventListener("click", e => {
    if (player.isReloading || player.ammo <= 0 || player.hp <= 0) return;

    player.ammo--;
    bullets.push(new Bullet(
        player.x + player.width/2,
        player.y + player.height/2,
        e.clientX,
        e.clientY,
        "red"
    ));
    updateHUD();
});

/* -----------------------------------------------------
   AMMO SPAWN TIMER (pickups add to reserve)
----------------------------------------------------- */
setInterval(() => {
    pickups.push(new AmmoPickup());
}, 5000);

/* -----------------------------------------------------
   HUD
----------------------------------------------------- */
function updateHUD(){
    const hud = document.getElementById('hud');
    hud.innerHTML = `HP: ${player.hp} <br>Mag: ${player.ammo}/${player.maxAmmo} <br>Total: ${player.reserve}`;
}
updateHUD();

/* -----------------------------------------------------
   GAME LOOP
----------------------------------------------------- */
function gameLoop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (gameOver) {
        showMessage("GAME OVER");
        return;
    }
    if (win) {
        showMessage("YOU WON!");
        return;
    }

    /* WALLS */
    walls.forEach(w => w.draw());

    /* PICKUPS */
    for (let i = pickups.length - 1; i >= 0; i--) pickups[i].draw();

    /* PLAYER */
    player.update(keys, walls);
    player.draw();

    /* ENEMIES */
    enemies.forEach(e => { e.update(player, walls, enemyBullets); e.draw(); });

    /* PLAYER BULLETS */
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.update();
        b.draw();

        if (walls.some(w => rectsIntersect(b, w))) { bullets.splice(i,1); continue; }

        for (let e of enemies) {
            if (e.hp > 0 && rectsIntersect(b, e)) {
                e.hit(20);
                bullets.splice(i,1);
                break;
            }
        }
    }

    /* ENEMY BULLETS */
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let b = enemyBullets[i];
        b.update();
        b.draw();

        if (walls.some(w => rectsIntersect(b, w))) { enemyBullets.splice(i,1); continue; }

        if (rectsIntersect(b, player)) {
            player.hit(10);
            enemyBullets.splice(i,1);

            if (player.hp <= 0) gameOver = true;
        }
    }

    /* PICKUP COLLISION */
    for (let i = pickups.length - 1; i >= 0; i--) {
        if (rectsIntersect(player, pickups[i])) {
            player.reserve += 2;
            pickups.splice(i, 1);
            updateHUD();
        }
    }

    /* SIMPLE ENEMY DEATH CHECK */
    if (enemies.every(e => e.hp <= 0)) { win = true; }

    requestAnimationFrame(gameLoop);
}

// function showMessage(txt) {
//     let m = document.getElementById("message");
//     m.innerText = txt;
//     m.style.display = "block";
// }

window.addEventListener('resize', () => {
    walls = makeWalls();
});

document.addEventListener('keydown', e => {
    if (e.code === 'KeyT') player.instantReload();
});

updateHUD();
gameLoop();