"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/project-context";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Reminder } from "./reminder";
import Todo from "./todo";

const BASE_STORAGE_KEY = "tasky-sticky-notes"; // Base key, will be prefixed with project name

// Check if localStorage is available
const isStorageAvailable = (() => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn("localStorage is not available. Reminders will not be saved.");
    return false;
  }
})();

export default function StickyNotesApp() {
  const { getProjectStorageKey, activeProject, isLoading } = useProjects();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeReminder, setActiveReminder] = useState<string | null>(null);
  const [draggedReminder, setDraggedReminder] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [storageKey, setStorageKey] = useState(BASE_STORAGE_KEY);

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const longPressDelay = 500; // 500ms for long press

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Function to ensure reminders are within the visible area
  const ensureRemindersInViewport = useCallback(() => {
    if (reminders.length === 0) return;

    // Calculate the maximum usable area (with margins)
    const maxX = windowSize.width - 280; // 280 = 264 (card width) + margins
    const maxY = windowSize.height - 180; // 180 = approximate min height of card + margins
    const minX = 10;
    const minY = 60; // Allow space for the header

    let remindersNeedRepositioning = false;

    const repositionedReminders = reminders.map((reminder) => {
      // If the reminder is out of bounds, reposition it
      if (
        reminder.left < minX ||
        reminder.left > maxX ||
        reminder.top < minY ||
        reminder.top > maxY
      ) {
        remindersNeedRepositioning = true;

        return {
          ...reminder,
          left:
            reminder.left < minX || reminder.left > maxX
              ? Math.max(minX, Math.min(reminder.left, maxX))
              : reminder.left,
          top:
            reminder.top < minY || reminder.top > maxY
              ? Math.max(minY, Math.min(reminder.top, maxY))
              : reminder.top,
        };
      }
      return reminder;
    });

    // Only update if reminders needed repositioning
    if (remindersNeedRepositioning) {
      setReminders(repositionedReminders);
    }
  }, [reminders, windowSize]);

  // Track window resize events
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial setup
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Apply viewport constraints when window size changes or reminders change
  useEffect(() => {
    ensureRemindersInViewport();
  }, [windowSize, ensureRemindersInViewport]);

  // Additional check after reminders are loaded
  useEffect(() => {
    if (!isLoading && reminders.length > 0) {
      ensureRemindersInViewport();
    }
  }, [isLoading, reminders.length, ensureRemindersInViewport]);

  // Update storage key when active project changes
  useEffect(() => {
    if (!isLoading) {
      setStorageKey(getProjectStorageKey(BASE_STORAGE_KEY));
    }
  }, [getProjectStorageKey, activeProject, isLoading]);

  // Load reminders from localStorage on initial render or when active project changes
  useEffect(() => {
    if (!isStorageAvailable || isLoading) return;

    try {
      const savedReminders = localStorage.getItem(storageKey);
      if (savedReminders) {
        const parsedReminders = JSON.parse(savedReminders);
        setReminders(parsedReminders);
      } else {
        // If no reminders found for this project, start with empty array
        setReminders([]);
      }
    } catch (e) {
      console.error("Failed to load reminders from localStorage:", e);
    }
  }, [storageKey, isLoading]);

  // Debounced save to localStorage
  const saveRemindersToStorage = useCallback(() => {
    if (!isStorageAvailable) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(reminders));
    } catch (e) {
      console.error("Failed to save reminders to localStorage:", e);
    }
  }, [reminders, storageKey]);

  // Use a debounced effect for saving
  useEffect(() => {
    // Skip during loading or if no reminders
    if (isLoading) return;

    const timeoutId = setTimeout(() => {
      saveRemindersToStorage();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [reminders, saveRemindersToStorage, isLoading]);

  const colors = [
    "bg-yellow-200/50 border-yellow-400 from-yellow-300/70 to-yellow-200/70",
    "bg-green-200/50 border-green-400 from-green-300/70 to-green-200/70",
    "bg-blue-200/50 border-blue-400 from-blue-300/70 to-blue-200/70",
    "bg-pink-200/50 border-pink-400 from-pink-300/70 to-pink-200/70",
    "bg-purple-200/50 border-purple-400 from-purple-300/70 to-purple-200/70",
  ];

  const addReminder = () => {
    // Ensure the new reminder is placed within the visible area
    const maxX = windowSize.width - 280;
    const maxY = windowSize.height - 180;
    const minX = 10;
    const minY = 60;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      text: "",
      left: Math.min(
        maxX,
        Math.max(minX, Math.random() * (windowSize.width - 250))
      ),
      top: Math.min(
        maxY,
        Math.max(minY, Math.random() * (windowSize.height - 250))
      ),
      color: colors[Math.floor(Math.random() * colors.length)],
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    setReminders([...reminders, newReminder]);
    setActiveReminder(newReminder.id);
  };

  const updateReminderText = (id: string, text: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, text, updatedAt: Date.now() }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, reminderId: string) => {
    // Only allow dragging from the header
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDraggedReminder(reminderId);

    // Prevent default to avoid text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedReminder) return;

    // Update the reminder position based on mouse position and initial offset
    setReminders(
      reminders.map((reminder) => {
        if (reminder.id === draggedReminder) {
          return {
            ...reminder,
            left: e.clientX - dragOffset.x,
            top: e.clientY - dragOffset.y,
          };
        }
        return reminder;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggedReminder(null);
  };

  const handleTouchStart = (e: React.TouchEvent, reminderId: string) => {
    // Store the current target element reference
    const targetElement = e.currentTarget;

    // Start a timer for long press detection
    const timer = setTimeout(() => {
      try {
        // Check if the element is still in the DOM
        if (targetElement && document.body.contains(targetElement)) {
          // Only allow dragging from the header
          const rect = targetElement.getBoundingClientRect();
          const touch = e.touches[0];

          if (touch) {
            setDragOffset({
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top,
            });

            setDraggedReminder(reminderId);

            // Provide haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          }
        }
      } catch (error) {
        console.error("Error in touch handler:", error);
        // Clear any drag state to prevent unexpected behavior
        setDraggedReminder(null);
      }
    }, longPressDelay);

    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedReminder) return;

    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];

    // Update the reminder position based on touch position and initial offset
    setReminders(
      reminders.map((reminder) => {
        if (reminder.id === draggedReminder) {
          return {
            ...reminder,
            left: touch.clientX - dragOffset.x,
            top: touch.clientY - dragOffset.y,
          };
        }
        return reminder;
      })
    );
  };

  const handleTouchEnd = () => {
    // Clear the long press timer if touch ends before the timer fires
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    setDraggedReminder(null);
  };

  useEffect(() => {
    // Add global mouse event listeners for dragging
    if (draggedReminder) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        setReminders(
          reminders.map((reminder) => {
            if (reminder.id === draggedReminder) {
              return {
                ...reminder,
                left: e.clientX - dragOffset.x,
                top: e.clientY - dragOffset.y,
              };
            }
            return reminder;
          })
        );
      };

      const handleGlobalMouseUp = () => {
        setDraggedReminder(null);
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [draggedReminder, dragOffset, reminders]);

  useEffect(() => {
    // Add global touch event listeners for dragging
    if (draggedReminder) {
      const handleGlobalTouchMove = (e: TouchEvent) => {
        if (!e.touches[0]) return;

        const touch = e.touches[0];
        setReminders(
          reminders.map((reminder) => {
            if (reminder.id === draggedReminder) {
              return {
                ...reminder,
                left: touch.clientX - dragOffset.x,
                top: touch.clientY - dragOffset.y,
              };
            }
            return reminder;
          })
        );
      };

      const handleGlobalTouchEnd = () => {
        setDraggedReminder(null);
      };

      document.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleGlobalTouchEnd);

      return () => {
        document.removeEventListener("touchmove", handleGlobalTouchMove);
        document.removeEventListener("touchend", handleGlobalTouchEnd);
      };
    }
  }, [draggedReminder, dragOffset, reminders]);

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  return (
    <div
      className="min-h-screen relative overflow-hidden dark:bg-none"
      style={{
        background: "linear-gradient(to top, #000000, #4a00a0)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Light mode background overlay */}
      <div className="absolute inset-0 bg-slate-200/95 dark:hidden" />
      {/* Stars effect - only visible in dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:block hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${
                Math.random() * 5 + 3
              }s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      {/* Floating Add Button - always visible */}
      <Button
        onClick={addReminder}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl z-[100] bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-110 animate-in slide-in-from-bottom-6"
        aria-label="Add new reminder"
      >
        <Plus className="h-6 w-6" />
      </Button>
      {reminders.map((reminder) => {
        return (
          <Todo
            reminder={reminder}
            draggedreminder={draggedReminder}
            activereminder={activeReminder}
            setActivereminder={setActiveReminder}
            deletereminder={deleteReminder}
            updateremindertext={updateReminderText}
            handleMouseDown={handleMouseDown}
            handleTouchStart={handleTouchStart}
            key={reminder.id}
          />
        );
      })}
    </div>
  );
}
