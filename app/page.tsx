"use client";

import { useState, useEffect } from "react";
import { Plus, Search, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/task";
import TaskList from "@/components/TaskList";
import AddTaskDialog from "@/components/AddTaskDialog";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTasksToLocalStorage([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updatedTask: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasksToLocalStorage(updatedTasks);
  };

  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortAlphabetically
        ? a.title.localeCompare(b.title)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Task Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Organize your tasks efficiently
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSortAlphabetically(!sortAlphabetically)}
              className="sm:w-auto w-full"
            >
              <SortAsc className="h-4 w-4 mr-2" />
              {sortAlphabetically ? "Sort by Date" : "Sort A-Z"}
            </Button>
            <Button
              onClick={() => setIsAddTaskOpen(true)}
              className="sm:w-auto w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <TaskList
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />

          <AddTaskDialog
            open={isAddTaskOpen}
            onOpenChange={setIsAddTaskOpen}
            onAddTask={addTask}
          />
        </div>
      </div>
    </div>
  );
}
