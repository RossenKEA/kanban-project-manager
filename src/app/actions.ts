"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createTask(columnId: string, title: string) {
    const taskCount = await prisma.task.count({
        where: {
            columnId,
        },
    });

    const task = await prisma.task.create({
        data: {
            title,
            priority: "Medium",
            order: taskCount,
            columnId,
        },
    });

    revalidatePath("/");

    return task;
}

export async function updateTask(
    taskId: string,
    title: string,
    description: string,
    priority: "Low" | "Medium" | "High",
    dueDate: string
) {
    await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            title,
            description: description || null,
            priority,
            dueDate: dueDate || null,
        },
    });

    revalidatePath("/");
}

export async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    });

    revalidatePath("/");
}

export async function createColumn(boardId: string) {
    const columnCount = await prisma.column.count({
        where: {
            boardId,
        },
    });

    const column = await prisma.column.create({
        data: {
            title: "New Column",
            order: columnCount,
            boardId,
        },
    });

    revalidatePath("/");

    return column;
}

export async function renameColumn(columnId: string, title: string) {
    await prisma.column.update({
        where: {
            id: columnId,
        },
        data: {
            title,
        },
    });

    revalidatePath("/");
}

export async function deleteColumn(columnId: string) {
    await prisma.column.delete({
        where: {
            id: columnId,
        },
    });

    revalidatePath("/");
}

export async function updateTaskOrder(
    columns: {
        id: string;
        tasks: {
            id: string;
        }[];
    }[]
) {
    await prisma.$transaction(
        columns.flatMap((column) =>
            column.tasks.map((task, index) =>
                prisma.task.update({
                    where: {
                        id: task.id,
                    },
                    data: {
                        columnId: column.id,
                        order: index,
                    },
                })
            )
        )
    );

    revalidatePath("/");
}

export async function renameBoard(boardId: string, title: string) {
    await prisma.board.update({
        where: {
            id: boardId,
        },
        data: {
            title,
        },
    });

    revalidatePath("/");
}