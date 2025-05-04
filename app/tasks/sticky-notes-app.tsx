"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
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

const STORAGE_KEY = "tasky-sticky-notes"; // More specific storage key

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load notes from localStorage on initial render
  useEffect(() => {
    if (!isStorageAvailable) return;

    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        console.log(`Loaded ${parsedNotes.length} notes from storage`);
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage:", e);
    }
  }, []);

  // Debounced save to localStorage
  const saveNotesToStorage = useCallback(() => {
    if (!isStorageAvailable) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes to localStorage:", e);
    }
  }, [notes]);

  // Use a debounced effect for saving
  useEffect(() => {
    if (notes.length === 0) return;

    const timeoutId = setTimeout(() => {
      saveNotesToStorage();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [notes, saveNotesToStorage]);

  const colors = [
    "bg-yellow-200/50 border-yellow-400 from-yellow-300/70 to-yellow-200/70",
    "bg-green-200/50 border-green-400 from-green-300/70 to-green-200/70",
    "bg-blue-200/50 border-blue-400 from-blue-300/70 to-blue-200/70",
    "bg-pink-200/50 border-pink-400 from-pink-300/70 to-pink-200/70",
    "bg-purple-200/50 border-purple-400 from-purple-300/70 to-purple-200/70",
  ];

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      text: "",
      left: Math.random() * (window.innerWidth - 250),
      top: Math.random() * (window.innerHeight - 250),
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

      <Button
        onClick={addNote}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
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
