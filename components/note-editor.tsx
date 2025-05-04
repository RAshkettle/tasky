"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";
import { Edit, FileText, PenTool, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { DrawingCanvas } from "./drawing-canvas";

/**
 * Props interface for the NoteEditor component.
 *
 * @interface NoteEditorProps
 * @property {Note} note - The note object to display and edit
 * @property {boolean} isEditing - Whether the editor is in edit mode
 * @property {Function} onSave - Callback function triggered when a note is saved
 * @property {Function} onEdit - Callback function triggered when edit mode is activated
 * @property {Function} onDelete - Callback function triggered when a note is deleted
 */
interface NoteEditorProps {
  note: Note;
  isEditing: boolean;
  onSave: (note: Note) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

/**
 * NoteEditor component for viewing and editing notes.
 *
 * @param {NoteEditorProps} props - Component properties
 * @returns {JSX.Element} The rendered NoteEditor component
 */
export function NoteEditor({
  note,
  isEditing,
  onSave,
  onEdit,
  onDelete,
}: NoteEditorProps): JSX.Element {
  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);
  const [drawing, setDrawing] = useState<string | null>(note.drawing);
  const [activeTab, setActiveTab] = useState<string>("text");

  // Update local state when the note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setDrawing(note.drawing);
  }, [note]);

  const handleSave = (): void => {
    const updatedNote: Note = {
      ...note,
      title: title || "Untitled Note",
      content,
      drawing,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedNote);
  };

  const handleDelete = (): void => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
    }
  };

  const handleDrawingSave = (drawingData: string): void => {
    setDrawing(drawingData);
  };

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
            <DrawingCanvas
              initialDrawing={drawing}
              onSave={handleDrawingSave}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
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
        Last updated{" "}
        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
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
              <img
                src={drawing || "/placeholder.svg"}
                alt="Note drawing"
                className="w-full"
              />
            </div>
          ) : (
            <p className="text-muted-foreground italic">No drawing</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
