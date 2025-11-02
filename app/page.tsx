"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { TasksView } from "@/components/tasks-view"
import { CreateTaskDialog } from "@/components/create-task-dialog"

interface Task {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  project: string
  priority: "low" | "medium" | "high"
}

export default function Home() {
  const [activeView, setActiveView] = useState("inbox")
  const [tasks, setTasks] = useState<Task[]>([
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
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined)

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }])
    setIsCreateDialogOpen(false)
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsCreateDialogOpen(true)
  }

  const handleUpdateTask = (updatedTask: Omit<Task, "id">) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...updatedTask, id: editingTask.id } : task)))
      setIsCreateDialogOpen(false)
      setEditingTask(null)
    }
  }

  const handleDuplicateTask = (task: Task) => {
    const { id, ...taskWithoutId } = task
    setTasks([...tasks, { ...taskWithoutId, id: Date.now().toString() }])
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleProjectClick = (project: string) => {
    setSelectedProject(project)
    setActiveView("home") // Switch to home view when filtering by project
  }

  const handleViewChange = (view: string) => {
    setActiveView(view)
    setSelectedProject(undefined) // Clear project filter when changing views
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        setActiveView={handleViewChange}
        selectedProject={selectedProject}
        onProjectClick={handleProjectClick}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onCreateTask={() => {
            setEditingTask(null)
            setIsCreateDialogOpen(true)
          }} 
          activeView={activeView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TasksView
          tasks={tasks}
          activeView={activeView}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDuplicateTask={handleDuplicateTask}
          searchQuery={searchQuery}
          selectedProject={selectedProject}
        />
      </div>
      <CreateTaskDialog 
        open={isCreateDialogOpen} 
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) setEditingTask(null)
        }} 
        onAdd={editingTask ? handleUpdateTask : handleAddTask}
        editingTask={editingTask}
      />
    </div>
  )
}
