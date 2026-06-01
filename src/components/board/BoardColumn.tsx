import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SortableTaskCard from "@/components/task/SortableTaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Column } from "@/types/kanban";

interface BoardColumnProps {
  column: Column;
  onCreateTask: (columnId: string, title: string) => void;
  onUpdateTask: (
    columnId: string,
    taskId: string,
    title: string,
    description: string
  ) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

export default function BoardColumn({
  column,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: BoardColumnProps) {
  return (
    <Card className="w-80 shrink-0 bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-zinc-100">
            {column.title}
        </CardTitle>

        <p className="text-xs text-zinc-500">
            {column.tasks.length} tasks
        </p>

        <CreateTaskDialog
          onCreateTask={(title) => onCreateTask(column.id, title)}
        />
      </CardHeader>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <CardContent className="space-y-3">
          {column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onUpdateTask={(taskId, title, description) =>
                onUpdateTask(column.id, taskId, title, description)
              }
              onDeleteTask={(taskId) => onDeleteTask(column.id, taskId)}
            />
          ))}
        </CardContent>
      </SortableContext>
    </Card>
  );
}