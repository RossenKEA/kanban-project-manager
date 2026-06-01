import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/task/TaskCard";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Column } from "@/types/kanban";

interface BoardColumnProps {
  column: Column;
  onCreateTask: (columnId: string, title: string) => void;
}

export default function BoardColumn({
  column,
  onCreateTask,
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

      <CardContent className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} title={task.title} />
        ))}
      </CardContent>
    </Card>
  );
}