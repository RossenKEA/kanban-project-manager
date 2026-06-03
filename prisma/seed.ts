import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
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
                    },
                    {
                        title: "Done",
                        order: 2,
                    },
                ],
            },
        },
    });

    console.log("Demo board reset.");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });