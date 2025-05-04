import KanbanBoard from "@/components/kanban-board";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Game Development Kanban</h1>
        <ThemeToggle />
      </div>
      <KanbanBoard />
    </main>
  );
}
