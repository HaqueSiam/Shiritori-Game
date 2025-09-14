import React from 'react';

export default function PlayerPanel({ players = [], currentTurn = 0 }) {
  return (
    <div className="flex gap-3">
      {players.map((p, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg border ${
            i === currentTurn
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="text-sm text-slate-600">
            {i === currentTurn ? 'Playing' : 'Waiting'}
          </div>
          <div className="font-medium">{p.name}</div>
        </div>
      ))}
    </div>
  );
}
