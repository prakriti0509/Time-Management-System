'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createTask } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddTaskButton({ variant = 'floating' }: { variant?: 'floating' | 'sidebar' | 'inline' }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [project, setProject] = useState<'Work' | 'Personal' | 'Learning'>('Work');
  const templates = [
    'Study for exams',
    'Complete homework',
    'Revise class notes',
    'Practice coding problems',
    'Prepare presentation slides',
    'Read one chapter',
    'Write daily summary',
    'Plan tomorrow\'s tasks',
    'Organize study materials',
    'Review assignments',
  ];
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const form = new FormData();
    form.append('title', title);
    // Combine description and project in notes for now
    const notes = [description, `Project: ${project}`].filter(Boolean).join('\n');
    form.append('notes', notes);
    if (dueDate) form.append('dueDate', dueDate);
    form.append('priority', priority);
    // projectId left null for now - can be enhanced later to create/find Project
    
    await createTask(form);
    setOpen(false);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('MEDIUM');
    setProject('Work');
    router.refresh();
  }

  const buttonClass = variant === 'floating'
    ? 'fixed bottom-6 right-6 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-5 text-white shadow-2xl inline-flex items-center gap-2'
    : variant === 'sidebar'
    ? 'mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 text-white text-sm py-2.5 inline-flex items-center justify-center gap-2'
    : 'rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 inline-flex items-center gap-2';

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClass}>
        <Plus className={variant === 'floating' ? 'h-5 w-5' : 'h-4 w-4'} />
        {variant === 'floating' ? 'Add Task' : variant === 'sidebar' ? 'New Task' : 'Add Task'}
      </button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your list</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="template">Quick template</Label>
              <Select onValueChange={(v: any) => setTitle(v)}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input 
                id="dueDate" 
                type="date" 
                min={today}
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
              />
            </div>

            <div>
              <Label htmlFor="project">Project</Label>
              <Select value={project} onValueChange={(v: any) => setProject(v)}>
                <SelectTrigger id="project">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

