const axios = require('axios');

const DICT_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

async function validateWord(word) {
  try {
    const res = await axios.get(`${DICT_URL}${encodeURIComponent(word.toLowerCase())}`);
    return !!(res.data && res.data.length > 0);
  } catch {
    return false; // dictionary API returns 404 if not found
  }
}

module.exports = { validateWord };
