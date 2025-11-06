import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { openai, aiEnabled } from "@/lib/ai";

export async function POST(req: Request) {
  if (!aiEnabled) {
    return NextResponse.json({ error: "AI disabled. Set OPENAI_API_KEY." }, { status: 503 });
  }
  const { notes } = await req.json();

  const res = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role:"system", content:"Extract tasks. Return JSON {items:[{title,dueDate?,priority?(LOW|MEDIUM|HIGH),effortMins?}]}" },
      { role:"user", content: notes || "" }
    ],
    response_format: { type: "json_object" },
  } as any);

  let items: any[] = [];
  try {
    const text = (res.output[0] as any).content[0].text;
    items = (JSON.parse(text).items ?? []).slice(0,20);
  } catch {}

  await Promise.all(items.map(t => prisma.task.create({
    data: {
      title: t.title,
      priority: (t.priority ?? "MEDIUM"),
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
      effortMins: t.effortMins ?? null,
    }
  })));
  return NextResponse.json({ created: items.length });
}
