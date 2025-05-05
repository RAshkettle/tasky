"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/project-context";
import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Note = {
  id: string;
  text: string;
  left: number;
  top: number;
  color: string;
  updatedAt?: number;
};

const BASE_STORAGE_KEY = "tasky-sticky-notes"; // Base key, will be prefixed with project name

// Check if localStorage is available
const isStorageAvailable = (() => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn("localStorage is not available. Notes will not be saved.");
    return false;
  }
})();

export default function StickyNotesApp() {
  const { getProjectStorageKey, activeProject, isLoading } = useProjects();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
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

  // Function to ensure notes are within the visible area
  const ensureNotesInViewport = useCallback(() => {
    if (notes.length === 0) return;

    // Calculate the maximum usable area (with margins)
    const maxX = windowSize.width - 280; // 280 = 264 (card width) + margins
    const maxY = windowSize.height - 180; // 180 = approximate min height of card + margins
    const minX = 10;
    const minY = 60; // Allow space for the header

    let notesNeedRepositioning = false;

    const repositionedNotes = notes.map((note) => {
      // If the note is out of bounds, reposition it
      if (
        note.left < minX ||
        note.left > maxX ||
        note.top < minY ||
        note.top > maxY
      ) {
        notesNeedRepositioning = true;

        return {
          ...note,
          left:
            note.left < minX || note.left > maxX
              ? Math.max(minX, Math.min(note.left, maxX))
              : note.left,
          top:
            note.top < minY || note.top > maxY
              ? Math.max(minY, Math.min(note.top, maxY))
              : note.top,
        };
      }
      return note;
    });

    // Only update if notes needed repositioning
    if (notesNeedRepositioning) {
      setNotes(repositionedNotes);
    }
  }, [notes, windowSize]);

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

  // Apply viewport constraints when window size changes or notes change
  useEffect(() => {
    ensureNotesInViewport();
  }, [windowSize, ensureNotesInViewport]);

  // Additional check after notes are loaded
  useEffect(() => {
    if (!isLoading && notes.length > 0) {
      ensureNotesInViewport();
    }
  }, [isLoading, notes.length, ensureNotesInViewport]);

  // Update storage key when active project changes
  useEffect(() => {
    if (!isLoading) {
      setStorageKey(getProjectStorageKey(BASE_STORAGE_KEY));
    }
  }, [getProjectStorageKey, activeProject, isLoading]);

  // Load notes from localStorage on initial render or when active project changes
  useEffect(() => {
    if (!isStorageAvailable || isLoading) return;

    try {
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } else {
        // If no notes found for this project, start with empty array
        setNotes([]);
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage:", e);
    }
  }, [storageKey, isLoading]);

  // Debounced save to localStorage
  const saveNotesToStorage = useCallback(() => {
    if (!isStorageAvailable) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes to localStorage:", e);
    }
  }, [notes, storageKey]);

  // Use a debounced effect for saving
  useEffect(() => {
    // Skip during loading or if no notes
    if (isLoading) return;

    const timeoutId = setTimeout(() => {
      saveNotesToStorage();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [notes, saveNotesToStorage, isLoading]);

  const colors = [
    "bg-yellow-200/50 border-yellow-400 from-yellow-300/70 to-yellow-200/70",
    "bg-green-200/50 border-green-400 from-green-300/70 to-green-200/70",
    "bg-blue-200/50 border-blue-400 from-blue-300/70 to-blue-200/70",
    "bg-pink-200/50 border-pink-400 from-pink-300/70 to-pink-200/70",
    "bg-purple-200/50 border-purple-400 from-purple-300/70 to-purple-200/70",
  ];

  const addNote = () => {
    // Ensure the new note is placed within the visible area
    const maxX = windowSize.width - 280;
    const maxY = windowSize.height - 180;
    const minX = 10;
    const minY = 60;

    const newNote: Note = {
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
    };
    setNotes([...notes, newNote]);
    setActiveNote(newNote.id);
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, text, updatedAt: Date.now() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    // Only allow dragging from the header
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDraggedNote(noteId);

    // Prevent default to avoid text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNote) return;

    // Update the note position based on mouse position and initial offset
    setNotes(
      notes.map((note) => {
        if (note.id === draggedNote) {
          return {
            ...note,
            left: e.clientX - dragOffset.x,
            top: e.clientY - dragOffset.y,
          };
        }
        return note;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
  };

  const handleTouchStart = (e: React.TouchEvent, noteId: string) => {
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

            setDraggedNote(noteId);

            // Provide haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
          }
        }
      } catch (error) {
        console.error("Error in touch handler:", error);
        // Clear any drag state to prevent unexpected behavior
        setDraggedNote(null);
      }
    }, longPressDelay);

    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedNote) return;

    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];

    // Update the note position based on touch position and initial offset
    setNotes(
      notes.map((note) => {
        if (note.id === draggedNote) {
          return {
            ...note,
            left: touch.clientX - dragOffset.x,
            top: touch.clientY - dragOffset.y,
          };
        }
        return note;
      })
    );
  };

  const handleTouchEnd = () => {
    // Clear the long press timer if touch ends before the timer fires
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    setDraggedNote(null);
  };

  useEffect(() => {
    // Add global mouse event listeners for dragging
    if (draggedNote) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        setNotes(
          notes.map((note) => {
            if (note.id === draggedNote) {
              return {
                ...note,
                left: e.clientX - dragOffset.x,
                top: e.clientY - dragOffset.y,
              };
            }
            return note;
          })
        );
      };

      const handleGlobalMouseUp = () => {
        setDraggedNote(null);
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [draggedNote, dragOffset, notes]);

  useEffect(() => {
    // Add global touch event listeners for dragging
    if (draggedNote) {
      const handleGlobalTouchMove = (e: TouchEvent) => {
        if (!e.touches[0]) return;

        const touch = e.touches[0];
        setNotes(
          notes.map((note) => {
            if (note.id === draggedNote) {
              return {
                ...note,
                left: touch.clientX - dragOffset.x,
                top: touch.clientY - dragOffset.y,
              };
            }
            return note;
          })
        );
      };

      const handleGlobalTouchEnd = () => {
        setDraggedNote(null);
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
  }, [draggedNote, dragOffset, notes]);

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
        onClick={addNote}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl z-[100] bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-110 animate-in slide-in-from-bottom-6"
        aria-label="Add new note"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {notes.map((note) => {
        const [colorClass, borderClass, gradientFrom, gradientTo] =
          note.color.split(" ");
        return (
          <div
            key={note.id}
            className={`absolute shadow-md rounded-md ${colorClass} border-2 ${borderClass} w-64 text-purple-950 overflow-hidden`}
            style={{
              left: `${note.left}px`,
              top: `${note.top}px`,
              zIndex:
                draggedNote === note.id || activeNote === note.id ? 10 : 1,
            }}
            onClick={() => setActiveNote(note.id)}
          >
            {/* Grabbable header */}
            <div
              className={`h-7 w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center cursor-grab`}
              onMouseDown={(e) => handleMouseDown(e, note.id)}
              onTouchStart={(e) => handleTouchStart(e, note.id)}
            >
              <div className="w-full h-full px-2">
                <div className="flex justify-between items-center h-full">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/60"
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full opacity-70 text-purple-950 hover:opacity-100 hover:bg-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {activeNote === note.id ? (
              <div className="p-3">
                <textarea
                  className="w-full h-32 bg-transparent resize-none focus:outline-none text-purple-950"
                  value={note.text}
                  onChange={(e) => updateNoteText(note.id, e.target.value)}
                  onBlur={() => setActiveNote(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setActiveNote(null);
                    }
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div className="whitespace-pre-wrap min-h-[8rem] break-words p-3 text-purple-950">
                {note.text || "Click to edit"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
