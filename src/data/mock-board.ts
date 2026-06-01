import { Column } from "@/types/kanban";

export const mockColumns: Column[] = [
    {
        id: "todo",
        title: "Todo",
        tasks: [
            {
                id: "1",
                title: "Create project structure",
                description: "Set up folders for components, data, types, and utilities.",
                priority: "High",
            },
            {
                id: "2",
                title: "Design board UI",
                description: "Design a cool UI with fimga!",
                priority: "Medium",
            },
        ],
    },
    {
        id: "progress",
        title: "In Progress",
        tasks: [
            {
                id: "3",
                title: "Build Kanban page",
                description: "Set up data, and types.",
                priority: "Low",
            },
        ],
    },
    {
        id: "done",
        title: "Done",
        tasks: [
            {
                id: "4",
                title: "Set up Next.js",
                description: "Open the terminal and run the correct command.",
                priority: "Medium",
            },
        ],
    },
];