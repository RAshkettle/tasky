import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            Tasky
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/tasks"
            className="text-sm font-medium hover:text-primary"
          >
            Tasks
          </Link>
          <Link
            href="/notes"
            className="text-sm font-medium hover:text-primary"
          >
            Notes
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            Progress
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            Graph
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
