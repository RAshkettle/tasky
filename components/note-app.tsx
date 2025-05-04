"use client"

import { useState, useEffect, useCallback } from "react"
import { NoteList } from "./note-list"
import { NoteEditor } from "./note-editor"
import type { Note } from "@/types/note"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Define a consistent storage key
const NOTES_STORAGE_KEY = "tasky-notes-data";

export function NoteApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes)
        setNotes(parsedNotes)
        console.log(`Loaded ${parsedNotes.length} notes from storage`)
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Memoized save function to avoid unnecessary re-renders
  const saveNotesToStorage = useCallback((notesToSave: Note[]) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesToSave))
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error)
    }
  }, [])

  // Save notes to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      saveNotesToStorage(notes)
    }
  }, [notes, saveNotesToStorage, isLoaded])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      drawing: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) => 
      note.id === updatedNote.id ? 
        { ...updatedNote, updatedAt: new Date().toISOString() } : 
        note
    )
    setNotes(updatedNotes)
    setSelectedNote(updatedNote)
    setIsEditing(false)
  }

  const deleteNote = (id: string) => {
    // Remove from state array
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    
    // Explicitly update localStorage to ensure deletion is persisted
    saveNotesToStorage(updatedNotes)
    
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const selectNote = (note: Note) => {
    setSelectedNote(note)
    setIsEditing(false)
  }

  const editNote = () => {
    setIsEditing(true)
  }

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
        <NoteList notes={notes} selectedNoteId={selectedNote?.id} onSelectNote={selectNote} />
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
  )
}
