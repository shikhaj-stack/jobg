"use client";
import React, { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, Tag, Calendar, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export default function TaskChecklist() {
  const { tasks, toggleTask, addTask, deleteTask } = useProgress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("DSA");

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, newTaskCategory);
      setNewTaskTitle("");
      setIsModalOpen(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-lg">Next Up Sprint Tasks</h3>
          <p className="text-xs text-slate-500">{completedCount} of {tasks.length} tasks finished</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-80 pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start justify-between p-3 rounded-2xl border transition-all ${
              task.completed
                ? "bg-slate-50 border-slate-200/60 opacity-60"
                : "bg-white border-slate-200/90 hover:border-amber-200 hover:bg-amber-50/20"
            }`}
          >
            <div
              onClick={() => toggleTask(task.id)}
              className="flex items-start gap-3 flex-1 cursor-pointer select-none"
            >
              <button className="mt-0.5 text-slate-400 hover:text-amber-600 transition-colors">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <div className="space-y-0.5">
                <p
                  className={`text-xs font-semibold ${
                    task.completed ? "line-through text-slate-400" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                  {task.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors ml-2"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl animate-fade-in-up">
            <h4 className="text-lg font-serif font-bold text-slate-900 mb-2">Create Custom Sprint Task</h4>
            <p className="text-xs text-slate-500 mb-4">Add high-leverage prep objectives to your sprint loop.</p>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Raft Consensus algorithm in Go..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-sans"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase font-mono">
                  Category Track
                </label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white font-sans"
                >
                  <option value="DSA">Data Structures & Algo</option>
                  <option value="System Design">Distributed System Design</option>
                  <option value="LLD">Low-Level Object Design</option>
                  <option value="Behavioral">Executive Behavioral (STAR)</option>
                  <option value="Web3">Web3 & Solidity Protocol</option>
                  <option value="Mock">Mock Interview Session</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20"
                >
                  Add to Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
