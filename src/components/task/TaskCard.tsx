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

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  function handleSave() {
    if (!title.trim()) return;

    onUpdateTask(task.id, title, description);
    setOpen(false);
  }

  function handleDelete() {
    onDeleteTask(task.id);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-left text-sm text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900"
      >
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

            <div className="flex justify-between">
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>

              <Button onClick={handleSave}>Save changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}