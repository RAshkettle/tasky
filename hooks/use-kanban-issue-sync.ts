import type { Lane, Task } from "@/components/kanban-board";
import { useCallback, useEffect } from "react";
import type { Issue, IssueStatus } from "../types/issue";

/**
 * Hook to keep issues and kanban tasks in sync
 * This listens for changes to the kanban board in localStorage and updates issues accordingly
 */
export function useKanbanIssueSync(
  issues: Issue[],
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>,
  kanbanStorageKeys: Record<Lane, string>,
  saveIssuesToStorage: (issues: Issue[]) => void
) {
  // Extract issue ID from a kanban task ID
  const getIssueIdFromTaskId = (taskId: string): string | null => {
    // Task IDs from issues are prefixed with "issue-"
    if (taskId.startsWith("issue-")) {
      return taskId.substring(6); // Remove the "issue-" prefix
    }
    return null;
  };

  // Convert lane name to status
  const laneToStatus = (lane: Lane): IssueStatus => {
    return lane as IssueStatus;
  };

  // Handler for when a task changes lane in the kanban board
  const handleKanbanTaskMove = useCallback(
    (taskId: string, newLane: Lane) => {
      const issueId = getIssueIdFromTaskId(taskId);
      if (!issueId) return;

      const issue = issues.find((i) => i.id === issueId);
      if (!issue) return;

      const newStatus = laneToStatus(newLane);

      // Only update if status has changed
      if (issue.status !== newStatus) {
        const updatedIssues = issues.map((i) =>
          i.id === issueId ? { ...i, status: newStatus } : i
        );

        setIssues(updatedIssues);
        saveIssuesToStorage(updatedIssues);
      }
    },
    [issues, setIssues, saveIssuesToStorage]
  );

  // Monitor kanban lanes for changes
  useEffect(() => {
    // Create a mapping of taskId -> lane for all current tasks
    const getCurrentTasks = (): Map<string, Lane> => {
      const taskMap = new Map<string, Lane>();

      Object.entries(kanbanStorageKeys).forEach(([lane, key]) => {
        try {
          const savedLane = localStorage.getItem(key);
          if (savedLane) {
            const tasks: Task[] = JSON.parse(savedLane);
            tasks.forEach((task) => {
              if (task.id.startsWith("issue-")) {
                taskMap.set(task.id, lane as Lane);
              }
            });
          }
        } catch (error) {
          console.error(`Failed to parse ${lane} lane:`, error);
        }
      });

      return taskMap;
    };

    // Store the current state
    let previousTaskMap = getCurrentTasks();

    // Handler for storage events
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is for one of our kanban lanes
      const laneEntry = Object.entries(kanbanStorageKeys).find(
        ([_, key]) => key === event.key
      );

      if (laneEntry) {
        const [lane] = laneEntry;
        const currentTaskMap = getCurrentTasks();

        // Find tasks that have moved
        currentTaskMap.forEach((currentLane, taskId) => {
          const previousLane = previousTaskMap.get(taskId);

          // Task is in a new lane or is new
          if (previousLane !== currentLane) {
            handleKanbanTaskMove(taskId, currentLane);
          }
        });

        // Store the new state
        previousTaskMap = currentTaskMap;
      }
    };

    // Check for changes on regular intervals
    const intervalId = setInterval(() => {
      const currentTaskMap = getCurrentTasks();
      let hasChanges = false;

      // Check for tasks that have moved
      currentTaskMap.forEach((currentLane, taskId) => {
        const previousLane = previousTaskMap.get(taskId);
        if (previousLane !== currentLane) {
          handleKanbanTaskMove(taskId, currentLane);
          hasChanges = true;
        }
      });

      // Check for tasks that have been removed
      previousTaskMap.forEach((lane, taskId) => {
        if (!currentTaskMap.has(taskId)) {
          // Task was removed - no action needed for now since
          // we don't automatically delete issues when tasks are deleted
          hasChanges = true;
        }
      });

      // Update previous state if there were changes
      if (hasChanges) {
        previousTaskMap = currentTaskMap;
      }
    }, 1000); // Check every second

    // Add event listener for storage events (if multiple tabs are open)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [kanbanStorageKeys, handleKanbanTaskMove]);
}
