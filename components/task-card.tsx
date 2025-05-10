"use client";

import type { Lane, Task } from "@/components/kanban-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BugIcon,
  CodeIcon,
  EditIcon,
  LayoutIcon,
  MoreHorizontalIcon,
  MusicIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

/**
 * Props interface for the TaskCard component.
 *
 * @interface TaskCardProps
 * @property {Task} task - The task data to display in the card
 * @property {number} index - Position index of this task in its parent lane
 * @property {Lane} laneId - Identifier of the parent lane containing this task
 * @property {Function} onMoveTask - Callback for moving a task between lanes
 * @property {Function} onReorderTask - Callback for reordering tasks within a lane
 * @property {Function} [onUpdateTask] - Optional callback for updating task properties
 * @property {Function} [onDeleteTask] - Optional callback for deleting a task
 */
interface TaskCardProps {
  task: Task;
  index: number;
  laneId: Lane;
  onMoveTask: (
    taskId: string,
    fromLane: Lane,
    toLane: Lane,
    toIndex?: number
  ) => void;
  onReorderTask: (laneId: Lane, fromIndex: number, toIndex: number) => void;
  onUpdateTask?: (taskId: string, updatedTaskData: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
}

/**
 * TaskCard component for the Kanban Board.
 *
 * @param {TaskCardProps} props - Component properties
 * @returns {JSX.Element} The rendered TaskCard component
 */
export default function TaskCard({
  task,
  index,
  laneId,
  onMoveTask,
  onReorderTask,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<
    Partial<Task> & { swimlane?: Lane }
  >({
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    swimlane: laneId,
  });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const longPressDelay = 500; // 500ms for long press
  const [isDraggable, setIsDraggable] = useState(false);

  // When task prop changes, update the editedTask state
  useEffect(() => {
    setEditedTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      swimlane: laneId,
    });
  }, [task, laneId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Start a timer for long press detection
    const timer = setTimeout(() => {
      // Enable dragging after long press
      setIsDraggable(true);

      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, longPressDelay);

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    // Clear the long press timer if touch ends before the timer fires
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Reset draggable state after a short delay to allow the drop to complete
    setTimeout(() => {
      setIsDraggable(false);
    }, 100);
  };

  // Clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  const handleUpdateTask = (): void => {
    if (onUpdateTask && editedTask.title) {
      // Extract swimlane from editedTask to handle it separately
      const { swimlane, ...taskData } = editedTask;

      // Update the task data (title, description, etc.)
      onUpdateTask(task.id, taskData);

      // If swimlane has changed, move the task to the new lane
      if (swimlane && swimlane !== laneId) {
        onMoveTask(task.id, laneId, swimlane);
      }

      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTask = (): void => {
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
  };

  /**
   * Interface defining the data structure for drag operations
   */
  interface TaskDragItem {
    id: string;
    laneId: Lane;
    index: number;
  }

  const [{ isDragging }, drag] = useDrag<
    TaskDragItem,
    unknown,
    { isDragging: boolean }
  >({
    type: "task",
    item: { id: task.id, laneId, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () =>
      window.matchMedia("(min-width: 768px)").matches || isDraggable,
  });

  const [{ handlerId }, drop] = useDrop<
    TaskDragItem,
    unknown,
    { handlerId: string | symbol | null }
  >({
    accept: "task",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { id: string; laneId: Lane; index: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceLane = item.laneId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceLane === laneId) {
        return;
      }

      // Only perform the move when the mouse has crossed half of the item's height
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      if (sourceLane === laneId) {
        onReorderTask(laneId, dragIndex, hoverIndex);
        // Update the index for the dragged item
        item.index = hoverIndex;
      } else {
        // If moving from another lane, we need to handle it differently
        onMoveTask(item.id, sourceLane, laneId, hoverIndex);
        item.index = hoverIndex;
        item.laneId = laneId;
      }
    },
  });

  drag(drop(ref));

  const getCategoryIcon = (category: string): JSX.Element => {
    switch (category) {
      case "art":
        return <PencilIcon className="h-4 w-4 mr-1" />;
      case "code":
        return <CodeIcon className="h-4 w-4 mr-1" />;
      case "design":
        return <LayoutIcon className="h-4 w-4 mr-1" />;
      case "audio":
        return <MusicIcon className="h-4 w-4 mr-1" />;
      case "bugfix":
        return <BugIcon className="h-4 w-4 mr-1" />;
      default:
        return <MoreHorizontalIcon className="h-4 w-4 mr-1" />;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`mb-2 transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Card className="shadow-sm hover:shadow">
        <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          <div className="flex space-x-1">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <EditIcon className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                  <DialogDescription>
                    Make changes to your task here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editedTask.title || ""}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, title: e.target.value })
                      }
                      placeholder="Task title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editedTask.description || ""}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          description: e.target.value,
                        })
                      }
                      placeholder="Task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-priority">Priority</Label>
                      <select
                        id="edit-priority"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editedTask.priority}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            priority: e.target.value as
                              | "low"
                              | "medium"
                              | "high",
                          })
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <select
                        id="edit-category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editedTask.category}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            category: e.target.value as
                              | "art"
                              | "code"
                              | "design"
                              | "audio"
                              | "bugfix"
                              | "other",
                          })
                        }
                      >
                        <option value="art">Art</option>
                        <option value="code">Code</option>
                        <option value="design">Design</option>
                        <option value="audio">Audio</option>
                        <option value="bugfix">Bugfix</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-swimlane">Swimlane</Label>
                    <select
                      id="edit-swimlane"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editedTask.swimlane}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          swimlane: e.target.value as Lane,
                        })
                      }
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN-PROGRESS">In Progress</option>
                      <option value="PARKED">Parked</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="destructive" onClick={handleDeleteTask}>
                    Delete
                  </Button>
                  <Button
                    onClick={handleUpdateTask}
                    disabled={!editedTask.title}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDeleteTask}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-2 cursor-move">
          <CardDescription className="text-xs">
            {task.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between cursor-move">
          <Badge variant="outline" className="flex items-center text-xs">
            {getCategoryIcon(task.category)}
            {task.category}
          </Badge>
          <Badge
            className={`text-xs ${getPriorityColor(
              task.priority
            )} cursor-default`}
          >
            {task.priority}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
