import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SortableTaskCard from "@/components/task/SortableTaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Column } from "@/types/kanban";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface BoardColumnProps {
  column: Column;
  onCreateTask: (columnId: string, title: string) => void;
  onUpdateTask: (
    columnId: string,
    taskId: string,
    title: string,
    description: string,
    priority: "Low" | "Medium" | "High"
  ) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
}

export default function BoardColumn({
  column,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onDeleteColumn,
  onRenameColumn,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  return (
    <Card className="w-80 shrink-0 bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-start justify-between">
        {editingTitle ? (
          <Input
            autoFocus
            value={title}
            className="text-zinc-100"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              onRenameColumn(column.id, title.trim() || "Untitled");
              setEditingTitle(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRenameColumn(column.id, title.trim() || "Untitled");
                setEditingTitle(false);
              }
            }}
          />
        ) : (
          <CardTitle
            className="cursor-pointer text-zinc-100"
            onClick={() => setEditingTitle(true)}
          >
            {column.title}
          </CardTitle>
        )}

        <p className="text-xs text-zinc-500">
            {column.tasks.length} tasks
        </p>

        <div className="flex gap-2">
          <CreateTaskDialog
            onCreateTask={(title) => onCreateTask(column.id, title)}
          />

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteColumn(column.id)}
          >
            Delete
          </Button>
        </div>
      </CardHeader>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <CardContent
          ref={setNodeRef}
          className={`min-h-40 space-y-3 rounded-b-xl transition ${
            isOver ? "bg-zinc-800/60" : ""
          }`}
        >
          {column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onUpdateTask={(taskId, title, description, priority) =>
                onUpdateTask(
                  column.id,
                  taskId,
                  title,
                  description,
                  priority
                )
              }
              onDeleteTask={(taskId) => onDeleteTask(column.id, taskId)}
            />
          ))}
        </CardContent>
      </SortableContext>
    </Card>
  );
}