import { prisma } from "@/lib/prisma";

export async function resetDemoBoard() {
    await prisma.task.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();

    await prisma.board.create({
        data: {
            title: "Portfolio Board",
            columns: {
                create: [
                    {
                        title: "Todo",
                        order: 0,
                        tasks: {
                            create: [
                                {
                                    title: "Create project structure",
                                    description: "Set up folders, components, types, and utilities.",
                                    priority: "High",
                                    order: 0,
                                },
                            ],
                        },
                    },
                    {
                        title: "In Progress",
                        order: 1,
                        tasks: {
                            create: [
                                {
                                    title: "Connect Prisma database",
                                    description: "Load board data from SQLite through Prisma.",
                                    priority: "Medium",
                                    order: 0,
                                },
                            ],
                        },
                    },
                    {
                        title: "Done",
                        order: 2,
                        tasks: {
                            create: [
                                {
                                    title: "Build drag and drop UI",
                                    description: "Move tasks between columns using dnd-kit.",
                                    priority: "High",
                                    order: 0,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
}