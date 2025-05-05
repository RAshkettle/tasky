"use client";

import Swimlane from "@/components/swimlane";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/contexts/project-context";
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/**
 * Task data structure for the kanban board.
 */
export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: "art" | "code" | "design" | "audio" | "other";
};

/**
 * Lane types for the kanban board.
 */
export type Lane = "TODO" | "IN-PROGRESS" | "PARKED" | "DONE";

/**
 * Structure for organizing tasks by lane.
 */
export type KanbanData = {
  [key in Lane]: Task[];
};

/**
 * Base storage keys for each lane's local storage, will be prefixed with project name
 */
const BASE_STORAGE_KEYS: Record<Lane, string> = {
  TODO: "kanban-lane-todo",
  "IN-PROGRESS": "kanban-lane-in-progress",
  PARKED: "kanban-lane-parked",
  DONE: "kanban-lane-done",
};

const initialData: KanbanData = {
  TODO: [],
  "IN-PROGRESS": [],
  PARKED: [],
  DONE: [],
};

const laneOrder: Lane[] = ["TODO", "IN-PROGRESS", "PARKED", "DONE"];

/**
 * Kanban Board component for task management.
 *
 * @returns {JSX.Element} The rendered Kanban Board component
 */
export default function KanbanBoard(): JSX.Element {
  const {
    getProjectStorageKey,
    activeProject,
    isLoading: projectLoading,
  } = useProjects();
  const [tasks, setTasks] = useState<KanbanData>(initialData);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: "medium",
    category: "other",
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [storageKeys, setStorageKeys] =
    useState<Record<Lane, string>>(BASE_STORAGE_KEYS);

  // Update storage keys when active project changes
  useEffect(() => {
    if (projectLoading) return;

    const updatedKeys: Record<Lane, string> = {} as Record<Lane, string>;

    laneOrder.forEach((lane) => {
      updatedKeys[lane] = getProjectStorageKey(BASE_STORAGE_KEYS[lane]);
    });

    setStorageKeys(updatedKeys);
  }, [getProjectStorageKey, activeProject, projectLoading]);

  // Load each swimlane from localStorage on initial render or when project changes
  useEffect(() => {
    if (projectLoading) return;
    setIsLoaded(false);

    const loadedData: KanbanData = { ...initialData };
    let hasData = false;

    // Load data for each lane from its dedicated storage key
    laneOrder.forEach((lane) => {
      try {
        const savedLane = localStorage.getItem(storageKeys[lane]);
        if (savedLane) {
          loadedData[lane] = JSON.parse(savedLane);
          hasData = true;
        } else {
          // Reset lane when switching to a project with no saved data
          loadedData[lane] = [];
        }
      } catch (error) {
        console.error(`Failed to load ${lane} lane data:`, error);
      }
    });

    setTasks(loadedData);
    setIsLoaded(true);
  }, [storageKeys, projectLoading]);

  // Save a specific lane to localStorage
  const saveLane = useCallback(
    (lane: Lane, laneData: Task[]): void => {
      try {
        localStorage.setItem(storageKeys[lane], JSON.stringify(laneData));
      } catch (error) {
        console.error(`Failed to save ${lane} lane data:`, error);
      }
    },
    [storageKeys]
  );

  // When tasks change, save the specific lanes that changed
  useEffect(() => {
    if (!isLoaded || projectLoading) return;

    // Save each lane individually
    laneOrder.forEach((lane) => {
      saveLane(lane, tasks[lane]);
    });
  }, [tasks, isLoaded, saveLane, projectLoading]);

  const moveTask = (
    taskId: string,
    fromLane: Lane,
    toLane: Lane,
    toIndex?: number
  ): void => {
    setTasks((prev) => {
      const newTasks = { ...prev };

      // Find the task in the source lane
      const taskIndex = newTasks[fromLane].findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex === -1) return prev;

      // Remove the task from the source lane
      const [movedTask] = newTasks[fromLane].splice(taskIndex, 1);

      // Add the task to the destination lane at the specified index or at the end
      if (toIndex !== undefined) {
        newTasks[toLane].splice(toIndex, 0, movedTask);
      } else {
        newTasks[toLane].push(movedTask);
      }

      // Save both affected lanes immediately
      saveLane(fromLane, newTasks[fromLane]);
      saveLane(toLane, newTasks[toLane]);

      return newTasks;
    });
  };

  const reorderTask = (
    laneId: Lane,
    fromIndex: number,
    toIndex: number
  ): void => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      const lane = [...newTasks[laneId]];
      const [movedTask] = lane.splice(fromIndex, 1);
      lane.splice(toIndex, 0, movedTask);
      newTasks[laneId] = lane;

      // Save the affected lane immediately
      saveLane(laneId, newTasks[laneId]);

      return newTasks;
    });
  };

  const handleAddTask = (): void => {
    const id = `task-${Date.now()}`;
    const task: Task = {
      id,
      ...newTask,
    };

    setTasks((prev) => {
      const newTasks = {
        ...prev,
        TODO: [...prev["TODO"], task],
      };

      // Save the affected lane immediately
      saveLane("TODO", newTasks["TODO"]);

      return newTasks;
    });

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "other",
    });

    setIsDialogOpen(false);
  };

  // Function to update a task in any lane
  const updateTask = (taskId: string, updatedTaskData: Partial<Task>): void => {
    setTasks((prev) => {
      const newTasks = { ...prev };

      // Find which lane contains the task
      for (const lane of laneOrder) {
        const taskIndex = newTasks[lane].findIndex(
          (task) => task.id === taskId
        );

        if (taskIndex >= 0) {
          // Update the task
          newTasks[lane][taskIndex] = {
            ...newTasks[lane][taskIndex],
            ...updatedTaskData,
          };

          // Save the affected lane immediately
          saveLane(lane, newTasks[lane]);

          break;
        }
      }

      return newTasks;
    });
  };

  // Function to delete a task from any lane
  const deleteTask = (taskId: string): void => {
    setTasks((prev) => {
      const newTasks = { ...prev };

      // Find which lane contains the task
      for (const lane of laneOrder) {
        const taskIndex = newTasks[lane].findIndex(
          (task) => task.id === taskId
        );

        if (taskIndex >= 0) {
          // Remove the task
          newTasks[lane].splice(taskIndex, 1);

          // Save the affected lane immediately
          saveLane(lane, newTasks[lane]);

          break;
        }
      }

      return newTasks;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold"></h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        category: e.target.value as
                          | "art"
                          | "code"
                          | "design"
                          | "audio"
                          | "other",
                      })
                    }
                  >
                    <option value="art">Art</option>
                    <option value="code">Code</option>
                    <option value="design">Design</option>
                    <option value="audio">Audio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <Button onClick={handleAddTask} disabled={!newTask.title}>
              Add Task
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {laneOrder.map((laneId) => (
          <Swimlane
            key={laneId}
            laneId={laneId}
            tasks={tasks[laneId]}
            onMoveTask={moveTask}
            onReorderTask={reorderTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
    </DndProvider>
  );
}
