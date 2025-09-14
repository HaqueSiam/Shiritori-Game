import React, { useEffect, useState } from 'react';

export default function Timer({ turnSeconds = 20 }) {
  const [sec, setSec] = useState(turnSeconds);

  useEffect(() => {
    setSec(turnSeconds);
    const t = setInterval(() => setSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [turnSeconds]);

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm text-center">
      <div className="text-xs text-slate-500">Turn Time</div>
      <div className="text-xl font-semibold timer-digit">{sec}s</div>
    </div>
  );
}
