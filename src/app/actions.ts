"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createTask(columnId: string, title: string) {
    const taskCount = await prisma.task.count({
        where: {
            columnId,
        },
    });

    await prisma.task.create({
        data: {
            title,
            priority: "Medium",
            order: taskCount,
            columnId,
        },
    });

    revalidatePath("/");
}