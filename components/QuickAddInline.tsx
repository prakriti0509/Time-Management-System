'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quickAdd as quickAddAction } from '@/app/actions';

export function QuickAddInline() {
  const [t, setT] = useState('');
  const router = useRouter();
  async function run() {
    if (!t.trim()) return;
    await quickAddAction(t);
    setT('');
    router.refresh();
  }
  return (
    <div className="flex items-center gap-2">
      <input
        value={t}
        onChange={(e)=>setT(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && run()}
        placeholder="Add a task…"
        className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-sm"
      />
      <button 
        onClick={run} 
        className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        Quick Add
      </button>
    </div>
  );
}
