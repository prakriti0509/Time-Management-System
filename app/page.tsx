"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { TasksView } from "@/components/tasks-view"
import { CreateTaskDialog } from "@/components/create-task-dialog"

export default function Home() {
  const [activeView, setActiveView] = useState("inbox")
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Design dashboard mockups",
      completed: false,
      dueDate: "2025-01-15",
      project: "Design System",
      priority: "high",
    },
    {
      id: "2",
      title: "Review pull requests",
      completed: false,
      dueDate: "2025-01-10",
      project: "Development",
      priority: "medium",
    },
    {
      id: "3",
      title: "Update documentation",
      completed: true,
      dueDate: "2025-01-05",
      project: "Documentation",
      priority: "low",
    },
  ])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleAddTask = (newTask: any) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }])
    setIsCreateDialogOpen(false)
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onCreateTask={() => setIsCreateDialogOpen(true)} activeView={activeView} />
        <TasksView
          tasks={tasks}
          activeView={activeView}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
      <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onAdd={handleAddTask} />
    </div>
  )
}
