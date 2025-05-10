"use client";

import type { Lane, Task } from "@/components/kanban-board";
import TaskCard from "@/components/task-card";
import { JSX, useRef } from "react";
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
  const dropRef = useRef<HTMLDivElement>(null);
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

  // Connect the drop ref
  drop(dropRef);

  const getLaneColor = (lane: Lane): string => {
    switch (lane) {
      case "TODO":
        return "bg-purple-50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-800";
      case "IN-PROGRESS":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900";
      case "PARKED":
        return "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-900";
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

  const getLaneClass = (lane: Lane): string => {
    switch (lane) {
      case "TODO":
        return "todo-lane";
      case "IN-PROGRESS":
        return "in-progress-lane";
      case "PARKED":
        return "parked-lane";
      case "DONE":
        return "done-lane";
      default:
        return "";
    }
  };

  return (
    <div
      ref={dropRef}
      className={`flex flex-col rounded-lg border-2 ${getLaneColor(laneId)} ${
        isOver ? "ring-2 ring-primary" : ""
      } h-[440px] overflow-x-hidden ${getLaneClass(laneId)}`}
    >
      <div className="p-3 border-b-2 font-medium text-center shrink-0">
        {getLaneTitle(laneId)} ({tasks.length})
      </div>
      <div className="overflow-y-auto overflow-x-hidden p-2">
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
