import KanbanBoard from "@/components/board/KanbanBoard";
import { prisma } from "@/lib/prisma";
import { Column as KanbanColumn } from "@/types/kanban";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const board = await prisma.board.findFirst({
    include: {
      columns: {
        orderBy: {
          order: "asc",
        },
        include: {
          tasks: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!board) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
        <p>No board found. Run the seed file first.</p>
      </main>
    );
  }

  const columns: KanbanColumn[] = board.columns.map(
    (column: typeof board.columns[number]) => ({
      id: column.id,
      title: column.title,
      tasks: column.tasks.map(
        (task: typeof column.tasks[number]) => ({
          id: task.id,
          title: task.title,
          description: task.description ?? undefined,
          priority: task.priority as "Low" | "Medium" | "High",
          dueDate: task.dueDate ?? undefined,
        })
      ),
    })
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-50 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <KanbanBoard
          boardId={board.id}
          boardTitle={board.title}
          initialColumns={columns}
        />
      </div>
    </main>
  );
}