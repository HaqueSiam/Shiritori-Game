// In-memory game state (no DB)
const Game = {
  players: [],      // [{ name, score }]
  words: [],
  currentTurn: 0
};

function resetGame() {
  Game.players = [];
  Game.words = [];
  Game.currentTurn = 0;
}

module.exports = { Game, resetGame };
