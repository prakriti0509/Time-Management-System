"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const taskInput = z.object({
  title: z.string().min(1),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),             // ISO
  priority: z.enum(["LOW","MEDIUM","HIGH"]).default("MEDIUM"),
  notes: z.string().optional(),
  effortMins: z.coerce.number().optional(),
});

export async function createTask(form: FormData) {
  const parsed = taskInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) throw new Error("Invalid task");
  const d = parsed.data;
  await prisma.task.create({
    data: {
      title: d.title,
      projectId: d.projectId || null,
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      priority: d.priority,
      notes: d.notes ?? "",
      effortMins: d.effortMins,
    },
  });
  revalidatePath("/");
}

export async function quickAdd(title: string) {
  if (!title.trim()) return;
  await prisma.task.create({ data: { title } });
  revalidatePath("/");
}

export async function toggleTask(id: string) {
  const t = await prisma.task.findUnique({ where: { id } });
  if (!t) return;
  await prisma.task.update({
    where: { id },
    data: { status: t.status === "DONE" ? "OPEN" : "DONE" },
  });
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/");
}

export async function reorder(idsInOrder: string[]) {
  await Promise.all(idsInOrder.map((id, i) =>
    prisma.task.update({ where: { id }, data: { orderIndex: i } })
  ));
  revalidatePath("/");
}

// used by AI “Draft my day”
export async function applySchedule(plan: { id: string; start: string; end: string; }[]) {
  await Promise.all(plan.map(p =>
    prisma.task.update({
      where: { id: p.id },
      data: { notes: `Scheduled ${new Date(p.start).toLocaleTimeString()}–${new Date(p.end).toLocaleTimeString()}` }
    })
  ));
  revalidatePath("/");
}
