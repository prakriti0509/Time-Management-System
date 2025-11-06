// app/page.tsx  (SERVER component — no 'use client' here)
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Bell, CalendarDays, CheckCircle2, ChevronRight, Clock4, Command,
  Home, Layers3, ListChecks, Plus, Search, Settings, Sparkles, Tag
} from "lucide-react";

// client components (must exist in /components)
import { DraftMyDayButton } from "@/components/DraftMyDayButton";
import { PrioritizeLink } from "@/components/PrioritizeLink";
import { NotesToTasks } from "@/components/NotesToTasks";
import { FocusTimer } from "@/components/FocusTimer";
import { FadeIn } from "@/components/FadeIn";
import { QuickAddInline } from "@/components/QuickAddInline";
import { TaskActions } from "@/components/TaskActions";
import { AddTaskButton } from "@/components/AddTaskButton";
import { ThemeToggle } from "@/components/ThemeToggle";

type TaskRow = {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  status: "OPEN" | "DONE";
  projectId: string | null;
};

// ----- UI atoms (server-safe) -----
function PriorityPill({ level }: { level: "High" | "Medium" | "Low" }) {
  const map: Record<string, string> = {
    High: "from-rose-500 to-orange-500",
    Medium: "from-amber-500 to-lime-500",
    Low: "from-sky-500 to-teal-500",
  };
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${map[level]} shadow-sm`}>
      {level}
    </span>
  );
}

function SidebarItem({
  icon: Icon, label, href, active = false,
}: { icon: any; label: string; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full block text-left rounded-xl px-3 py-2 text-sm
      ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
               : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70"}`}
    >
      <span className="inline-flex items-center gap-3">
        <Icon className="h-4 w-4" /> {label}
      </span>
    </Link>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-white/10" />;
}

function Suggestion({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 dark:border-white/10 dark:bg-zinc-900/50 p-3 text-sm shadow-sm">
      {children}
    </div>
  );
}

// ----- Helper: map view -> Prisma where -----
function whereFor(view: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  endOfDay.setHours(0, 0, 0, 0);

  switch (view) {
    case "today":
      // Tasks due today (between start and end of today)
      return { status: "OPEN" as const, dueDate: { gte: startOfDay, lt: endOfDay } };
    case "upcoming":
      // Tasks due after today
      return { status: "OPEN" as const, dueDate: { gte: endOfDay } };
    default:
      // support filters in the form: project:Work, priority:HIGH
      if (view.startsWith("project:")) {
        // Avoid DB filtering on notes for compatibility; filter after mapping
        return { status: "OPEN" as const };
      }
      if (view.startsWith("priority:")) {
        const level = view.split(":")[1]?.toUpperCase();
        if (level === 'LOW' || level === 'MEDIUM' || level === 'HIGH') {
          return { status: "OPEN" as const, priority: level as any };
        }
      }
      // home = all open tasks
      return { status: "OPEN" as const };
  }
}

