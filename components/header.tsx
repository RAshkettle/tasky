"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProjects } from "@/contexts/project-context";
import { CheckCircle, FolderKanban, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const pathname = usePathname();
  const { activeProject } = useProjects();
  const [menuOpen, setMenuOpen] = useState(false);

  const getLinkClass = (path: string) =>
    `text-sm font-medium hover:text-primary px-3 py-1 rounded-md transition-colors ${
      pathname === path
        ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
        : ""
    }`;

  const getMobileLinkClass = (path: string) =>
    `text-sm font-medium w-full text-left px-3 py-3 rounded-md transition-colors ${
      pathname === path
        ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
        : "hover:bg-muted"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-sky-100 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-sky-100/90 dark:supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            Tasky
          </Link>
          {activeProject && (
            <div className="ml-4 flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-md text-sm">
              <FolderKanban className="h-4 w-4 text-primary" />
              <span className="font-mono italic font-medium">
                {activeProject.name}
              </span>
            </div>
          )}
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/projects" className={getLinkClass("/projects")}>
            Projects
          </Link>
          <Link href="/todos" className={getLinkClass("/todos")}>
            ToDo
          </Link>
          <Link href="/notes" className={getLinkClass("/notes")}>
            Notes
          </Link>
          <Link href="/progress" className={getLinkClass("/progress")}>
            Progress
          </Link>
          <Link href="/graph" className={getLinkClass("/graph")}>
            Graph
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="h-10 w-10"
              >
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 py-4">
                <Link
                  href="/projects"
                  className={getMobileLinkClass("/projects")}
                  onClick={() => setMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  href="/todos"
                  className={getMobileLinkClass("/todos")}
                  onClick={() => setMenuOpen(false)}
                >
                  ToDo
                </Link>
                <Link
                  href="/notes"
                  className={getMobileLinkClass("/notes")}
                  onClick={() => setMenuOpen(false)}
                >
                  Notes
                </Link>
                <Link
                  href="/progress"
                  className={getMobileLinkClass("/progress")}
                  onClick={() => setMenuOpen(false)}
                >
                  Progress
                </Link>
                <Link
                  href="/graph"
                  className={getMobileLinkClass("/graph")}
                  onClick={() => setMenuOpen(false)}
                >
                  Graph
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
