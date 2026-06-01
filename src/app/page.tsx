"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import BoardColumn from "@/components/board/BoardColumn";
import { mockColumns } from "@/data/mock-board";
import { Column } from "@/types/kanban";

export default function Home() {
  const [columns, setColumns] = useState<Column[]>(mockColumns);

  function handleCreateTask(columnId: string, title: string) {
    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id !== columnId) return column;

        return {
          ...column,
          tasks: [
            ...column.tasks,
            {
              id: crypto.randomUUID(),
              title,
            },
          ],
        };
      })
    );
  }

  function handleUpdateTask(
    columnId: string,
    taskId: string,
    title: string,
    description: string
  ) {
    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id !== columnId) return column;

        return {
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  title,
                  description,
                }
              : task
          ),
        };
      })
    );
  }

function handleDeleteTask(columnId: string, taskId: string) {
  setColumns((currentColumns) =>
    currentColumns.map((column) => {
      if (column.id !== columnId) return column;

      return {
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      };
    })
  );
}

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kanban Project Manager</h1>
            <p className="text-zinc-400">
              Organize projects, tasks, and workflows.
            </p>
          </div>

          <Button>Create Board</Button>
        </header>

        <section className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </section>
      </div>
    </main>
  );
}