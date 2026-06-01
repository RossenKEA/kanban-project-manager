import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.task.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();

    const board = await prisma.board.create({
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

    console.log("Seeded board:", board.title);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });