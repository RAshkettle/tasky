"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/types/note";
import { formatDistanceToNow } from "date-fns";
import { Edit, FileText, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

/**
 * Props interface for the NoteEditor component.
 */
interface NoteEditorProps {
  note: Note;
  isEditing: boolean;
  onSave: (note: Note) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

/**
 * NoteEditor component for viewing and editing notes with Markdown.
 */
export function NoteEditor({
  note,
  isEditing,
  onSave,
  onEdit,
  onDelete,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);

  // Update local state when the note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  // Reset form when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [isEditing, note]);

  const handleSave = (): void => {
    const updatedNote: Note = {
      ...note,
      title: title || "Untitled Note",
      content,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedNote);
  };

  const handleCancel = (): void => {
    // Reset form fields to original values
    setTitle(note.title);
    setContent(note.content);
    // Call the parent component's cancel handler
    onCancel();
  };

  const handleDelete = (): void => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
    }
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
          <div className="flex space-x-2">
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here using Markdown..."
            className="min-h-[320px] resize-none"
          />
          <div className="text-xs text-muted-foreground mt-2">
            <FileText className="h-3 w-3 inline-block mr-1" />
            Markdown formatting supported
          </div>
        </div>
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

      <div className="prose max-w-none dark:prose-invert overflow-y-auto">
        {content ? (
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-muted-foreground italic">No content</p>
        )}
      </div>
    </div>
  );
}
