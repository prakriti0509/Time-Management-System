import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const project = url.searchParams.get("project") || undefined;
  const status = url.searchParams.get("status") || undefined;

  const tasks = await prisma.task.findMany({
    where: {
      status: status === "DONE" ? "DONE" : undefined,
      project: project ? { name: project } : undefined,
    },
    orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      title: body.title,
      priority: body.priority ?? "MEDIUM",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
