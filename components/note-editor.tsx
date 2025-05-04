"use client"

import { useState, useEffect } from "react"
import type { Note } from "@/types/note"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash, Save, FileText, PenTool } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { DrawingCanvas } from "./drawing-canvas"

interface NoteEditorProps {
  note: Note
  isEditing: boolean
  onSave: (note: Note) => void
  onEdit: () => void
  onDelete: (id: string) => void
}

export function NoteEditor({ note, isEditing, onSave, onEdit, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [drawing, setDrawing] = useState<string | null>(note.drawing)
  const [activeTab, setActiveTab] = useState<string>("text")

  // Update local state when the note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setDrawing(note.drawing)
  }, [note])

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title || "Untitled Note",
      content,
      drawing,
      updatedAt: new Date().toISOString(),
    }
    onSave(updatedNote)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id)
    }
  }

  const handleDrawingSave = (drawingData: string) => {
    setDrawing(drawingData)
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto"
          />
          <Button onClick={handleSave} size="sm" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-[200px] grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="drawing">
              <PenTool className="h-4 w-4 mr-2" />
              Draw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="min-h-[calc(100vh-16rem)] resize-none border-none focus-visible:ring-0 p-0"
            />
          </TabsContent>

          <TabsContent value="drawing" className="mt-4">
            <DrawingCanvas initialDrawing={drawing} onSave={handleDrawingSave} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{note.title}</h2>
        <div className="flex space-x-2">
          <Button onClick={onEdit} size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Last updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full max-w-[200px] grid-cols-2">
          <TabsTrigger value="text">
            <FileText className="h-4 w-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="drawing">
            <PenTool className="h-4 w-4 mr-2" />
            Draw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4">
          <div className="prose max-w-none">
            {content ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <p className="text-muted-foreground italic">No content</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="drawing" className="mt-4">
          {drawing ? (
            <div className="border rounded-md overflow-hidden">
              <img src={drawing || "/placeholder.svg"} alt="Note drawing" className="w-full" />
            </div>
          ) : (
            <p className="text-muted-foreground italic">No drawing</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
