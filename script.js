//Define the context of the game
let ctx = canvas.getContext('2d');

//Set canvas height and width to take the full height and width of the browser window
canvas.width = innerWidth;
canvas.height = innerHeight;

let spacePressed = false;

// Create an array to store all the songs used in the game
// Do note that the songs are created in html using the html tag while the id is referenced in the Javsacript. I mean in this part of the code
// We bnow create the collection of the array
let musicArray = [laba, blinding];
let music= musicArray[Math.floor(Math.random() * musicArray.length)];

// Create an array to hold all the level in the ui with their id given in the html code
let levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];

//Create an addEventListener to handle the canvas height and width when the browser resizes

addEventListener("resize", ()=>{
    canvas.height = innerHeight;
    canvas.width = innerWidth;
});

addEventListener("keydown", (e)=>{
    if (e.code === 'Space') spacePressed = true;
});

addEventListener('click', ()=>{
//    if (spacePressed) {
//      spacePressed = false;  
//    } else {
//      spacePressed = true;  
//    }
    
    bird.flapClick();
    
    console.log(spacePressed)
})

addEventListener("keyup", (e)=>{
    if (e.code === 'Space') spacePressed = false;
});

menuPlayBtn.addEventListener("click", ()=>{
    canvas.classList.remove("hideCanvas");
    canvas.style.zIndex = -1;
    canvas.style.display = "block";
    header.style.display = "none";
    container.style.display = "none";
    scoreBoard.style.display = "flex";
    score = 0;
    realScore.innerText = score;
    particlesArray = [];
    animate();
    musicArray = [laba, blinding];
    music= musicArray[Math.floor(Math.random() * musicArray.length)];
    music.play();
})

//Create all the important variables that will be used in the game

let angle = 0;
let hue = 0;
let frame = 0;
let score =0;
let gameLevel = 1;
let gameSpeed = 2;
let life = 100;

// Create a variable to define all the parametrs that will be used to generate game objects
let particlesArray  = [];
let obstaclesArray = [];

//This is a class to handle all the background of the game
class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = innerWidth;
        this.height = innerHeight;
//        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    
    //    Method that updates the background to give it a moving effect
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0; //this.width + this.x2 - this.speed;
        }
        
        //  Reset the x values of the images in the game
        this.x = Math.floor(this.x - this.speed);
    }
    //    Method to draw the background image to the canvas
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

//Create classes for all the game objects
//Create a class for the bird class
class Bird {
    constructor() {
        this.x = 0;
        this.y = 200;
        this.vy = 0;
        this.width = 80;
        this.height = 80;
        this.weight = 1;
        this.sprite = 0;
        this.imageArray = [bird1, bird2, bird3, bird4];
        this.image = this.imageArray[this.sprite];
    }
    
    //Create a method to update the bird element
    update() {
        let curve = Math.sin(angle) * 10;
        if (this.y > canvas.height - this.height + curve) {
            this.y = canvas.height - this.height + curve;
            this.vy = 0;
        } else {
            this.vy += this.weight;
            this.vy *= 1;
            this.y += this.vy;
        }
        
        if (this.y <= 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.sprite < 3) {
            this.sprite++;
        } else {
            this.sprite = 0;
        }
        
        if (this.x + this.width > canvas.width) {
            this.x = 0;
        }
        
        this.image = this.imageArray[this.sprite];
        this.x += gameSpeed;
        
        
        if (spacePressed || this > this.height) this.flap();
    }
    
    //Create a method to draw the bird to the canvas
    draw() {
        ctx.fillStyle = "hsl(" + hue + ", 100%, 50%, 1)";
        ctx.beginPath();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.fill();
    }
    
    //Create a function in the bird class to allow for the flapping of the bird upward
    flap() {
        this.vy -= 5;
    }
    
    flapClick() {
        this.vy -= 10;
    }
}

const bird = new Bird();

// Create a class for the enemy bird which is black in color
class EnemyBird {
    constructor() {
        this.x = canvas.width;
        this.y = Math.random() * canvas.height;
        this.image = enemyBirdSprite;
        this.width = 200.333;
        this.height = 200.333;;
        this.frameX = 1;
        this.frameY = 1;
        this.maxFrame = 7;
        this.fps = 1000;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
    }
    
    // create a method in the class to handle the drawing of the enemy bird
    draw() {
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width / 2, this.height/ 2);
    }
    
    update() {
            //Handle moving of birds in the sky
            this.x += 10;
            
            //Handle the frame animation for the bird
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer++;
            }
            
            //Check if the enemy has gone away from the screen and delete it
            if (this.x + this.width / 2 > canvas.width + 100) {
                die.play();
                this.x = 0;
                this.y = Math.random() * canvas.height;
            }
        }
}

let enemyBirds = new EnemyBird();

// Create a class for the gemeration of the particles of the game
class Particle {
    constructor() {
        this.x = bird.x;
        this.y = bird.y + bird.height / 2;
        this.size = Math.random() * 7 + 3;
        this.speedY = (Math.random() * 1) - 0.5;
        this.color = "hsla(" + hue + ", 100%, 50%, 0.8)";
    }

