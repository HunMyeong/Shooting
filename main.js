//캔버스 세팅
let canvas; //캔버스
let ctx;    //그림 그려줄 것
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")  
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver=false; // true이면 끝나고, flase면 진행중
let score = 0;


//우주선 좌표
let spaceshipX = canvas.width/2-32;  //그냥 값을 써도 됨.
let spaceshipY = canvas.height-64;




let bulletList = [];    //총알 저장 리스트
function bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX + 8;
        this.y = spaceshipY;
        this.alive = true // true면 살아있는 총알 false면 죽은 총알

        bulletList.push(this)
    };

    this.update = function(){
        this.y-=5;  //총알속도?
    };

    this.checkHit = function(){
        for(let i=0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x>=enemyList[i].x && this.x <= enemyList[i].x+40 && this.alive == true){
                //총알이 사라짐 그리고 점수 획득
                score++;
                this.alive = false; //죽은총알
                enemyList.splice(i, 1);
            }
        }
    }
}

function generatRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList=[];
function enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 50;
        this.x = generatRandomValue(0,canvas.width-60);
        enemyList.push(this);
    };
    this.update=function(){
        this.y += 2;    //적군 속도 조절

        if(this.y >= canvas.height-60){
            gameOver = true;
            console.log("gameOver");
        }
    }
}



function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/backgroundImage.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceshipImage.png";

    bulletImage = new Image();
    bulletImage.src="images/bulletImage.png";

    enemyImage = new Image();
    enemyImage.src="images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src="images/gameOver.gif";
}

let keysDown={};

function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){


        keysDown[event.keyCode] = true
        console.log("키다운객체에 들어간 값은?", keysDown);
    });
    document.addEventListener("keyup", function(){
        delete keysDown[event.keyCode]
        if(event.keyCode == 32){
            createBullet()  // 총알 생성
        }
    });
}

function createBullet(){
    console.log("총알 생성!");
    let b = new bullet();    //총알 하나 생성
    b.init();
    console.log("새로운 총알 리스트", bulletList);
}

function createEnemy(){ //적군 생성
    const interval = setInterval(function(){
        let e = new enemy();
        e.init()
    },1000) //호출하고싶은 함수, 시간 밀리세컨드
}

function update(){
    if( 39 in keysDown){
        spaceshipX += 4;    //우주선 이동속도
    } //right
    if ( 37 in keysDown){
        spaceshipX -= 4;
    } //left

    if(spaceshipX <= 0){
        spaceshipX = 0;
    }

    if(spaceshipX >= canvas.width - 64){
        spaceshipX = canvas.width - 64;
    }

    //우주선의 좌표값이 무한대로 업데이트 되지 않고 컨버스 안에서만 작동하게하기.

    //총알의 y좌표 업데이트하는 함수 호출
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
        if(!gameOver){
            update();   //좌표값을 업데이트하고
            render();   //그려준다.
            requestAnimationFrame(main); //미친듯이 출력해줌 (main)을
        }else{
            ctx.drawImage(gameOverImage,0,100,canvas.width,300); //x,y,사진크기x,y
        }
}

bulletRemove();
loadImage();
setupKeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고
// 다시 render를 그려준다.


//총알 만들기
//1. 스페이스바를 누르면 총알 발사
//2. 발사 = Y값이 --  ,  총알의 시작 값은 우주선의 x,y값
//3. 발사된 총알들은 총알 배열에 저장한다.
//4. 총알들은 x,y좌표값이 있어야한다.
//5. 총알 배열을 render로 그려준다.



//적군 만들기
//x,y, init, update
//생성 위치 랜덤
//아래로 내려와야함 y의 값이 증가해야함
//적이 바닥에 닿으면 게임오버
//총알이 닿으면 사라지고 1점


//적군이 죽는다.
//총알.y <= 적군.y and
//총알.x >= 적군.x and 총알.x <= 적군.x + size
//  => 닿았다.
//총알과 적군이 사라지면서 점수 획득



//끝에 닿은 총알 제거하기 (y의 값이 0이되면 총알의 효과가 사라져야함.)
function bulletRemove() {
    for(i=0; bulletList.length; i++){
        if(bulletList[i].y == 5){
            bulletList[i].splice(i,1);
        }
    }
}