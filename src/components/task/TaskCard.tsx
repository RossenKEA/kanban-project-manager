"use client";

import { useState } from "react";
import { Task } from "@/types/kanban";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  onUpdateTask: (
    taskId: string,
    title: string,
    description: string,
    priority: "Low" | "Medium" | "High",
    dueDate: string
  ) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    task.priority ?? "Medium"
  );
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;

    setSaving(true);

    await onUpdateTask(task.id, title, description, priority, dueDate);

    setSaving(false);
    setOpen(false);
  }

  async function handleDelete() {
    setDeleting(true);

    await onDeleteTask(task.id);

    setDeleting(false);
    setOpen(false);
  }

  const priorityStyles = {
    Low: "border-green-700 bg-green-950 text-green-300",
    Medium: "border-yellow-700 bg-yellow-950 text-yellow-300",
    High: "border-red-700 bg-red-950 text-red-300",
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left text-sm text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900"
      >
        {task.priority && (
          <span
            className={`mb-2 inline-flex rounded-full border px-2 py-0.5 text-xs ${
              priorityStyles[task.priority]
            }`}
          >
            {task.priority}
          </span>
        )}

        {task.dueDate && (
          <p className="mt-2 text-xs text-zinc-500">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        <p>{task.title}</p>

        {task.description && (
          <p className="mt-2 line-clamp-2 text-xs text-zinc-500">
            {task.description}
          </p>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <Textarea
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "Low" | "Medium" | "High")
              }
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="relative">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 [color-scheme:dark]"
              />
            </div>

            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This task will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700" disabled={deleting}>
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}