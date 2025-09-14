const { Game, resetGame } = require('../models/Game');

// REST endpoints kept for debugging (optional)

function getGame(req, res) {
  res.json(Game);
}

function reset(req, res) {
  resetGame();
  res.json(Game);
}

module.exports = { getGame, reset };
