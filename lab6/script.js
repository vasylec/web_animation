const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// ctx.fillStyle = 'Pink';
// ctx.fillRect(10, 10, 200, 200);



for (let index = 0; index < 100; index++) {
    drawStar();
    
}






//Soarele
{
    ctx.beginPath();
    ctx.fillStyle = 'Yellow';
    ctx.arc(600, 300, 50, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}


//Orbita mercurului
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 111, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Mercur
{
    ctx.beginPath();
    ctx.fillStyle = 'gray';
    ctx.arc(550, 400, 10, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}


//Orbita venusului
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 160, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Venus
{
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 181, 84)';
    ctx.arc(750, 250, 10, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}
//Orbita pamantului
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 200, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Pamantul
{
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.arc(400, 300, 13, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();



    ctx.beginPath();
    ctx.fillStyle = '#1ca100';
    ctx.moveTo(395, 295);
    ctx.lineTo(394, 293);
    ctx.bezierCurveTo(392, 292, 395, 290, 397, 291);
    ctx.bezierCurveTo(398, 293, 400, 295, 398, 296);
    ctx.bezierCurveTo(396, 298, 396, 297, 395, 295);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#1ca100';
    ctx.moveTo(403, 304);
    ctx.bezierCurveTo(405, 302, 408, 303, 409, 305);
    ctx.bezierCurveTo(410, 307, 408, 308, 407, 309);
    ctx.bezierCurveTo(405, 310, 403, 308, 403, 304);
    ctx.bezierCurveTo(404, 303, 404, 303, 403, 304);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,180,0,0.6)';
    ctx.moveTo(401, 299);
    ctx.bezierCurveTo(402, 297, 404, 298, 405, 300);
    ctx.bezierCurveTo(406, 302, 403, 302, 401, 299);
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(395, 303, 3, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 150, 0, 0.8)';
    ctx.arc(403, 296, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}


//Orbita martie
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 317, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Martie
{
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 102, 0)';
    ctx.arc(300, 200, 10, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}
//Orbita jupiter
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 448, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Jupiter
{
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255, 102, 0)';
    ctx.arc(200, 500, 20, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}
//Orbita saturn
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 510, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Inelul saturn
{
    ctx.beginPath();
    ctx.arc(1100, 200, 40, 0, Math.PI * 2);
    ctx.arc(1100, 200, 33, 0, Math.PI * 2, true); // path inversat pentru gaura din mijloc
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.closePath();
}

//saturn
{
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 221, 198, 1)';
    ctx.arc(1100, 200, 15, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

//Orbita uranus
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 578, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Uranus
{
    ctx.beginPath();
    ctx.fillStyle = 'aqua';
    ctx.arc(80, 550, 17, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}
//Orbita neptun
{
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.arc(600, 300, 612, 0, 5 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}
//Neptun
{
    ctx.beginPath();
    ctx.fillStyle = 'rgba(26, 0, 141, 1)';
    ctx.arc(40, 50, 17, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawStar(){
    let radius = (Math.random() * 2) + 1;
    let x = randomInt(5, window.innerWidth - 10); 
    let y = randomInt(5, window.innerHeight - 10);
    
    
    ctx.beginPath();
    ctx.fillStyle = 'White';
    ctx.arc(x, y, radius, 0, 5 * Math.PI);
    ctx.fill();
    ctx.closePath();
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}