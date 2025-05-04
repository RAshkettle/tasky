"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import type { Lane, Task } from "@/components/kanban-board"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeIcon, PencilIcon, MusicIcon, LayoutIcon, MoreHorizontalIcon } from "lucide-react"

interface TaskCardProps {
  task: Task
  index: number
  laneId: Lane
  onMoveTask: (taskId: string, fromLane: Lane, toLane: Lane, toIndex?: number) => void
  onReorderTask: (laneId: Lane, fromIndex: number, toIndex: number) => void
}

export default function TaskCard({ task, index, laneId, onMoveTask, onReorderTask }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task.id, laneId, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop({
    accept: "task",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index
      const sourceLane = item.laneId

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceLane === laneId) {
        return
      }

      // Only perform the move when the mouse has crossed half of the item's height
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      if (sourceLane === laneId) {
        onReorderTask(laneId, dragIndex, hoverIndex)
        // Update the index for the dragged item
        item.index = hoverIndex
      } else {
        // If moving from another lane, we need to handle it differently
        onMoveTask(item.id, sourceLane, laneId, hoverIndex)
        item.index = hoverIndex
        item.laneId = laneId
      }
    },
  })

  drag(drop(ref))

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "art":
        return <PencilIcon className="h-4 w-4 mr-1" />
      case "code":
        return <CodeIcon className="h-4 w-4 mr-1" />
      case "design":
        return <LayoutIcon className="h-4 w-4 mr-1" />
      case "audio":
        return <MusicIcon className="h-4 w-4 mr-1" />
      default:
        return <MoreHorizontalIcon className="h-4 w-4 mr-1" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-800/50"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    }
  }

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`mb-2 cursor-move transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <Card className="shadow-sm hover:shadow">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <CardDescription className="text-xs">{task.description}</CardDescription>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Badge variant="outline" className="flex items-center text-xs">
            {getCategoryIcon(task.category)}
            {task.category}
          </Badge>
          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
        </CardFooter>
      </Card>
    </div>
  )
}
