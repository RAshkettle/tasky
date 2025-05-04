"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (path: string) =>
    `text-sm font-medium hover:text-primary px-3 py-1 rounded-md transition-colors ${
      pathname === path
        ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
        : ""
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-sky-100 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-sky-100/90 dark:supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            Tasky
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/todos" className={getLinkClass("/todos")}>
            ToDo
          </Link>
          <Link href="/notes" className={getLinkClass("/notes")}>
            Notes
          </Link>
          <Link href="/progress" className={getLinkClass("/progress")}>
            Progress
          </Link>
          <Link href="#" className={getLinkClass("/graph")}>
            Graph
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
