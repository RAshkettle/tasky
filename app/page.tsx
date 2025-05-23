import Footer from "@/components/footer";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, CheckCircle, FileText, ListTodo } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Put your ideas down in one place
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Stop hunting for where you put that note when the clock is
                    ticking.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/learn"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg",
                    })}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <img
                src="/tasky.svg"
                alt="Tasky Logo"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  All your game jam planning needs in one place
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Tasky
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
              <Card className="p-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <ListTodo className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">ToDo</h3>
                  <p className="text-muted-foreground">
                    Create simple todo's to keep as reminders.
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <FileText className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Notes</h3>
                  <p className="text-muted-foreground">
                    Capture your ideas and sketches in one place.
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <BarChart3 className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Issues</h3>
                  <p className="text-muted-foreground">
                    All your issues and bugs all in one place.
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <CheckCircle className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Kanban</h3>
                  <p className="text-muted-foreground">
                    Track your progress with tasks on a simple no-frills Kanban
                    board.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
