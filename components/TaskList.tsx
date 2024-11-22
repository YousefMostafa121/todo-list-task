"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import EditTaskDialog from "./EditTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
import { formatDistanceToNow } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No tasks found. Add your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-6 transition-all hover:shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-300">
                  {task.description}
                </p>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <span>
                  Created {formatDistanceToNow(new Date(task.createdAt))} ago
                </span>
                {task.updatedAt !== task.createdAt && (
                  <span>
                    · Updated {formatDistanceToNow(new Date(task.updatedAt))}{" "}
                    ago
                  </span>
                )}
              </div>
            </div>
            <div className="flex sm:flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEditingTask(task)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDeletingTask(task)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onUpdateTask={onUpdateTask}
        />
      )}

      {deletingTask && (
        <DeleteTaskDialog
          task={deletingTask}
          open={!!deletingTask}
          onOpenChange={(open) => !open && setDeletingTask(null)}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  );
}
