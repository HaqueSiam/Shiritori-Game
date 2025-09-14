import React from 'react';

export default function WordHistory({ words = [] }) {
  if (words.length === 0)
    return <div className="text-slate-500">No words yet — start the game.</div>;

  return (
    <div>
      <h3 className="font-semibold mb-2">Word History</h3>
      <div className="grid grid-cols-2 gap-2">
        {words
          .slice()
          .reverse()
          .map((w, i) => (
            <div key={i} className="p-2 bg-white rounded-md shadow-sm">
              {w}
            </div>
          ))}
      </div>
    </div>
  );
}
