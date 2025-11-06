import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function TaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let task: any = null;
  try {
    task = await prisma.task.findUnique({ where: { id } });
  } catch {}

  if (!task) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-4"><Link href="/" className="text-sm text-blue-600">← Back</Link></div>
        <div className="rounded-xl border p-6">
          <div className="text-lg font-medium">Task not found</div>
          <div className="text-sm text-zinc-500 mt-1">The task may have been deleted.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4"><Link href="/" className="text-sm text-blue-600">← Back</Link></div>
      <div className="rounded-xl border p-6 space-y-3">
        <div className="text-2xl font-semibold">{task.title}</div>
        <div className="text-sm text-zinc-500">Priority: {task.priority}</div>
        <div className="text-sm text-zinc-500">Status: {task.status}</div>
        <div className="text-sm text-zinc-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No date"}</div>
        {task.notes && (<div className="text-sm whitespace-pre-wrap">{task.notes}</div>)}
      </div>
    </div>
  );
}


