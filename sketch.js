var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var nube, cloud;
var obstacleImg, obstacle2Img, obstacle3Img, obstacle4Img, obstacle5Img, obstacle6Img
var score=0;
var obstacleGroup;
var gameState = "serve";
var play = 1;
var end = 0;
var restartImg, restart;
var gameOverImg, gameOver;
var NubesGroup;
var muerte, checkPoint, jump;

function preload() {
    trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    trex_collided = loadAnimation("trex_collided.png");
    groundImage = loadImage("ground2.png");
    nube = loadImage("cloud.png");
    obstacle1Img = loadImage ("obstacle1.png");
    obstacle2Img = loadImage ("obstacle2.png");
    obstacle3Img = loadImage ("obstacle3.png");
    obstacle4Img = loadImage ("obstacle4.png");
    obstacle5Img = loadImage ("obstacle5.png");
    obstacle6Img = loadImage ("obstacle6.png");
    restartImg =loadImage ("restart.png");
    gameOverImg = loadImage ("gameOver.png");
    muerte = loadSound ("die.mp3");
    checkPoint = loadSound ("checkpoint.mp3");
    jump = loadSound("jump.mp3");
}

function setup() {
    //createCanvas(600, 200);
    createCanvas(windowWidth,windowHeight);
    //create a trex sprite
    trex = createSprite(width-50,100,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.5;
    //create a ground sprite
    ground = createSprite(width/2,height-40,width,125);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    invisibleGround = createSprite(width/2,height-25,width,2);
    invisibleGround.visible=!true;
    obstacleGroup = createGroup();
    restart = createSprite(width/2,height/2+100);
    gameOver = createSprite (width/2,height/2+50);
    restart.addImage(restartImg);
    gameOver.addImage(gameOverImg);
    NubesGroup = createGroup();
    
}

function draw() {

    background(150);
    fill("white");
    /*textSize(15);
    text("X "+mouseX+","+"Y "+mouseY,mouseX,mouseY);*/

    trex.setCollider("circle",0,0,30);
    trex.debug=false;

    //CANVAS X = 600, Y = 200

    text("puntuacion: "+score,width-130,windowHeight-720)
    if(gameState == "serve"){
        trex.x = 50;
        trex.y = height-60;
        restart.visible = false;
        gameOver.visible = false;
        text("presiona la tecla espacio para empezar",width/3,height/2+130);
        score = 0;
        if(keyDown("space")){
            gameState = "play";
        }

    } else if(gameState == "play"){
        
        gameOver.visible = false;
        restart.visible = false;

        ground.velocityX = -(4 + 3* score/100);
        score = score+Math.round(getFrameRate()/60);
        if(score%100===0 && score>0){
            checkPoint.play();
            //cargar sonido

        }
        if(ground.x < 0){
            ground.x=ground.width/2;
         }
        
       

        //jump when the space button is pressed
        if (touches.lenght>0||keyDown("space") && trex.y>=height-110) {
            jump.play();
        trex.velocityY = -10;
        touches=[];
        }
        trex.velocityY = trex.velocityY + 0.8;

        nubes();
        aparecer_obstaculos();

        if(obstacleGroup.isTouching(trex)){
            muerte.play();
            gameState= "over";
        }

        }else if(gameState == "over"){
        //text ("Game Over",200,115);
        trex.velocityY = 0
        gameOver.visible = true;
        restart.visible = true;
        restart.depth = restart.depth+1;
        ground.velocityX = 0;
        
        obstacleGroup.setVelocityXEach(0);
        NubesGroup.setVelocityXEach(0);
        obstacleGroup.setLifetimeEach(-1);
        NubesGroup.setLifetimeEach(-1);
        /*trex.remove();
        ground.remove();
        obstacleGroup.remove();*/
        trex.changeAnimation ("collided");
        if(touches.lenght>0||keyDown("space")||mousePressedOver(restart)){
            reset();
            touches=[];
        }

    }

    //console.log(trex.y);
    trex.collide(invisibleGround);
    drawSprites();

}

function nubes(){
    if(frameCount%85==0){
      cloud= createSprite(650,100,40,10);
      cloud.addImage(nube);
      cloud.scale=1;
      cloud.velocityX=-4;
      cloud.y=Math.round(random(100,220));
      console.log(cloud);
      cloud.depth = trex.depth;
      trex.depth = trex.depth+1;
      //tiempo de vida
      cloud.lifetime = 250;
      NubesGroup.add(cloud);
    }
}

function keyDownEspacio(){
    if (gameState=="play"){
      ball.velocityX = 4;
      ball.velocityY = 4;
    }
  }

function aparecer_obstaculos(){
 if(frameCount%65 == 0){
    var obstacle1 = createSprite(550,height-50,10,30);
    obstacle1.velocityX=-4;

    var rando = Math.round(random(1,6));
    switch(rando){
     case 1: obstacle1.addImage(obstacle1Img);
             break;
    case 2: obstacle1.addImage(obstacle2Img);
             break;
    case 3: obstacle1.addImage(obstacle3Img);
             break;
    case 4: obstacle1.addImage(obstacle4Img);
             break;
    case 5: obstacle1.addImage(obstacle5Img);
             break;
    case 6: obstacle1.addImage(obstacle6Img);
             break;
    default:break;
    }
    obstacle1.lifetime = 250;
    obstacle1.scale = 0.4;
    obstacle1.depth = trex.depth;
    trex.depth = trex.depth+1;
    obstacleGroup.add(obstacle1);
 }
 
}

function reset(){
    gameState = "serve";
    obstacleGroup.destroyEach();
    NubesGroup.destroyEach();
    score = 0;
    trex.changeAnimation("running");
}   