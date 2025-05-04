import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Tasky Features Documentation
      </h1>

      <div className="space-y-8">
        {/* ToDo (Sticky Notes) Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ToDo (Sticky Notes)</CardTitle>
            <CardDescription>
              Virtual corkboard for managing simple tasks or reminders as
              draggable sticky notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Core Functionality:
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Create:</strong> Add new notes via the '+' button.
                </li>
                <li>
                  <strong>Read:</strong> Displays existing notes on screen.
                </li>
                <li>
                  <strong>Update:</strong> Edit text directly; reposition via
                  drag & drop.
                </li>
                <li>
                  <strong>Delete:</strong> Remove notes using the 'X' button.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Key Features:</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Drag & Drop positioning.</li>
                <li>Randomized color and initial position for new notes.</li>
                <li>Visual styling with distinct colors and gradients.</li>
                <li>Active note highlighting (brought to front).</li>
                <li>Dynamic star background effect in dark mode.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Persistence:</h3>
              <p className="text-muted-foreground">
                Notes (text, position, color) are saved to{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  localStorage
                </code>{" "}
                under the key{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  tasky-sticky-notes
                </code>
                .
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">State Management:</h3>
              <p className="text-muted-foreground">
                Uses React{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  useState
                </code>{" "}
                within the{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  StickyNotesApp
                </code>{" "}
                component.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Notes</CardTitle>
            <CardDescription>
              Create, view, and edit richer notes including text and drawings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Core Functionality:
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Create:</strong> Add new notes via the 'New' button.
                </li>
                <li>
                  <strong>Read:</strong> Select notes from the list to view in
                  the editor pane.
                </li>
                <li>
                  <strong>Update:</strong> Modify title, text content, or
                  drawing in the editor. Requires explicit 'Save'.
                </li>
                <li>
                  <strong>Delete:</strong> Remove the currently selected note
                  via a button in the editor.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Key Features:</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Supports both text and drawing content.</li>
                <li>Two-pane layout (list and editor).</li>
                <li>Explicit edit mode toggle.</li>
                <li>
                  Relative timestamps for last update (e.g., "5 minutes ago").
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Persistence:</h3>
              <p className="text-muted-foreground">
                Notes (title, text, drawing data, timestamps) are saved to{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  localStorage
                </code>{" "}
                under the key{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  tasky-notes-data
                </code>
                .
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">State Management:</h3>
              <p className="text-muted-foreground">
                Uses React{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  useState
                </code>{" "}
                within the{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  NoteApp
                </code>{" "}
                component, passing state down via props.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress (Kanban Board) Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Progress (Kanban Board)</CardTitle>
            <CardDescription>
              Visualize and manage task progress across different stages using a
              Kanban board.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Core Functionality:
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Create:</strong> Add new tasks with title,
                  description, priority, and category via a dialog.
                </li>
                <li>
                  <strong>Read:</strong> Displays tasks organized into columns:
                  TODO, IN-PROGRESS, PARKED, DONE.
                </li>
                <li>
                  <strong>Update:</strong> Move tasks between columns (lanes)
                  via drag-and-drop (assumed). Task details may be editable.
                </li>
                <li>
                  <strong>Delete:</strong> Functionality to delete tasks is
                  likely present (assumed).
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Key Features:</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Column-based workflow visualization.</li>
                <li>Tasks include attributes like priority and category.</li>
                <li>Drag & Drop interface for task movement (assumed).</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Persistence:</h3>
              <p className="text-muted-foreground">
                Task data is saved to{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  localStorage
                </code>
                , with each lane stored under a separate key:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    kanban-lane-todo
                  </code>
                </li>
                <li>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    kanban-lane-in-progress
                  </code>
                </li>
                <li>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    kanban-lane-parked
                  </code>
                </li>
                <li>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    kanban-lane-done
                  </code>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">State Management:</h3>
              <p className="text-muted-foreground">
                Uses React{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  useState
                </code>{" "}
                within the{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  KanbanBoard
                </code>{" "}
                component to manage tasks (organized by lane), new task details,
                and dialog visibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