    // Create a class to update the position of each particle
    update() {
        this.x -= gameSpeed;
        this.y += this.speedY;
    }

    // Create a function in the class to draw the particles to the screen
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// create a new class for the obstacles in the game which are in the form of pipes
class Obstacles {
    constructor() {
        this.top =  (Math.random() * canvas.height/3) + 50;
        this.bottom =  (Math.random() * canvas.height/3) + 50;
        this.x = canvas.width;
        this.width = 80;
        this.color1 = "hsla(" + hue + ", 100%, 50%, 1)";
        this.color2 = "black"
        this.colorChosen = [this.color1, this.color2];
        this.color = this.colorChosen[Math.floor(Math.random() * this.colorChosen.length)];
        this.counted = false;
    }
    
    //Create a method to draw the obstacles on the screen
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    
    // Create a method to uodate and simulate the movements of the obstacle
    update() {
        this.x -= gameSpeed * 5;
        
        // Calculate the scores from the scoreBoard
        
        if (!this.counted && this.x + this.width < bird.x) {
            this.counted = true;
            score++;
            realScore.innerText = score;
        }
        this.draw();
    }
}

const background = new Layer(backgroundImage, 6.5);

function handleObstacles() {
    if (frame%20 === 0) {
        obstaclesArray.unshift(new Obstacles);
    }
    
    for (i = 0; i < obstaclesArray.length; i++) {
        obstaclesArray[i].update();
    }
    
    if (obstaclesArray.length > 20) {
        obstaclesArray.pop(obstaclesArray[0]);
    }
}



// Create a function to handle all the generative particles
function handleParticles() {
    // Add particle to the beginning of the array
    particlesArray.unshift(new Particle);
    //Use a for loop to assign the draw and update method to the particle instance of the Particle class
    for (i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    if (particlesArray.length > 200) {
        for (let i = 0; i < 20; i++) {
            particlesArray.pop(particlesArray[i]);
        }
    }
}

function handleCollisions() {
    for (let i = 0; i < obstaclesArray.length; i++) {
        if (bird.x < obstaclesArray[i].x + obstaclesArray[i].width && bird.x + bird.width > obstaclesArray[i].x && ((bird.y < 0 + obstaclesArray[i].top && bird.y + bird.height > 0) || (bird.y + bird.height - 10 > canvas.height - obstaclesArray[i].bottom && bird.y + bird.height < canvas.height))) {
            //Collision detected
            return true;
        }
    }
}

// Create a function that increases the game speed at certain intervals
function incrementSpeed() {
    if (gameSpeed >= 12) {
        gameSpeed = gameLevel;
    }
    // Always add 0.01 to the game speed every time animate function is called
    gameSpeed += 0.01;
    // Make sure that the ui holds the value of the game speed
    realSpeed.innerText = Math.floor(gameSpeed);
}

//Create a for each loop on the levels array
// Its function is to add an addVeenListener to each level button in the levels container which is in the html ui
// All the id's of each level button is stored in an array called levels 
levels.forEach((level, levelIndex) => {
    level.addEventListener("click", ()=> {
        gameLevel = levelIndex + 1;
        gameSpeed = gameLevel;
        realSpeed.innerText = gameLevel;
        const Toast = swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer)
                toast.addEventListener("mouseleave", Swal.resumeTimer)
            }
        });
        
        Toast.fire({
            title: "Level " + (levelIndex + 1) + " activated",
            animation: true,
            icon: "success",
            customClass: "padSmall"
        });
    })
})




//Create a function that animate all the elements in the game
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleCollisions();
    if (handleCollisions()) {
        life -= gameLevel;
        lifeLoader.style.width = life + "%";
        dying.play();
    }
    if (life <= 0) {
        body.style.color = "black";
        gameOverSound.play();
        swal.fire({
        title: "Game Over",
        footer: "Powered by Henqsoft Solutions",
        html: `<hr><b class="scoreVal">Score: ${score}</b><br><small>You were not able to avoid the obstacles. Try to fly accurately next time</small>`,
        icon:"error",
        preDeny: 5000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonColor:"tomato",
        footer:"Powered By Henqsoft solutions"
        }).then(willProceed =>{
            canvas.style.display = "none";
            scoreBoard.style.display = "none";
            container.style.display = "flex";
            header.style.display = "flex";
            score = 0;
            life = 100;
            lifeLoader.style.width = life + "%";
            obstaclesArray = [];
            bird.x = 0;
            bird.y = canvas.height / 2;
            music.pause();
            musicArray = [];
        });
        
    } else {
        requestAnimationFrame(animate);
    }
    background.draw();
    background.update();
    ctx.fillStyle = "red";
    ctx.font = "20px cambria";
    ctx.strokeText("Keep clicking on the screen to flap the bird or Hit the spacebar to also flap", canvas.width / 2 - 300, canvas.height / 2); 
    handleObstacles();
    bird.update();
    bird.draw();
    handleParticles();
    angle+= 0.12;
    hue++;
    frame++;
    enemyBirds.draw();
    enemyBirds.update();
    realSpeed.innerText = gameSpeed;
    incrementSpeed();
}

if (container.style.display !== "none") {
    images.style.display = "none";
}




