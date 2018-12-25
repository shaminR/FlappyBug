var myCanvas = document.getElementById('canvas');
var context = myCanvas.getContext('2d');

var backdrop = new Image();
backdrop.src = "img/background2.jpg";

var bugz = new Image();
    bugz.src = "img/bug2.png";
var ground = new Image();
    ground.src = "img/ground.png";
var pillarUp = new Image();
    pillarUp.src = "img/up2.png";
var pillarDown = new Image();
    pillarDown.src = "img/down2.png";
var skullz = new Image();
    skullz.src = "img/skull3.png";
var crashSound = new Audio("audio/crash.mp3");
var flySound = new Audio("audio/jump2.mp3");
var ping = new Audio("audio/coin.wav");
var themes = new Audio("audio/ambient.mp3");
var lose = new Audio("audio/loser.mp3");

var pillars = [];
pillars[0] = {
    x:myCanvas.width,
    y:-350
};

var bug = {
    x:50,
    y:250
};

var score = 0, gameState = 0, deathStatus = 0; //deathStatus == 0 means alive

document.addEventListener("keydown", fly);

function fly(){
    bug.y -= 50;
    //flySound.play();
}

function draw(){
    context.drawImage(backdrop, 0, 0);
    var safe = false;

    for(var i = 0; i < pillars.length; i++){
        context.drawImage(pillarUp, pillars[i].x, pillars[i].y);
        context.drawImage(pillarDown, pillars[i].x, pillars[i].y+700);
        pillars[i].x--;
        if(pillars[i].x == myCanvas.width - 150){
            pillars.push({
                x:myCanvas.width, 
                y:Math.floor(Math.random()*(-260+440)) - 440
            });
        }
        if(pillars[i].x + 73 == 49){
            scoreIncrement();
        }
    }
    
    context.drawImage(bugz, bug.x, bug.y, 30, 20);
    bug.y += 2;

    safe = collisionChecker();
    if(safe != true){
        themes.play();
        requestAnimationFrame(draw); 
    } else {
        crashSound.play();
        deathStatus = 1;
        lose.play();
        death();
    }
}

function menu(){
    context.drawImage(bugz, 120, 140, 60, 40);
    context.fillStyle = "red";
    context.font = "bold 24px Arial";
    context.fillText("Press Start", 85, 270);

    context.fillStyle = "black";
    context.font = "12px Arial";
    context.fillText("®1999 Rahman Studios", 85, 400);
    context.font = "10px Arial";
    context.fillText("v2.0.1", 265, 480);
    if(gameState != 1){
        requestAnimationFrame(menu);
    } else if(gameState == 1){
        context.fillStyle = "white";
        context.fillRect(60, 180, 180, 170);

        context.fillStyle = "blue";
        context.font = "bold 18px Arial";
        context.fillText("Press any button to fly", 60, 260);
    
        setTimeout(function(){
            draw();
        }, 600);
        
    }
}

function death(){
    context.fillStyle = "white";
    context.fillRect(60, 180, 180, 170);

    context.drawImage(skullz, 120, 140, 60, 80);
    context.fillStyle = "violet";
    context.font = "bold 24px Arial";
    context.fillText("You Died", 97, 260);
    
    context.fillStyle = "black";
    context.font = "18px Arial";
    context.fillText("Press Restart", 95, 290);
    
    if(deathStatus != 0){
        requestAnimationFrame(death);
    }
    else{
        bug.x = 50; bug.y = 250;
        pillars = [];
        pillars[0] = {
            x:myCanvas.width,
            y:-350
        };
        draw();   
    }
}

document.getElementById("reset").onclick = function(){
    if(document.getElementById("reset").innerText == "Start"){
        gameState = 1;
        document.getElementById("reset").innerText = "Restart";
    } else if(document.getElementById("reset").innerText == "Restart" && deathStatus == 1){
        deathStatus = 0;
        score = 0;
        document.getElementById("scorez").innerText = "Score: " + String(score);
    }
}

function scoreIncrement(){
    score++;
    document.getElementById("scorez").style.color = "orange";
    document.getElementById("scorez").innerText = "Score: " + String(score);
    setTimeout(function(){document.getElementById("scorez").style.color = "black";}, 500);
    ping.play();
}

function collisionChecker(){
    if(bug.y + 20 >= 500 || bug.y < 0)
        return true;
    for(var i = 0; i<pillars.length; i++){
        for(var k = 0; k < 73; k++){
            for(var j = 0; j < 30; j++){
                if(pillars[i].x + k == bug.x + j && (bug.y < pillars[i].y+569 || bug.y+20 > pillars[i].y+700))
                    return true;
            }
        }
    }
}

menu();