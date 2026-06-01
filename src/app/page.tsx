"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import BoardColumn from "@/components/board/BoardColumn";
import { mockColumns } from "@/data/mock-board";
import { Column } from "@/types/kanban";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  const [columns, setColumns] = useState<Column[]>(mockColumns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function findColumnByTaskId(taskId: string) {
    return columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id.toString();
    const overId = over.id.toString();

    if (activeTaskId === overId) return;

    const activeColumn = findColumnByTaskId(activeTaskId);
    const overColumn =
      findColumnByTaskId(overId) ?? columns.find((column) => column.id === overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      if (overId === overColumn.id) return;

      setColumns((currentColumns) =>
        currentColumns.map((column) => {
          if (column.id !== activeColumn.id) return column;

          const oldIndex = column.tasks.findIndex(
            (task) => task.id === activeTaskId
          );

          const newIndex = column.tasks.findIndex((task) => task.id === overId);

          return {
            ...column,
            tasks: arrayMove(column.tasks, oldIndex, newIndex),
          };
        })
      );

      return;
    }

    setColumns((currentColumns) => {
      const sourceColumn = currentColumns.find((column) =>
        column.tasks.some((task) => task.id === activeTaskId)
      );

      const destinationColumn =
        currentColumns.find((column) =>
          column.tasks.some((task) => task.id === overId)
        ) ?? currentColumns.find((column) => column.id === overId);

      if (!sourceColumn || !destinationColumn) return currentColumns;

      const activeTask = sourceColumn.tasks.find(
        (task) => task.id === activeTaskId
      );

      if (!activeTask) return currentColumns;

      const destinationIndex =
        destinationColumn.id === overId
          ? destinationColumn.tasks.length
          : destinationColumn.tasks.findIndex((task) => task.id === overId);

      return currentColumns.map((column) => {
        if (column.id === sourceColumn.id) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== activeTaskId),
          };
        }

        if (column.id === destinationColumn.id) {
          const newTasks = [...column.tasks];
          newTasks.splice(destinationIndex, 0, activeTask);

          return {
            ...column,
            tasks: newTasks,
          };
        }

        return column;
      });
    });
  }

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
              priority: "Medium",
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
    description: string,
    priority: "Low" | "Medium" | "High",
    dueDate: string,
  ) {
    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id !== columnId) return column;

        return {
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId
              ? { ...task, title, description, priority, dueDate }
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

  function handleCreateColumn() {
    setColumns((currentColumns) => [
      ...currentColumns,
      {
        id: crypto.randomUUID(),
        title: "New Column",
        tasks: [],
      },
    ]);
  }

  function handleDeleteColumn(columnId: string) {
    setColumns((currentColumns) =>
      currentColumns.filter((column) => column.id !== columnId)
    );
  }

  function handleRenameColumn(columnId: string, title: string) {
    setColumns((currentColumns) =>
      currentColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              title,
            }
          : column
      )
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kanban Project Manager</h1>
            <p className="text-zinc-400">
              Organize projects, tasks, and workflows.
            </p>
          </div>

          <Button onClick={handleCreateColumn}>Add Column</Button>
        </header>

        <ClientOnly>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <section className="flex gap-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  onCreateTask={handleCreateTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onDeleteColumn={handleDeleteColumn}
                  onRenameColumn={handleRenameColumn}
                />
              ))}
            </section>
          </DndContext>
        </ClientOnly>
      </div>
    </main>
  );
}