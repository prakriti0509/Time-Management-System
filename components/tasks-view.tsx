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
  onAddTask?: (task: Omit<Task, "id">) => void
  onEditTask?: (task: Task) => void
  onDuplicateTask?: (task: Task) => void
  searchQuery?: string
  selectedProject?: string
}

const priorityColors = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
}

export function TasksView({ 
  tasks, 
  activeView, 
  onToggleTask, 
  onDeleteTask, 
  onAddTask,
  onEditTask,
  onDuplicateTask,
  searchQuery = "",
  selectedProject 
}: TasksViewProps) {
  const [sortBy, setSortBy] = useState("dueDate")
  const [quickAddInput, setQuickAddInput] = useState("")

  const viewTitles: Record<string, string> = {
    home: "Home",
    inbox: "Inbox",
    today: "Today",
    upcoming: "Upcoming",
  }

  // Filter tasks based on activeView
  const filteredTasks = tasks.filter((task) => {
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by selected project
    if (selectedProject && task.project !== selectedProject) {
      return false
    }

    // Filter by view
    if (activeView === "inbox") {
      return task.project === "Inbox"
    }
    
    if (activeView === "today") {
      if (!task.dueDate) return false
      const today = new Date()
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      )
    }
    
    if (activeView === "upcoming") {
      if (!task.dueDate) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate >= today && task.completed === false
    }

    // Home view shows all tasks
    return true
  })

  // Sort tasks with proper date handling
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      // Handle empty dates - put them at the end
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      
      // Check for invalid dates
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1
      
      return dateA.getTime() - dateB.getTime()
    }
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return a.title.localeCompare(b.title)
  })

  const formatDate = (date: string) => {
    if (!date) return ""
    
    const d = new Date(date)
    // Check for invalid date
    if (isNaN(d.getTime())) return ""
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const taskDate = new Date(d)
    taskDate.setHours(0, 0, 0, 0)

    if (taskDate.getTime() === today.getTime()) return "Today"
    if (taskDate.getTime() === tomorrow.getTime()) return "Tomorrow"
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickAddInput.trim() || !onAddTask) return
    
    onAddTask({
      title: quickAddInput.trim(),
      completed: false,
      dueDate: new Date().toISOString().split("T")[0],
      project: selectedProject || "Inbox",
      priority: "medium",
    })
    setQuickAddInput("")
  }

  const handleEdit = (task: Task) => {
    if (onEditTask) {
      onEditTask(task)
    }
  }

  const handleDuplicate = (task: Task) => {
    if (onDuplicateTask) {
      onDuplicateTask(task)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {viewTitles[activeView as keyof typeof viewTitles] || "Tasks"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{sortedTasks.length} tasks</p>
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
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No tasks found</p>
              {searchQuery && <p className="text-muted-foreground text-xs mt-2">Try adjusting your search or filters</p>}
            </div>
          ) : (
            sortedTasks.map((task) => (
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
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
                  )}
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
                  {onEditTask && (
                    <DropdownMenuItem onClick={() => handleEdit(task)}>Edit</DropdownMenuItem>
                  )}
                  {onDuplicateTask && (
                    <DropdownMenuItem onClick={() => handleDuplicate(task)}>Duplicate</DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
          )}

          {/* Add Task Input */}
          {onAddTask && (
            <div className="mt-6 pt-4 border-t border-border">
              <form onSubmit={handleQuickAdd} className="flex items-center gap-3">
                <Checkbox disabled />
                <Input
                  placeholder="Add a task..."
                  value={quickAddInput}
                  onChange={(e) => setQuickAddInput(e.target.value)}
                  className="bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
