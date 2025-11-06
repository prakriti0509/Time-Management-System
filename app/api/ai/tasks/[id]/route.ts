import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const task = await prisma.task.update({
    where: { id: params.id },
    data: { status: { set: "DONE" } },
  });
  return NextResponse.json(task);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

