const canvasWidth= 600;
const canvasHeight = 400;
const radius = 25;
let canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let birdState = 0;
let roadState = 0;
let roadStates = [0,20];
canvas.style.filter = 'drop-shadow(5px,5px)';

let X = 150;
let Y = 150;
let isJumping = false;
let isFalling = false;
let gameStarted = false;
let velocity = 0;
let gravity = 0.5 ;
let gameOver = false;
let framesDrawn = 0;
const gameOverImage = new Image();
gameOverImage.src = 'game_over.png';

const birdImage = new Image();
birdImage.src = 'bird.png';
const birdCoordinates = [[210,150],[465,150],[720,150]];
const birdHeightRequired = 36;
const birdWidthRequired = 51;
const birdHeightOriginal = 180;
const birdWidthOriginal = 255;

const roadImage = new Image();
roadImage.src = 'road.png';

const staticBackgroundImage = new Image();
staticBackgroundImage.src = 'static_background.png';

const pipeTopImage = new Image();
pipeTopImage.src = 'pipe_top.png';

const pipeBottomImage = new Image();
pipeBottomImage.src = 'pipe_bottom.png';

const pipeImage = new Image();
pipeImage.src  = 'pipe.png';

let gameTicks = 0;
let obstacles = [];

const drawFrame = (ctx, x, y) => {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);    
    drawTheRoad(ctx);
    drawStaticBackground();
    drawTheObstacle();
    drawTheBird(ctx,x,y);
    if(gameOver) {
        drawGameOverText();
    }
}

const drawBird = (birdCoords,x,y) => {
    ctx.drawImage(birdImage, birdCoords[0], birdCoords[1], birdWidthOriginal, birdHeightOriginal, x-birdWidthRequired/2, y-birdHeightRequired/2, birdWidthRequired, birdHeightRequired);
}

const drawGameOverText = () => {
    ctx.drawImage(gameOverImage, 200, 125);
    
}

const drawTheBird = (ctx,x,y) => {
    
    if(birdState > 10 && !gameOver) {
        drawBird(birdCoordinates[0],x,y);
    } else {
        drawBird(birdCoordinates[1],x,y);
    }
    birdState += 1;
    birdState %= 20;

}

const drawStaticBackground = () => {
    ctx.drawImage(staticBackgroundImage,0,0,275,150,0  , canvasHeight - 50 - 150, 275, 150);
    ctx.drawImage(staticBackgroundImage,0,0,275,150,275, canvasHeight - 50 - 150, 275, 150);
    ctx.drawImage(staticBackgroundImage,0,0,275,150,550, canvasHeight - 50 - 150, 275, 150);
}

const drawTheRoad = (ctx) => {
    
    if(!gameOver && gameStarted) {
        if(framesDrawn % 30 < 10) {
            roadState = 0;
        }else if(framesDrawn % 30 < 20){
            roadState = 1;
        } else {
            roadState = 2;
        }
    }
    if(roadState == 0) {
        ctx.drawImage(roadImage, 0, 0, 600, 50, 0  , canvasHeight - 50, 600, 50);
    } else if(roadState == 1){
        ctx.drawImage(roadImage, 4, 0, 600, 50, 0  , canvasHeight - 50, 600, 50);
        ctx.drawImage(roadImage, 1, 0, 596, 50, 596, canvasHeight - 50, 596, 50);
    } else {
        ctx.drawImage(roadImage, 8, 0, 600, 50, 0  , canvasHeight - 50, 600, 50);
        ctx.drawImage(roadImage, 1, 0, 592, 50, 592, canvasHeight - 50, 592, 50);
    }
}


const drawWithAnimation = () => {
    framesDrawn++;
    framesDrawn%=60;
    if(framesDrawn == 0 && gameStarted && !gameOver) {
        gameTicks++;
        console.log(gameTicks);
    }
    if(gameOver) {
        gameTicks = 0;
    }
    drawFrame(ctx, X, Math.min(375, getDelta()));
    window.requestAnimationFrame(drawWithAnimation);
}
const getDelta = () => {
    if(gameStarted) {
        if(isJumping && velocity >= 0) {
            isJumping = false;
            velocity = -9 ;
            Y += velocity;
            return Y;
        } else {
            const bottomHitbox = canvasHeight-50-(birdHeightRequired/2);
            if(Y < bottomHitbox ) {
                velocity += gravity;
            }
            else {
                velocity = 0;
                Y = bottomHitbox;
                gameOver = true;
                return bottomHitbox;
            }
        }
        const delta = Y + velocity;
        Y = delta;
        return delta;
    }
    return Y;
}

const drawTheObstacle = () => {
    if(gameOver) {
        obstacles = [];
    }
    if(gameStarted && !gameOver) {
        if(gameTicks == 1) {
            obstacles.push(600);
            console.log(obstacles);
        }
        gameTicks %= 1;
        
        obstacles.map(x => {
            let pipesAtTop = Math.floor(Math.random() * 10 %4);
            let pipesAtBottom = 4 - pipesAtTop;
            pipesAtBottom = 0;
            if(pipesAtBottom == 0){
                ctx.drawImage(pipeImage,0,0,50,50,x,0,50,50);
                ctx.drawImage(pipeImage,0,0,50,50,x,51,50,50);
                ctx.drawImage(pipeImage,0,0,50,50,x,101,50,50);
                ctx.drawImage(pipeTopImage,0,0,50,72,x,151,50,72);
                ctx.drawImage(pipeBottomImage,0,0,50,72,x,350 - 72,50,72);
            } else {
                ctx.drawImage(pipeTopImage,0,0,50,72,x,0,50,72);
                ctx.drawImage(pipeBottomImage,0,0,50,72,x,350 - 72,50,72);
            }
        });
        obstacles = obstacles.map(x => x-3);
        obstacles = obstacles.filter( x => x > -50);
    }
}

const startGame = (e) => {
    if(!gameOver) {
        if('Space' === e.code) {
            if(!gameStarted) {
                isFalling = true;
                gameStarted = true;
            }
            isJumping = true; 
        }
    }
    if(gameOver && e.code == 'Escape') {
        X = 150;
        Y = 150;
        isJumping = false;
        isFalling = false;
        gameStarted = false;
        velocity = 0;
        gravity = 0.5 ;
        gameOver = false;
    }
}
document.addEventListener('keydown', startGame);
drawWithAnimation(ctx,X,Y);
