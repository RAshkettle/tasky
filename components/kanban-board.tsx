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
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: "art" | "code" | "design" | "audio" | "other";
};

export type Lane = "TODO" | "IN-PROGRESS" | "PARKED" | "DONE";

export type KanbanData = {
  [key in Lane]: Task[];
};

const initialData: KanbanData = {
  TODO: [],
  "IN-PROGRESS": [],
  PARKED: [],
  DONE: [],
};

const laneOrder: Lane[] = ["TODO", "IN-PROGRESS", "PARKED", "DONE"];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanData>(initialData);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: "medium",
    category: "other",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const moveTask = (
    taskId: string,
    fromLane: Lane,
    toLane: Lane,
    toIndex?: number
  ) => {
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

      return newTasks;
    });
  };

  const reorderTask = (laneId: Lane, fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      const lane = [...newTasks[laneId]];
      const [movedTask] = lane.splice(fromIndex, 1);
      lane.splice(toIndex, 0, movedTask);
      newTasks[laneId] = lane;
      return newTasks;
    });
  };

  const handleAddTask = () => {
    const id = `task-${Date.now()}`;
    const task: Task = {
      id,
      ...newTask,
    };

    setTasks((prev) => ({
      ...prev,
      TODO: [...prev["TODO"], task],
    }));

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "other",
    });

    setIsDialogOpen(false);
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
          />
        ))}
      </div>
    </DndProvider>
  );
}
