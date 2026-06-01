export interface Task {
    id: string;
    title: string;
    description?: string;
    priority?: "Low" | "Medium" | "High";
    dueDate?: string;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}