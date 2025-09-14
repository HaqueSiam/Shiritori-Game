import React from 'react';

export default function ScoreBoard({ players = [] }) {
  return (
    <div className="text-right">
      {players.map((p, i) => (
        <div key={i} className="text-sm">
          <span className="font-medium">{p.name}</span> :{' '}
          <span className="text-indigo-600">{p.score}</span>
        </div>
      ))}
    </div>
  );
}
