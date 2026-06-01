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
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{column.title}</CardTitle>

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