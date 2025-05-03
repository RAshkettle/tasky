import { Apple, CheckCircle, Github, Mail } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Login to your account</DialogTitle>
                <DialogDescription>
                  Choose one of the following methods to login to your account.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-start"
                >
                  <Github className="h-4 w-4" />
                  <span>Continue with GitHub</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-start"
                >
                  <Mail className="h-4 w-4" />
                  <span>Continue with Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 justify-start"
                >
                  <Apple className="h-4 w-4" />
                  <span>Continue with Apple</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
