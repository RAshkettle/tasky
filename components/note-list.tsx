"use client";

import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | undefined;
  onSelectNote: (note: Note) => void;
}

export function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notes yet. Create your first note!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className={cn(
            "p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
            selectedNoteId === note.id ? "bg-muted" : ""
          )}
          onClick={() => onSelectNote(note)}
        >
          <h3 className="font-medium truncate">{note.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {note.content || "No content"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
}
