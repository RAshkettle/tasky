import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const CustomNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div
      className="px-4 py-2 shadow-md rounded-md border border-border"
      style={{
        backgroundColor: data.color || "#1e1e2f",
        minWidth: "150px",
        color: "#fff",
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 bg-primary" />
      <div className="flex flex-col">
        <div className="font-bold text-sm">{data.label}</div>
        {data.description && <div className="text-xs mt-1 text-muted-foreground">{data.description}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-2 h-2 bg-primary" />
    </div>
  )
})

CustomNode.displayName = "CustomNode"
