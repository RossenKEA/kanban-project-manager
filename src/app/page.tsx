import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  {
    title: "Todo",
    tasks: ["Create project structure", "Design board UI"],
  },
  {
    title: "In Progress",
    tasks: ["Build Kanban page"],
  },
  {
    title: "Done",
    tasks: ["Set up Next.js"],
  },
];

export default function Home() {
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

        <section className="grid gap-6 md:grid-cols-3">
          {columns.map((column) => (
            <Card key={column.title} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-100">{column.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200"
                  >
                    {task}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}