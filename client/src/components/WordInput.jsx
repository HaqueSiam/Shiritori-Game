import React, { useState } from 'react';

export default function WordInput({ socket, disabled }) {
  const [word, setWord] = useState('');

  function submit(e) {
    e?.preventDefault();
    if (!word.trim()) return;
    socket.emit('word:submit', { word: word.trim() });
    setWord('');
  }

  return (
    <form onSubmit={submit} className="flex gap-3 items-center">
      <input
        className="input flex-1"
        placeholder={disabled ? 'Not your turn' : 'Enter next word (min 4 letters)'}
        value={word}
        onChange={(e) => setWord(e.target.value)}
        disabled={disabled}
      />
      <button className="btn" disabled={disabled}>
        Submit
      </button>
    </form>
  );
}
