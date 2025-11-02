"use client"

import { Search, Plus, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TopBarProps {
  onCreateTask: () => void
  activeView: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

const viewTitles: Record<string, string> = {
  home: "Home",
  inbox: "Inbox",
  today: "Today",
  upcoming: "Upcoming",
  projects: "Projects",
  labels: "Labels",
}

export function TopBar({ onCreateTask, activeView, searchQuery = "", onSearchChange }: TopBarProps) {
  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 gap-4">
      {/* Left side - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 bg-muted border-0 text-sm" 
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={onCreateTask} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>

        <Button variant="ghost" size="icon" className="text-foreground">
          <Bell className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                JD
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
