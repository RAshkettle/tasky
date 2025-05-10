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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Projects</CardTitle>
            <CardDescription>
              Create and manage separate workspaces for different contexts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Core Functionality:
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Create:</strong> Add new projects with a name and
                  optional description.
                </li>
                <li>
                  <strong>Switch:</strong> Change between projects to access
                  different sets of data.
                </li>
                <li>
                  <strong>Update:</strong> Edit project names and descriptions
                  as needed.
                </li>
                <li>
                  <strong>Delete:</strong> Remove projects you no longer need.
                </li>
                <li>
                  <strong>Active Project:</strong> The current project is
                  displayed in the header.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Key Features:</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  Separation of concerns with distinct projects for different
                  work contexts.
                </li>
                <li>
                  Each project has its own ToDos, Notes, Issues, and Kanban
                  board.
                </li>
                <li>
                  Project timestamp shows when it was created or last updated.
                </li>
                <li>Visual indicators for the currently active project.</li>
                <li>Quick switching between projects from the project page.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Persistence:</h3>
              <p className="text-muted-foreground">
                Project data is saved to{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  localStorage
                </code>{" "}
                under the key{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  tasky-projects
                </code>
                . Each project's data (todos, notes, issues, kanban) is stored
                with the project name as a prefix.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ToDo (Sticky reminders) Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ToDo (Reminders)</CardTitle>
            <CardDescription>
              Virtual corkboard for managing simple tasks or reminders as
              draggable sticky reminders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Core Functionality:
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Create:</strong> Add new reminders via the '+' button.
                </li>
                <li>
                  <strong>Read:</strong> Displays existing reminders on screen.
                </li>
                <li>
                  <strong>Update:</strong> Edit text directly; reposition via
                  drag & drop.
                </li>
                <li>
                  <strong>Delete:</strong> Remove reminders using the 'X'
                  button.
                </li>
                <li>
                  <strong>DateTime Stamp:</strong> Each note has an immutable
                  date time stamp for when it was created.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Key Features:</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Drag & Drop positioning.</li>
                <li>
                  Randomized color and initial position for new reminders.
                </li>
                <li>Visual styling with distinct colors and gradients.</li>
                <li>Active note highlighting (brought to front).</li>
                <li>Dynamic star background effect in dark mode.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Persistence:</h3>
              <p className="text-muted-foreground">
                reminders (text, position, color) are saved to{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  localStorage
                </code>{" "}
                under the key{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  tasky-sticky-reminders
                </code>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Notes</CardTitle>
            <CardDescription>
              Create, view and edit markdown files as notes for your game.
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
                  <strong>Read:</strong> Select a note from the list to view in
                  the editor pane.
                </li>
                <li>
                  <strong>Update:</strong> Modify title or content in Markdown.
                  Requires explicit 'Save'.
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
          </CardContent>
        </Card>

        {/* Issues Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Issues</CardTitle>
            <CardDescription>
              Track and manage work items with status tracking and Kanban
              integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Core Functionality:
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <strong>Create:</strong> Add new issues with title,
                  description, status, and priority.
                </li>
                <li>
                  <strong>Read:</strong> View issues with filtering options for
                  status and priority.
                </li>
                <li>
                  <strong>Update:</strong> Edit issue details including title,
                  description, status, and priority.
                </li>
                <li>
                  <strong>Delete:</strong> Remove issues with confirmation
                  dialog.
                </li>
                <li>
                  <strong>Status Workflow:</strong> Issues progress through
                  stages: Investigate → Todo → In Progress → Parked → Done.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Key Features:</h3>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  Kanban board integration with automatic task creation when
                  issues move from Investigate status.
                </li>
                <li>
                  Bidirectional sync between Issues and Kanban (changes in one
                  update the other).
                </li>
                <li>Color-coded status and priority indicators.</li>
                <li>
                  Search and filter capabilities for finding specific issues.
                </li>
                <li>Issue details dialog with full editing capabilities.</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Persistence:</h3>
              <p className="text-muted-foreground">
                Issues are saved to{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  localStorage
                </code>{" "}
                under the key{" "}
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  {"{project-name}:tasky-issues-data"}
                </code>
                , where the project name prefix ensures each project has
                separate issues.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Kanban</CardTitle>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
