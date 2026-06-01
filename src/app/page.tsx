import KanbanBoard from "@/components/board/KanbanBoard";
import { mockColumns } from "@/data/mock-board";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-7xl">
        <KanbanBoard initialColumns={mockColumns} />
      </div>
    </main>
  );
}