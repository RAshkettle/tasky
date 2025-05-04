"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  text: string;
  left: number;
  top: number;
  color: string;
};

export default function StickyNotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem("sticky-notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved notes");
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

  const colors = [
    "bg-yellow-200 border-yellow-400",
    "bg-green-200 border-green-400",
    "bg-blue-200 border-blue-400",
    "bg-pink-200 border-pink-400",
    "bg-purple-200 border-purple-400",
  ];

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      text: "",
      left: Math.random() * (window.innerWidth - 250),
      top: Math.random() * (window.innerHeight - 250),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setNotes([...notes, newNote]);
    setActiveNote(newNote.id);
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text } : note)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    // Prevent starting drag when clicking on textarea or delete button
    if (
      (e.target as HTMLElement).tagName === "TEXTAREA" ||
      (e.target as HTMLElement).closest("button")
    ) {
      return;
    }

    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    // Calculate the offset from the mouse position to the note's top-left corner
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
      className="min-h-screen bg-muted p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Button
        onClick={addNote}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {notes.map((note) => {
        const [colorClass, borderClass] = note.color.split(" ");

        return (
          <div
            key={note.id}
            className={`absolute shadow-md rounded-md p-3 ${colorClass} border-2 ${borderClass} w-64 text-purple-900`}
            style={{
              left: `${note.left}px`,
              top: `${note.top}px`,
              zIndex:
                draggedNote === note.id || activeNote === note.id ? 10 : 1,
              cursor: draggedNote === note.id ? "grabbing" : "grab",
            }}
            onMouseDown={(e) => handleMouseDown(e, note.id)}
            onClick={() => setActiveNote(note.id)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 text-purple-900 hover:opacity-100 hover:bg-red-300"
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>

            {activeNote === note.id ? (
              <textarea
                className="w-full h-32 bg-transparent resize-none focus:outline-none  text-purple-900"
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
            ) : (
              <div className="whitespace-pre-wrap min-h-[8rem] break-words pt-4  text-purple-900">
                {note.text || "Click to edit"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
