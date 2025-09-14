import React, { useEffect, useState } from 'react';
import SocketProvider, { useSocket } from '../components/SocketProvider';
import PlayerPanel from '../components/PlayerPanel';
import WordInput from '../components/WordInput';
import WordHistory from '../components/WordHistory';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';

function GameInner() {
  const { socket } = useSocket();
  const [game, setGame] = useState(null);
  const [playerIndex, setPlayerIndex] = useState(-1);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('game:update', (g) => setGame({ ...g }));
    socket.on('system:message', (m) =>
      setMessages((prev) => [m, ...prev].slice(0, 5))
    );
    socket.on('player:index', ({ index }) => setPlayerIndex(index));
    socket.on('word:rejected', (data) => {
      let msg = 'Word rejected';
      if (data.reason === 'min-length') msg = 'Minimum 4 letters required.';
      if (data.reason === 'duplicate') msg = 'Word already used.';
      if (data.reason === 'start-letter-mismatch')
        msg = `Start letter mismatch. Expected: ${data.expected}`;
      setMessages((prev) => [{ text: msg }, ...prev].slice(0, 6));
    });

    socket.emit('game:get');

    return () => {
      socket.off('game:update');
      socket.off('system:message');
      socket.off('player:index');
      socket.off('word:rejected');
    };
  }, [socket]);

  function join(name) {
    if (!socket) return;
    socket.emit('join', { name });
  }

  function reset() {
    if (!socket) return;
    socket.emit('game:reset');
  }

  if (!game) return <div>Loading game…</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Main play area */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex gap-4 items-center justify-between">
          <PlayerPanel players={game.players} currentTurn={game.currentTurn} />
          <ScoreBoard players={game.players} />
        </div>

        <div className="bg-slate-50 p-4 rounded-lg shadow-inner">
          <WordHistory words={game.words} />
        </div>

        <WordInput socket={socket} disabled={playerIndex !== game.currentTurn} />

        <div className="mt-3 flex gap-3 items-center">
          <Timer
            turnSeconds={Number(import.meta.env.VITE_TURN_SECONDS || 20)}
            key={game.words.length}
          />
          <div className="flex-1">
            <div className="text-sm text-slate-500">Messages</div>
            <div className="space-y-1 mt-2">
              {messages.map((m, i) => (
                <div key={i} className="text-sm text-slate-700">
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Players</h3>
          <div className="mt-2 space-y-2">
            {game.players.map((p, i) => (
              <div key={i} className="flex justify-between">
                <div>{p.name}</div>
                <div className="text-slate-500">Score: {p.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Join / Rename</h3>
          <JoinForm onJoin={join} />
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">Controls</h3>
          <button className="btn w-full mt-2" onClick={reset}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

function JoinForm({ onJoin }) {
  const [name, setName] = useState('');
  return (
    <div>
      <input
        className="w-full input"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="mt-2 btn w-full"
        onClick={() => {
          onJoin(name || undefined);
          setName('');
        }}
      >
        Join
      </button>
    </div>
  );
}

export default function Game() {
  return (
    <SocketProvider>
      <GameInner />
    </SocketProvider>
  );
}