// ----- Page (server component) -----
export default async function HomePage({
  searchParams,
}: { searchParams: Promise<{ view?: string }> }) {
  const sp = await searchParams;
  const view = (sp?.view ?? "home").toLowerCase();

  // Fetch tasks filtered by current tab
  let rows: TaskRow[] = [];
  try {
    rows = await prisma.task.findMany({
      where: whereFor(view),
      orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, priority: true, dueDate: true, status: true, projectId: true, notes: true },
    }) as any;
  } catch {}

  // Map DB rows to UI shape
  const parseProject = (notes?: string | null) => {
    if (!notes) return "General";
    const m = notes.match(/Project:\s*(Work|Personal|Learning)/i);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : "General";
  };
  let tasks = rows.map((r) => ({
    id: r.id,
    title: r.title,
    due: r.dueDate
      ? r.dueDate.toLocaleString("en-US", { month: "short", day: "numeric" })
      : "No date",
    project: parseProject((r as any).notes),
    status: r.status,
    priority: r.priority === "HIGH" ? "High" : r.priority === "LOW" ? "Low" : "Medium",
  }));

  // Apply project filter after mapping to ensure consistency with parsed project names
  if (view.startsWith("project:")) {
    const projectName = view.split(":")[1];
    tasks = tasks.filter((t) => t.project.toLowerCase() === projectName.toLowerCase());
  }

  return (
    <div
      className="min-h-screen w-full
      bg-[radial-gradient(1200px_600px_at_100%_-10%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(900px_500px_at_-10%_0%,rgba(59,130,246,0.18),transparent_60%)]
      dark:bg-[radial-gradient(1200px_600px_at_100%_-10%,rgba(168,85,247,0.25),transparent_60%),radial-gradient(900px_500px_at_-10%_0%,rgba(59,130,246,0.25),transparent_60%)]
      text-zinc-900 dark:text-zinc-100"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 pt-4 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-white/40 dark:border-white/10 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-500 shadow" />
              <span className="text-xl font-semibold bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">
                TIMES
              </span>
            </div>

            {/* Search removed */}

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600" />
            </div>
            {/* Settings removed */}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:block backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-white/40 dark:border-white/10 rounded-2xl p-3 shadow-lg">
          <div className="space-y-1">
            <SidebarItem icon={Home} label="Home" href="/?view=home" active={view === "home"} />
            <SidebarItem icon={CalendarDays} label="Today" href="/?view=today" active={view === "today"} />
            <SidebarItem icon={Clock4} label="Upcoming" href="/?view=upcoming" active={view === "upcoming"} />
          </div>
          <Divider />
          <p className="px-3 pb-1 text-xs uppercase tracking-wider text-zinc-500">Projects</p>
          <div className="space-y-1">
            <SidebarItem icon={Layers3} label="Work" href="/?view=project:Work" />
            <SidebarItem icon={Layers3} label="Personal" href="/?view=project:Personal" />
            <SidebarItem icon={Layers3} label="Learning" href="/?view=project:Learning" />
          </div>
          <Divider />
          <p className="px-3 pb-1 text-xs uppercase tracking-wider text-zinc-500">Priority</p>
          <div className="space-y-1">
            <SidebarItem icon={ListChecks} label="High" href="/?view=priority:HIGH" />
            <SidebarItem icon={ListChecks} label="Medium" href="/?view=priority:MEDIUM" />
            <SidebarItem icon={ListChecks} label="Low" href="/?view=priority:LOW" />
          </div>
          <AddTaskButton variant="sidebar" />
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {/* Hero / AI strip */}
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-white/40 dark:border-white/10">
              <div className="p-6 relative">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-500/30 via-fuchsia-500/30 to-cyan-500/30 blur-3xl" />
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      {view === "today" ? "Today"
                        : view === "upcoming" ? "Upcoming"
                        : "Home"}
                    </h1>
                    <p className="text-sm text-zinc-500">
                      Draft your day with AI, keep focus, and flow through tasks.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuickAddInline />
                    <DraftMyDayButton />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Task grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {tasks.length === 0 ? (
              <FadeIn>
                <div className="col-span-2 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-white/40 dark:border-white/10 p-8 text-center">
                  <p className="text-zinc-500 mb-2">No tasks yet</p>
                  <p className="text-sm text-zinc-400">Use the Quick Add field above to create your first task</p>
                </div>
              </FadeIn>
            ) : (
              tasks.map((t, i) => (
                <FadeIn key={t.id} delay={0.05 * i}>
                  <div className="group rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-white/40 dark:border-white/10 shadow-sm hover:shadow-xl">
                    <div className="flex items-center justify-between p-4">
                      <div className="text-base font-medium flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                        {t.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {t.project}
                        </span>
                        <PriorityPill level={t.priority as any} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 pt-0">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <CalendarDays className="h-4 w-4" /> {t.due}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/task/${t.id}`} className="rounded-xl px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 inline-flex items-center">
                          Open <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                        <TaskActions id={t.id} status={t.status} />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))
            )}

            {/* Focus card */}
            <FadeIn delay={0.2}>
              <div className="rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-white/40 dark:border-white/10 p-4">
                <div className="text-base font-medium mb-2">Focus Session</div>
                <div className="text-sm text-zinc-500 mb-3">Time block your next 25 minutes.</div>
                <FocusTimer minutes={25} />
              </div>
            </FadeIn>

          {/* AI Suggestions removed */}
          </div>
        </main>
      </div>

      {/* Floating add button */}
      <AddTaskButton variant="floating" />
    </div>
  );
}
