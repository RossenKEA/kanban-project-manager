interface TaskCardProps {
  title: string;
}

export default function TaskCard({ title }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200">
      {title}
    </div>
  );
}