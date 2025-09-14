const { Game, resetGame } = require('../models/Game');
const { validateWord } = require('../services/dictionaryService');

const TURN_SECONDS = Number(process.env.TURN_SECONDS || 20);

module.exports = function (io) {
  const ROOM = 'shiritori-room';

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    // Join game
    socket.on('join', ({ name }) => {
      socket.join(ROOM);
      socket.data.name = name || `Player-${socket.id.slice(0, 4)}`;

      if (Game.players.length < 2 && !Game.players.find(p => p.name === socket.data.name)) {
        Game.players.push({ name: socket.data.name, score: 0 });
      }

      io.to(ROOM).emit('game:update', Game);

      const idx = Game.players.findIndex(p => p.name === socket.data.name);
      socket.emit('player:index', { index: idx });
    });

    // Get current game state
    socket.on('game:get', () => {
      socket.emit('game:update', Game);
    });

    // Reset game
    socket.on('game:reset', () => {
      resetGame();
      io.to(ROOM).emit('game:update', Game);
      io.to(ROOM).emit('system:message', { text: 'Game has been reset.' });
    });

    // Submit word
    socket.on('word:submit', async ({ word }) => {
      word = String(word || '').trim().toLowerCase();

      const idx = Game.currentTurn;
      const player = Game.players[idx];
      if (!player) return;

      // Validation
      if (word.length < 4) {
        socket.emit('word:rejected', { reason: 'min-length' });
        return;
      }
      if (Game.words.includes(word)) {
        socket.emit('word:rejected', { reason: 'duplicate' });
        return;
      }
      if (Game.words.length > 0) {
        const last = Game.words[Game.words.length - 1];
        if (word[0] !== last[last.length - 1]) {
          socket.emit('word:rejected', {
            reason: 'start-letter-mismatch',
            expected: last[last.length - 1]
          });
          return;
        }
      }

      const valid = await validateWord(word);
      if (!valid) {
        player.score -= 1;
        Game.currentTurn = (idx + 1) % Game.players.length;
        io.to(ROOM).emit('game:update', Game);
        io.to(ROOM).emit('system:message', { text: `${player.name} used invalid word.` });
        return;
      }

      // Accepted word
      Game.words.push(word);
      player.score += 1;
      Game.currentTurn = (idx + 1) % Game.players.length;

      io.to(ROOM).emit('game:update', Game);
      io.to(ROOM).emit('system:message', { text: `${player.name} played "${word}"` });

      // Start turn timer
      setTimeout(() => {
        if (Game.currentTurn === (idx + 1) % Game.players.length) {
          const cur = Game.players[Game.currentTurn];
          if (cur) {
            cur.score -= 1;
            Game.currentTurn = (Game.currentTurn + 1) % Game.players.length;
            io.to(ROOM).emit('game:update', Game);
            io.to(ROOM).emit('system:message', { text: `${cur.name} timed out.` });
          }
        }
      }, TURN_SECONDS * 1000);
    });

    socket.on('disconnect', () => {
      console.log('disconnected', socket.id);
    });
  });
};
