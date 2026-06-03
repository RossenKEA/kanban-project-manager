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
import { Column } from "@/types/kanban";
import ClientOnly from "@/components/ClientOnly";
import { createTask, updateTask, deleteTask as deleteTaskAction, createColumn, renameColumn, deleteColumn as deleteColumnAction, updateTaskOrder, renameBoard, } from "@/app/actions";

interface KanbanBoardProps {
  boardId: string;
  boardTitle: string;
  initialColumns: Column[];
}

export default function KanbanBoard({
  boardId,
  boardTitle,
  initialColumns,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const [title, setTitle] = useState(boardTitle);
  const [editingBoardTitle, setEditingBoardTitle] = useState(false);

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id.toString();
    const overId = over.id.toString();

    if (activeTaskId === overId) return;

    const activeColumn = findColumnByTaskId(activeTaskId);
    const overColumn =
      findColumnByTaskId(overId) ?? columns.find((column) => column.id === overId);

    if (!activeColumn || !overColumn) return;

    let nextColumns = columns;

    if (activeColumn.id === overColumn.id) {
      if (overId === overColumn.id) return;

      nextColumns = columns.map((column) => {
        if (column.id !== activeColumn.id) return column;

        const oldIndex = column.tasks.findIndex(
          (task) => task.id === activeTaskId
        );

        const newIndex = column.tasks.findIndex((task) => task.id === overId);

        return {
          ...column,
          tasks: arrayMove(column.tasks, oldIndex, newIndex),
        };
      });
    } else {
      const activeTask = activeColumn.tasks.find(
        (task) => task.id === activeTaskId
      );

      if (!activeTask) return;

      const destinationIndex =
        overColumn.id === overId
          ? overColumn.tasks.length
          : overColumn.tasks.findIndex((task) => task.id === overId);

      nextColumns = columns.map((column) => {
        if (column.id === activeColumn.id) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== activeTaskId),
          };
        }

        if (column.id === overColumn.id) {
          const newTasks = [...column.tasks];
          newTasks.splice(destinationIndex, 0, activeTask);

          return {
            ...column,
            tasks: newTasks,
          };
        }

        return column;
      });
    }

    setColumns(nextColumns);

    await updateTaskOrder(
      nextColumns.map((column) => ({
        id: column.id,
        tasks: column.tasks.map((task) => ({
          id: task.id,
        })),
      }))
    );
  }

  async function handleCreateTask(columnId: string, title: string) {
    const createdTask = await createTask(columnId, title);

    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id !== columnId) return column;

        return {
          ...column,
          tasks: [
            ...column.tasks,
            {
              id: createdTask.id,
              title: createdTask.title,
              description: createdTask.description ?? undefined,
              priority: createdTask.priority as "Low" | "Medium" | "High",
              dueDate: createdTask.dueDate ?? undefined,
            },
          ],
        };
      })
    );
  }

  async function handleUpdateTask(
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

    await updateTask(taskId, title, description, priority, dueDate);
  }

  async function handleDeleteTask(
  columnId: string,
  taskId: string
  ) {
    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id !== columnId) return column;

        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      })
    );

    await deleteTaskAction(taskId);
  }

  async function handleCreateColumn() {
    const newColumn = await createColumn(boardId);

    setColumns((currentColumns) => [
      ...currentColumns,
      {
        id: newColumn.id,
        title: newColumn.title,
        tasks: [],
      },
    ]);
  }

  async function handleDeleteColumn(columnId: string) {
    setColumns((currentColumns) =>
      currentColumns.filter((column) => column.id !== columnId)
    );

    await deleteColumnAction(columnId);
  }

  async function handleRenameColumn(columnId: string, title: string) {
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

    await renameColumn(columnId, title);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg border border-yellow-700 bg-yellow-950/40 p-4 text-sm text-yellow-200">
          Demo board: changes are saved to the database, but this board resets regularly
          to prevent abuse.
        </div>

        <header className="mb-8 flex items-center justify-between">
          <div>
            {editingBoardTitle ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={async () => {
                  const finalTitle = title.trim() || "Untitled Board";
                  setTitle(finalTitle);
                  setEditingBoardTitle(false);
                  await renameBoard(boardId, finalTitle);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const finalTitle = title.trim() || "Untitled Board";
                    setTitle(finalTitle);
                    setEditingBoardTitle(false);
                    await renameBoard(boardId, finalTitle);
                  }
                }}
                className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-3xl font-bold text-zinc-100"
              />
            ) : (
              <h1
                className="cursor-pointer text-3xl font-bold"
                onClick={() => setEditingBoardTitle(true)}
              >
                {title}
              </h1>
            )}
            <p className="max-w-3xl text-zinc-400">
              Portfolio project demonstrating full-stack CRUD operations,
              drag-and-drop persistence, Prisma ORM, Next.js Server Actions,
              and a database-backed Kanban workflow.
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