import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { openai, aiEnabled } from "@/lib/ai";
import { addMinutes } from "date-fns";

export async function POST() {
  if (!aiEnabled) {
    return NextResponse.json({ plan: [] });
  }
  const tasks = await prisma.task.findMany({
    where: { status: "OPEN" },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { createdAt: "asc" }],
    take: 20,
  });

  const sys = `Plan today's schedule. Return JSON: {items:[{id,title,estimateMins,start,end}]}. Use now as baseline; fallback estimate 30.`;
  const user = { now: new Date(), tasks: tasks.map(t => ({
    id:t.id, title:t.title, priority:t.priority, dueDate:t.dueDate, estimateMins:t.effortMins ?? 30
  })) };

  try {
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{ role:"system", content: sys }, { role:"user", content: JSON.stringify(user) }],
      response_format: { type: "json_object" },
    } as any);
    const text = (res.output[0] as any).content[0].text;
    const { items } = JSON.parse(text);
    return NextResponse.json({ plan: items ?? [] });
  } catch {
    // simple linear fallback
    let cursor = new Date();
    const plan = tasks.slice(0,6).map(t => {
      const start = cursor;
      const end = addMinutes(cursor, t.effortMins ?? 30);
      cursor = end;
      return { id:t.id, title:t.title, estimateMins:t.effortMins ?? 30, start, end };
    });
    return NextResponse.json({ plan });
  }
}
