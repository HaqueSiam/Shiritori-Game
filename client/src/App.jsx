import React from 'react';
import Game from './pages/Game';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-800">Realtime Shiritori Game</h1>
          <p className="text-sm text-slate-500 mt-1">
            Play Shiritori live with another player. Beautiful UI with WebSockets only.
          </p>
        </header>
        <main className="bg-white rounded-2xl shadow-md p-6">
          <Game />
        </main>
      </div>
    </div>
  );
}
