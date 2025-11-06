'use client';
import { reorder } from '@/app/actions';

export function PrioritizeLink() {
  async function run() {
    const res = await fetch('/api/ai/prioritize', { method: 'POST' });
    const { ordered } = await res.json();
    await reorder(ordered);
  }
  return <button onClick={run} className="underline text-indigo-600 dark:text-indigo-400 ml-1">Try it</button>;
}
