const io = require('socket.io')();
import { init, loop, direction } from './game';
const FramesPerSecond = 10;
const state = {};
const clientRooms = {};

io.on('connection', client => {
  client.on('keydown', makeKeydown);
  client.on('newGame', makeNewGame);
  client.on('joinGame', makeJoinGame);

function drawid(length) {
    var resultn= '';
    var characters = 'abcdefghjiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  function makeJoinGame(roomCode) {
    const room = io.sockets.adapter.rooms[roomCode];
    let allSnakes;
    if (room) {
      allSnakes = room.sockets;
    }
    let numClients = 0;
    if (allSnakes) { numClients = Object.keys(allSnakes).length; }
    if (numClients === 0) { client.emit('unknownCode');
      return;
    } else if (numClients > 1) {
      client.emit('tooManyPlayers');
      return;
    }
    clientRooms[client.id] = roomCode;
    client.join(roomCode);
    client.number = 2;
    client.emit('init', 2);
    startGameInterval(roomCode);
  }

  function makeNewGame() {
    let roomCode = drawid(5);
    clientRooms[client.id] = roomCode;
    client.emit('gameCode', roomCode);
    state[roomCode] = init();
    client.join(roomCode);
    client.number = 1;
    client.emit('init', 1);
  }

  function makeKeydown(keyCode) {
    const roomCode = clientRooms[client.id];
    if (!roomCode) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch(e) {
      console.error(e);
      return;
    }

    const speed = direction(keyCode);

    if (speed) {
      state[roomCode].players[client.number - 1].speed = speed;
    }
  }
});

function startGameInterval(roomCode) {
  const intervalId = setInterval(() => {
    const winner = loop(state[roomCode]);
    
    if (!winner) {
      emitGameState(roomCode, state[roomCode])
    } else {
      emitGameOver(roomCode, winner);
      state[roomCode] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FramesPerSecond);
}

function emitGameState(room, gameState) {
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}

io.listen(process.env.PORT || 3000);