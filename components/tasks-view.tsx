"use client"

import { useState } from "react"
import { ChevronDown, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  project: string
  priority: "low" | "medium" | "high"
}

interface TasksViewProps {
  tasks: Task[]
  activeView: string
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

const priorityColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
}

export function TasksView({ tasks, activeView, onToggleTask, onDeleteTask }: TasksViewProps) {
  const [sortBy, setSortBy] = useState("dueDate")

  const viewTitles: Record<string, string> = {
    home: "Home",
    inbox: "Inbox",
    today: "Today",
    upcoming: "Upcoming",
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime()
    }
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return a.title.localeCompare(b.title)
  })

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (d.toDateString() === today.toDateString()) return "Today"
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {viewTitles[activeView as keyof typeof viewTitles] || "Tasks"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{tasks.length} tasks</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              Sort by {sortBy === "dueDate" ? "Due Date" : sortBy === "priority" ? "Priority" : "Alphabetical"}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("dueDate")}>Due Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>Alphabetical</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2 max-w-4xl">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group",
                task.completed && "opacity-60",
              )}
            >
              <Checkbox checked={task.completed} onCheckedChange={() => onToggleTask(task.id)} className="mt-0.5" />

              <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-sm", task.completed && "line-through text-muted-foreground")}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{task.dueDate && formatDate(task.dueDate)}</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{task.project}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded font-medium", priorityColors[task.priority])}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          {/* Add Task Input */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Checkbox disabled />
              <Input
                placeholder="Add a task..."
                className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
