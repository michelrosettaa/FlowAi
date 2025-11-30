"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  CheckSquare,
  Mail,
  Sparkles,
  Brain,
  LayoutDashboard,
  Plus,
  MessageSquare,
} from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle on Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[9999] w-full max-w-2xl px-4">
        <Command
          label="Command Palette"
          className="w-full"
        >
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
            <Search className="w-5 h-5 text-slate-400" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-white placeholder:text-slate-400 outline-none text-base"
            />
            <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
              Esc
            </kbd>
          </div>

          {/* Command List */}
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-slate-400 text-sm">
              No results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="text-xs font-semibold text-slate-400 px-2 py-2">
              <Command.Item
                onSelect={() => navigate("/app/planner")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-500/20 text-white mb-1 group transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Plus className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Create task</div>
                  <div className="text-xs text-slate-400">Add a new task to your planner</div>
                </div>
                <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">T</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/app/planner")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-500/20 text-white mb-1 group transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Schedule event</div>
                  <div className="text-xs text-slate-400">Add event to calendar</div>
                </div>
                <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">E</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/app/ask-refraim")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-purple-500/20 text-white mb-1 group transition-colors"
              >
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Ask Refraim AI</div>
                  <div className="text-xs text-slate-400">Get AI assistance instantly</div>
                </div>
                <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">A</kbd>
              </Command.Item>
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="text-xs font-semibold text-slate-400 px-2 py-2 mt-2">
              <Command.Item
                onSelect={() => navigate("/app")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-700/50 text-white mb-1 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/app/planner")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-700/50 text-white mb-1 transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-slate-400" />
                <span>Daily Planner</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/app/email")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-700/50 text-white mb-1 transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email Assistant</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/app/mentor")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-700/50 text-white mb-1 transition-colors"
              >
                <Brain className="w-4 h-4 text-slate-400" />
                <span>AI Motivator</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate("/app/ask-refraim")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-700/50 text-white mb-1 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span>Ask Refraim AI</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer hint */}
          <div className="border-t border-slate-700 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">↵</kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Tip:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">⌘ K</kbd>
              <span>to toggle</span>
            </div>
          </div>
        </div>
        </Command>
      </div>
    </div>
  );
}
