const GroundColor = '#00A405';
const FirstSnakeColor = '#475100';
const SecondSnakeColor = '#00FFB9';
const FoodColor = '#FF0000';
const socket = io('https://fierce-springs-58434.herokuapp.com/');
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);


function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 600;
  ctx.fillStyle = GroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.addEventListener('keydown', keydown);
  gameActive = true;
}

function keydown(e) {
  socket.emit('keydown', e.keyCode);
}

function drawGame(state) {
  ctx.fillStyle = GroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;
  ctx.fillStyle = FoodColor;
  ctx.fillRect(food.x * size, food.y * size, size, size);
  drawSnake(state.players[0], size, FirstSnakeColor);
  drawSnake(state.players[1], size, SecondSnakeColor);
}

function drawSnake(playerState, size, colour) {
  const snake = playerState.snake;
  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => drawGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert("C'est gagné!");
  } else {
    alert("Tu as perdu.");
  }
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Code inconnu')
}

function handleTooManyPlayers() {
  reset();
  alert('La partie a déjà commencé !');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
