"use client";

import type { Lane, Task } from "@/components/kanban-board";
import TaskCard from "@/components/task-card";
import { useDrop } from "react-dnd";

/**
 * Props interface for the Swimlane component.
 */
interface SwimlaneProps {
  laneId: Lane;
  tasks: Task[];
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
 * Swimlane component for the Kanban Board.
 *
 * @param {SwimlaneProps} props - Component properties
 * @returns {JSX.Element} The rendered Swimlane component
 */
export default function Swimlane({
  laneId,
  tasks,
  onMoveTask,
  onReorderTask,
  onUpdateTask,
  onDeleteTask,
}: SwimlaneProps): JSX.Element {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: string; laneId: Lane; index: number }): void => {
      if (item.laneId !== laneId) {
        onMoveTask(item.id, item.laneId, laneId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getLaneColor = (lane: Lane): string => {
    switch (lane) {
      case "TODO":
        return "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900";
      case "IN-PROGRESS":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900";
      case "PARKED":
        return "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900";
      case "DONE":
        return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  const getLaneTitle = (lane: Lane): string => {
    switch (lane) {
      case "TODO":
        return "To Do";
      case "IN-PROGRESS":
        return "In Progress";
      case "PARKED":
        return "Parked";
      case "DONE":
        return "Done";
      default:
        return lane;
    }
  };

  return (
    <div
      ref={drop}
      className={`flex flex-col h-full min-h-[500px] rounded-lg border-2 ${getLaneColor(
        laneId
      )} ${isOver ? "ring-2 ring-primary" : ""}`}
    >
      <div className="p-3 border-b-2 font-medium text-center">
        {getLaneTitle(laneId)} ({tasks.length})
      </div>
      <div className="flex-1 p-2 overflow-y-auto">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            laneId={laneId}
            onMoveTask={onMoveTask}
            onReorderTask={onReorderTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}
