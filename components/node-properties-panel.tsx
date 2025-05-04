"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Node } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface NodePropertiesPanelProps {
  node: Node
  updateNodeProperties: (id: string, data: any) => void
}

export function NodePropertiesPanel({ node, updateNodeProperties }: NodePropertiesPanelProps) {
  const [label, setLabel] = useState(node.data.label || "")
  const [description, setDescription] = useState(node.data.description || "")
  const [color, setColor] = useState(node.data.color || "#6366f1")
  const [isOpen, setIsOpen] = useState(true)

  // Update local state when selected node changes
  useEffect(() => {
    setLabel(node.data.label || "")
    setDescription(node.data.description || "")
    setColor(node.data.color || "#6366f1")
  }, [node])

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value
    setLabel(newLabel)
    updateNodeProperties(node.id, { label: newLabel })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    setDescription(newDescription)
    updateNodeProperties(node.id, { description: newDescription })
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    updateNodeProperties(node.id, { color: newColor })
  }

  if (!isOpen) {
    return (
      <div
        className="absolute bottom-4 right-4 p-2 bg-card rounded-full shadow-lg cursor-pointer border border-border"
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Open properties panel</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-settings"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
    )
  }

  return (
    <div className="absolute right-4 top-4 w-80 bg-card rounded-md shadow-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Node Properties</h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="node-label">Label</Label>
          <Input id="node-label" value={label} onChange={handleLabelChange} placeholder="Node Label" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-description">Description</Label>
          <Textarea
            id="node-description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Node Description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-color">Color</Label>
          <div className="flex items-center gap-2">
            <Input id="node-color" type="color" value={color} onChange={handleColorChange} className="w-12 h-8 p-1" />
            <Input value={color} onChange={handleColorChange} className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
