const express = require('express');
const router = express.Router();
const { getGame, reset } = require('../controllers/gameController');

router.get('/game', getGame);   // optional
router.post('/reset', reset);   // optional

module.exports = router;
