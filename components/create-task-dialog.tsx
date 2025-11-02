"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id?: string
  title: string
  completed: boolean
  dueDate?: string
  project: string
  priority: "low" | "medium" | "high"
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (task: Omit<Task, "id">) => void
  editingTask?: Task | null
}

export function CreateTaskDialog({ open, onOpenChange, onAdd, editingTask }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [project, setProject] = useState("Inbox")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")

  // Update form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDueDate(editingTask.dueDate || "")
      setProject(editingTask.project)
      setPriority(editingTask.priority)
    } else {
      setTitle("")
      setDueDate("")
      setProject("Inbox")
      setPriority("medium")
    }
  }, [editingTask, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({
      title,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      project,
      priority,
      completed: editingTask?.completed || false,
    })

    if (!editingTask) {
      setTitle("")
      setDueDate("")
      setProject("Inbox")
      setPriority("medium")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>{editingTask ? "Update task details" : "Add a new task to your list"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What do you need to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="project">Project</Label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger id="project">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inbox">Inbox</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
