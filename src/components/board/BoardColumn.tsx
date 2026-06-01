import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskCard from "@/components/task/TaskCard";
import { Column } from "@/types/kanban";

interface BoardColumnProps {
  column: Column;
}

export default function BoardColumn({ column }: BoardColumnProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{column.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} title={task.title} />
        ))}
      </CardContent>
    </Card>
  );
}