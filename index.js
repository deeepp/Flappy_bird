let board;
let context;
let boardHeight =640;
let boardWidth = 360; //pixel of images in assets
let birdWidth = 34;
let birdHeight = 24;
let birdX= boardWidth/8;
let birdY = boardWidth/2;
//pipes
let pipeArray = [];
let pipe=[];
let pipeWidth = 64;  //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
//physics
let velocityX= -2;
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let gameOver= false;
let score=0;
window.onload = function(){
    
board=document.getElementById("board");
    board.height=boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    //context.fillStyle = "green";
    //context.fillRect(birdX,birdY,birdWidth,birdHeight);
    birdImg = new Image();
    birdImg.src="assets/flappybird.png";
    birdImg.onload = function(){
    context.drawImage(birdImg,birdX,birdY,birdWidth,birdHeight); 
}
topPipeImg = new Image();
topPipeImg.src = "assets/toppipe.png";
bottomPipeImg = new Image();
bottomPipeImg.src = "assets/bottompipe.png";
requestAnimationFrame(update);
setInterval(placePipes,1500); 
document.addEventListener("keydown", moveBird);
}
//main game
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,boardWidth,boardHeight);
    //bird
    velocityY +=gravity;
    //birdY += velocityY;
    birdY=Math.max(birdY+velocityY,0)
    context.drawImage(birdImg,birdX,birdY,birdWidth,birdHeight);

    if(birdY>boardHeight){
        gameOver=true;
    }
    //pipes
    while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();//removes first element from array
    }
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x+=velocityX ;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        let bird= {x:birdX,y:birdY,width:birdWidth,height:birdHeight};
        if(!pipe.passed && bird.x>pipe.x+pipe.width ){
            score+=0.5; 
            pipe.passed = true;
        }
        if (detectCollision(bird,pipe)){
            gameOver= true;
        }
    }
    // for(let i=0;i<pipe.length;i++){
    //     let pipe1 = pipe[i];
    //     pipe1.x+=velocityX;
    //     context.drawImage(pipe1.img,pipe1.x,pipe1.y,pipe1.width,pipe1.height);
    // }
    context.fillstyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);
    if(gameOver){
        context.fillText("GAME OVER",5,90)
    }
}
function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4- Math.random()*(pipeHeight/2);
    //let randomY = pipeY - pipeArray/4 + Math.random()*(pipeHeight/2);
    let openSpace = boardHeight/4;
    let toppipe = {
        img:topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width: pipeWidth,
        height:pipeHeight,
        passed: false
    }
    pipeArray.push(toppipe);
    let bottompipe ={
        img: bottomPipeImg,
        x:pipeX,
        y:randomPipeY+ pipeHeight + openSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed:false

    }
   
    pipeArray.push(bottompipe);
}
function moveBird(e){
    if(e.code== "Space" || e.code == "Arrow" || e.code == "keyX" || e.code == "click")
    {
        //jump
        velocityY = -6; 
        //for(let i=0;i<5;i++)
        //velocityY+=2*i;
        //reset game
        if(gameOver){
            pipeArray=[];
            score=0;
            gameOver=false;
        }
    } 
} 
function detectCollision(a,b){
    return a.x <b.x + b.width &&
            a.x+a.width >b.x &&
            a.y<b.y+ b.height &&
            a.y + a.height >b.y;
}