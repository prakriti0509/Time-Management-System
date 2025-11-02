"use client"

import { useState } from "react"
import { ChevronDown, Home, Inbox, Calendar, Clock, FolderOpen, Tag, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "today", label: "Today", icon: Calendar },
  { id: "upcoming", label: "Upcoming", icon: Clock },
]

const collapsibleItems = [
  { id: "projects", label: "Projects", icon: FolderOpen, items: ["Work", "Personal", "Learning"] },
  { id: "labels", label: "Labels", icon: Tag, items: ["Urgent", "Important", "Review", "Done"] },
]

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    projects: true,
    labels: true,
  })

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">✓</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeView === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Collapsible Sections */}
        <div className="mt-6 space-y-3">
          {collapsibleItems.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  {section.icon && <section.icon className="w-4 h-4" />}
                  {section.label}
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", expandedSections[section.id] && "rotate-180")}
                />
              </button>
              {expandedSections[section.id] && (
                <div className="ml-3 space-y-1 mt-1">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-3 py-1 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  )
}
