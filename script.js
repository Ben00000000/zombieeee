const joystickZone = document.getElementById('joystick');
let playerX = window.innerWidth / 2;
let playerY = window.innerHeight - player.offsetHeight; // Set player at the bottom
let isHPDecreasing = false;
let speed = 0.5;
const bullets = [];
let enemiesRemoved = 0;
let currentStage = 1;



const idleSpriteURL = 'https://raw.githubusercontent.com/Ben00000000/asstes/main/soldier.png';
const runSpriteURL = 'https://raw.githubusercontent.com/Ben00000000/asstes/main/spritesheet%20(40)%20(1).png';

const downSpriteURL = 'https://raw.githubusercontent.com/Ben00000000/asstes/main/spritesheet%20(40)%20(1).png';

const upSpriteURL = 'https://raw.githubusercontent.com/Ben00000000/asstes/main/spritesheet%20(40)%20(1).png';


setPlayerSprite(idleSpriteURL);

player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

const manager = nipplejs.create({
  zone: joystickZone,
  color: 'gray',
  multitouch: true,
});

let joystickAngle = 0;
let isJoystickActive = false;

manager.on('move', handleJoystickMove);
manager.on('start', handleJoystickStart);
manager.on('end', handleJoystickEnd);

function handleJoystickMove(event, nipple) {
  const angle = nipple.angle.radian;
  const moveX = Math.cos(angle) * speed;
  const moveY = Math.sin(angle) * speed;
  const invertedMoveY = -moveY;

  playerX += moveX;
  playerY += invertedMoveY;

  playerX = Math.min(Math.max(playerX, 0), window.innerWidth - player.offsetWidth + 1000);
  playerY = Math.min(Math.max(playerY, 0), window.innerHeight - player.offsetHeight);

  updatePlayerPosition();
  if (isJoystickActive && Math.random() < 0.05) {
    createBullet();
  }
  // Check the direction of movement and set the appropriate sprite
  if (Math.abs(moveY) > Math.abs(moveX)) {
    // Moving vertically more than horizontally
    if (moveY > 0) {
      // Moving down
      setPlayerSprite(upSpriteURL);
    } else {
      // Moving up
      setPlayerSprite(downSpriteURL);
    }
  } else {
    // Moving horizontally more than vertically

    setPlayerSprite(runSpriteURL);
  }

  joystickAngle = angle;
}


function handleJoystickStart() {
  isJoystickActive = true;
  gameLoop();
  setPlayerSprite(runSpriteURL);

 
 
    canEnemyDamagePlayer = true;

}

function handleJoystickEnd() {
  isJoystickActive = false;
  setPlayerSprite(idleSpriteURL);
}

function setPlayerSprite(spriteURL) {
  player.style.backgroundImage = `url('${spriteURL}')`;
}

function updatePlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
}


const enemies = [];

function createEnemy(direction) {
  const enemy = document.createElement('div');
  enemy.className = 'enemy';

  // Always spawn enemies at the top
  enemy.style.top = '0';

  // Set the initial left position to a random value within the window width
  enemy.style.left = `${Math.random() * window.innerWidth}px`;

  // Set the direction property for the enemy
  enemy.direction = direction || 'down';

  document.body.appendChild(enemy);
  enemies.push(enemy); // Add the enemy to the array

  return enemy;
}


function moveEnemyTowardsPlayer(enemy, playerX, playerY) {
  const enemyX = parseFloat(enemy.style.left) || 0;
  const enemyY = parseFloat(enemy.style.top) || 0;

  const angle = Math.atan2(
    playerY + player.offsetHeight / 2 - (enemyY + enemy.offsetHeight / 2),
    playerX + player.offsetWidth / 2 - (enemyX + enemy.offsetWidth / 2)
  );

  const moveX = Math.cos(angle) * speed * 0.3;
  const moveY = Math.sin(angle) * speed * 0.3;

  enemy.style.left = `${enemyX + moveX}px`;
  enemy.style.top = `${enemyY + moveY}px`;

  // Check the vertical movement direction and apply the flip class
  if (moveY < 0) {
    enemy.classList.add('flipped-vertical');
  } else {
    enemy.classList.remove('flipped-vertical');
  }
}



function createBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  
  // Set the bullet's initial position to the center of the player's top
  bullet.style.left = `${playerX+ 15 + player.offsetWidth / 2}px`;
  bullet.style.top = `${playerY}px`;

  document.body.appendChild(bullet);
  bullets.push(bullet);
}

function moveBullets() {
  bullets.forEach((bullet, index) => {
    const bulletY = parseFloat(bullet.style.top) || 0;
    const bulletSpeed = 5; // Adjust the bullet speed as needed

    bullet.style.top = `${bulletY - bulletSpeed}px`;

    // Remove bullets that go off-screen
    if (bulletY < 0) {
      bullets.splice(index, 1);
      document.body.removeChild(bullet);
    }
  });
}

function updateStage() {
  if (enemiesRemoved >= 30 && currentStage === 1) {
    // Change to Stage Two and update the background
    currentStage = 2;
    document.querySelector('.game-container').style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/Top%20down%20Place2.png')";
    // Show a red text for a few seconds
    showStageText("Stage Two", "red", 3000);
  } else if (enemiesRemoved >= 40 && currentStage === 2) {
    // Change to Stage Three and update the background
    currentStage = 3;
    document.querySelector('.game-container').style.backgroundImage = "url('https://raw.githubusercontent.com/Ben00000000/asstes/main/Top%20down%20Place3.png')";
    // Show a blue text for a few seconds
    showStageText("Stage Three", "blue", 3000);
  }
}

function showStageText(text, color, duration) {
  const stageText = document.createElement('div');
  stageText.textContent = text;
  stageText.style.color = color;
  stageText.style.fontSize = "40px";
  stageText.style.position = "absolute";
  stageText.style.top = "50%";
  stageText.style.left = "50%";
  stageText.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(stageText);

  // Remove the text after the specified duration
  setTimeout(() => {
    document.body.removeChild(stageText);
  }, duration);
}

function gameLoop() {
  if (isJoystickActive) {
    const moveX = Math.cos(joystickAngle) * speed;
    const moveY = Math.sin(joystickAngle) * speed;
    const invertedMoveY = -moveY;

    playerX += moveX;
    playerY += invertedMoveY;

    playerX = Math.min(Math.max(playerX, 0), window.innerWidth - player.offsetWidth);
    playerY = Math.min(Math.max(playerY, 0), window.innerHeight - player.offsetHeight);
  }
    if (Math.random() < 0.001) {
      const enemy = createEnemy();

      function move() {
        moveEnemyTowardsPlayer(enemy, playerX, playerY);
        requestAnimationFrame(move);
      }

      move();

      // Add a delay (e.g., 1000 milliseconds) before creating a new enemy
      setTimeout(function () {
        // Call the code to create a new enemy after the delay
        if (Math.random() < 0.1) {
          const newEnemy = createEnemy();
          moveEnemyTowardsPlayer(newEnemy, playerX, playerY);
        }
      }, 5000);
    }
 updateStage();
  checkBulletEnemyCollision();
   // Move bullets
  moveBullets();
    requestAnimationFrame(gameLoop);
}



function checkBulletEnemyCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    const bulletRect = bullet.getBoundingClientRect();

    enemies.forEach((enemy, enemyIndex) => {
      const enemyRect = enemy.getBoundingClientRect();

      // Simple axis-aligned bounding box (AABB) collision detection
      if (
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top &&
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left
      ) {
        // Collision detected
        // Remove the bullet and enemy from the DOM and arrays
        bullets.splice(bulletIndex, 1);
        document.body.removeChild(bullet);

        enemies.splice(enemyIndex, 1);
        document.body.removeChild(enemy);

        // Increment the counter
        enemiesRemoved++;
console.log(`Enemies Removed: ${enemiesRemoved}`);


        // Add any additional logic for the collision event
      }
    });
  });
}



gameLoop();