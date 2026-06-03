import KanbanBoard from "@/components/board/KanbanBoard";
import { prisma } from "@/lib/prisma";

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

  const columns = board.columns.map((column) => ({
    id: column.id,
    title: column.title,
    tasks: column.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      priority: task.priority as "Low" | "Medium" | "High",
      dueDate: task.dueDate ?? undefined,
    })),
  }));

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