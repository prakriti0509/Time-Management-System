'use client';
import { applySchedule } from '@/app/actions';

export function DraftMyDayButton() {
  async function run() {
    const res = await fetch('/api/ai/draft-day', { method: 'POST' });
    const { plan } = await res.json();
    await applySchedule(plan);
  }
  return (
    <button onClick={run} className="rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 text-white px-3 py-2 text-sm inline-flex items-center gap-2">
      Draft my day
    </button>
  );
}
