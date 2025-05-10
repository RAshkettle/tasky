"use client";

import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/project-context";
import type { Note } from "@/types/note";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NoteEditor } from "./note-editor";
import { NoteList } from "./note-list";

// Define a base storage key that will be prefixed with the project name
const BASE_NOTES_STORAGE_KEY = "tasky-notes-data";

/**
 * Main Note App component that manages the notes application state and UI.
 *
 * @returns {JSX.Element} The rendered Note App component
 */
export function NoteApp(): JSX.Element {
  const { getProjectStorageKey, activeProject, isLoading } = useProjects();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [storageKey, setStorageKey] = useState(BASE_NOTES_STORAGE_KEY);

  // Update storage key when active project changes
  useEffect(() => {
    if (!isLoading) {
      setStorageKey(getProjectStorageKey(BASE_NOTES_STORAGE_KEY));
    }
  }, [getProjectStorageKey, activeProject, isLoading]);

  // Load notes from localStorage on initial render or when project changes
  useEffect(() => {
    if (isLoading) return;

    try {
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        setSelectedNote(null); // Clear selection when project changes
      } else {
        // Reset notes when switching to a project with no saved notes
        setNotes([]);
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, isLoading]);

  // Memoized save function to avoid unnecessary re-renders
  const saveNotesToStorage = useCallback(
    (notesToSave: Note[]): void => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(notesToSave));
      } catch (error) {
        console.error("Failed to save notes to localStorage:", error);
      }
    },
    [storageKey]
  );

  // Save notes to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isLoaded && !isLoading) {
      saveNotesToStorage(notes);
    }
  }, [notes, saveNotesToStorage, isLoaded, isLoading]);

  const createNewNote = (): void => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (updatedNote: Note): void => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id
        ? { ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (id: string): void => {
    // Remove from state array
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);

    // Explicitly update localStorage to ensure deletion is persisted
    saveNotesToStorage(updatedNotes);

    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const selectNote = (note: Note): void => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const editNote = (): void => {
    setIsEditing(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-2rem)]">
      <div className="md:col-span-1 border rounded-lg p-4 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Notes</h1>
          <Button onClick={createNewNote} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        <NoteList
          notes={notes}
          selectedNoteId={selectedNote?.id}
          onSelectNote={selectNote}
        />
      </div>
      <div className="md:col-span-2 border rounded-lg p-4 h-full overflow-y-auto">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            isEditing={isEditing}
            onSave={updateNote}
            onEdit={editNote}
            onDelete={deleteNote}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="mb-4">Select a note or create a new one</p>
            <Button onClick={createNewNote} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create your first note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
