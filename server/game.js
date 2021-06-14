const GridLength = 20;

export default { init, loop, direction, }
  
  // Executer l'affichage des differents elements du canvas
  function init() {
    const state = drawGame()
    randomapple(state);
    return state;
  }
  
  // Definition du serpent dans le canvas
  function drawGame() {
    return {
      players: [{
        pos: {
          x: 3,
          y: 10,
        },
        vel: {
          x: 1,
          y: 0,
        },
        snake: [
          {x: 1, y: 10},
          {x: 2, y: 10},
          {x: 3, y: 10},
        ],
      }, {
        pos: {
          x: 18,
          y: 10,
        },
        vel: {
          x: 0,
          y: 0,
        },
        snake: [
          {x: 20, y: 10},
          {x: 19, y: 10},
          {x: 18, y: 10},
        ],
      }],
      apple: {},
      gridsize: GridLength,
    };
  }
  
  // Definition de la boucle de jeu et des deux serpents
  function loop(state) {
    if (!state) {
      return;
    }
    const snakeOne = state.players[0];
    const snakeTwo = state.players[1];
    snakeOne.pos.x += snakeOne.vel.x;
    snakeOne.pos.y += snakeOne.vel.y;
    snakeTwo.pos.x += snakeTwo.vel.x;
    snakeTwo.pos.y += snakeTwo.vel.y;
  
    // Definition de la position actuelle de la tete du serpent
    if (snakeOne.pos.x < 0 || snakeOne.pos.x > GridLength || snakeOne.pos.y < 0 || snakeOne.pos.y > GridLength) {
      return 2;
    }
    if (snakeTwo.pos.x < 0 || snakeTwo.pos.x > GridLength || snakeTwo.pos.y < 0 || snakeTwo.pos.y > GridLength) {
      return 1;
    }
    if (state.apple.x === snakeOne.pos.x && state.apple.y === snakeOne.pos.y) {
      snakeOne.snake.push({ ...snakeOne.pos });
      snakeOne.pos.x += snakeOne.vel.x;
      snakeOne.pos.y += snakeOne.vel.y;
      randomapple(state);
    }
    if (state.apple.x === snakeTwo.pos.x && state.apple.y === snakeTwo.pos.y) {
      snakeTwo.snake.push({ ...snakeTwo.pos });
      snakeTwo.pos.x += snakeTwo.vel.x;
      snakeTwo.pos.y += snakeTwo.vel.y;
      randomapple(state);
    }
    if (snakeOne.vel.x || snakeOne.vel.y) {
      for (let cell of snakeOne.snake) {
        if (cell.x === snakeOne.pos.x && cell.y === snakeOne.pos.y) {
          return 2;
        }
      }
      snakeOne.snake.push({ ...snakeOne.pos });
      snakeOne.snake.shift();
    }
    if (snakeTwo.vel.x || snakeTwo.vel.y) {
      for (let cell of snakeTwo.snake) {
        if (cell.x === snakeTwo.pos.x && cell.y === snakeTwo.pos.y) {
          return 1;
        }
      }
      snakeTwo.snake.push({ ...snakeTwo.pos });
      snakeTwo.snake.shift();
    }
    return false;
  }
  
  // Definition de la position de la pomme
  function randomapple(state) {
    apple = {
      x: Math.floor(Math.random() * GridLength),
      y: Math.floor(Math.random() * GridLength),
    }
  
    for (let cell of state.players[0].snake) {
      if (cell.x === apple.x && cell.y === apple.y) {
        return randomapple(state);
      }
    }
    for (let cell of state.players[1].snake) {
      if (cell.x === apple.x && cell.y === apple.y) {
        return randomapple(state);
      }
    }
    state.apple = apple;
  }
  
  // Definition des controles du serpent (Avec les fleches et avec ZQSD)
  function direction(event){
    let key = event.keyCode;
    if (key == 37 | key == 68 & control != "RIGHT") {
        control = "LEFT";
        } else if (key == 38 | key == 83 & control != "DOWN") {
        control = "UP";
        } else if (key == 39 | key == 81 & control != "LEFT") {
        control = "RIGHT";
        } else if (key == 40 | key == 90 & control != "UP") {
        control = "DOWN";
        }
    }