import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { openai, aiEnabled } from "@/lib/ai";

export async function POST() {
  if (!aiEnabled) {
    const tasks = await prisma.task.findMany({ where: { status: "OPEN" } });
    const score = (p:"LOW"|"MEDIUM"|"HIGH") => ({LOW:1,MEDIUM:2,HIGH:3}[p]);
    const ordered = tasks.sort((a,b)=>score(b.priority)-score(a.priority)).map(t=>t.id);
    return NextResponse.json({ ordered });
  }
  const tasks = await prisma.task.findMany({ where: { status: "OPEN" } });

  try {
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role:"system", content:"Return JSON {ids:[...]} sorted by urgency/importance." },
        { role:"user", content: JSON.stringify(tasks.map(t => ({ id:t.id, title:t.title, priority:t.priority, dueDate:t.dueDate }))) }
      ],
      response_format: { type:"json_object" },
    } as any);
    const text = (res.output[0] as any).content[0].text;
    const parsed = JSON.parse(text);
    return NextResponse.json({ ordered: parsed.ids ?? [] });
  } catch {
    const score = (p:"LOW"|"MEDIUM"|"HIGH") => ({LOW:1,MEDIUM:2,HIGH:3}[p]);
    const ordered = tasks.sort((a,b)=>score(b.priority)-score(a.priority)).map(t=>t.id);
    return NextResponse.json({ ordered });
  }
}
