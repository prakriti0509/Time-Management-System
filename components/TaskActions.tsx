'use client';
import { useRouter } from 'next/navigation';
import { deleteTask, toggleTask } from '@/app/actions';

export function TaskActions({ id, status }: { id: string; status: 'OPEN' | 'DONE' }) {
  const router = useRouter();
  
  async function onToggle() {
    await toggleTask(id);
    router.refresh();
  }
  async function onDelete() {
    await deleteTask(id);
    router.refresh();
  }
  return (
    <div className="flex items-center gap-2">
      <button onClick={onToggle} className="rounded-lg px-2 py-1 text-xs border hover:bg-zinc-100 dark:hover:bg-zinc-800">
        {status === 'DONE' ? 'Reopen' : 'Done'}
      </button>
      <button onClick={onDelete} className="rounded-lg px-2 py-1 text-xs border text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
        Delete
      </button>
    </div>
  );
}


