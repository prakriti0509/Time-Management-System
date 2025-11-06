'use client';
import { useState } from 'react';

export function NotesToTasks() {
  const [notes, setNotes] = useState('');
  async function run() {
    if (!notes.trim()) return;
    await fetch('/api/ai/notes-to-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    setNotes('');
    location.reload();
  }
  return (
    <div className="flex gap-2">
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Paste meeting notes…" className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 p-3" />
      <button onClick={run} className="rounded-xl px-3 py-2 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 text-white">Convert</button>
    </div>
  );
}

