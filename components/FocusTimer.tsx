'use client';
import { useEffect, useRef, useState } from 'react';

export function FocusTimer({ minutes = 25 }: { minutes?: number }) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const pct = ((minutes * 60 - remaining) / (minutes * 60)) * 100;
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div>
      <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-zinc-500">{mm}:{ss} remaining</div>
        <button onClick={() => setRunning(r => !r)} className="rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 text-white px-3 py-2 text-sm">
          {running ? 'Pause' : 'Start Focus'}
        </button>
      </div>
    </div>
  );
}
