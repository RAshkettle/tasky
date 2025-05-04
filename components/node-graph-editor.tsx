"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NodePropertiesPanel } from "@/components/node-properties-panel"
import { CustomNode } from "@/components/custom-node"

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

// Initial nodes and edges
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function NodeGraphEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  // Remove this line completely
  // const reactFlowInstance = useReactFlow()

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes)
      setNodes(updatedNodes)

      // Update selected node if it was changed
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find((node) => node.id === selectedNode.id)
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode)
        }
      }
    },
    [nodes, selectedNode],
  )

  // Handle edge changes
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  // Handle connecting nodes
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, id: `e-${uuidv4()}` }, eds))
  }, [])

  // Handle node selection
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }

  // Handle background click (deselect)
  const onPaneClick = () => {
    setSelectedNode(null)
  }

  // Add a new node
  const addNode = () => {
    const newNode: Node = {
      id: `node-${uuidv4()}`,
      type: "custom",
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: {
        label: `Node ${nodes.length + 1}`,
        description: "Node description",
        color: "#6366f1",
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  // Update node properties
  const updateNodeProperties = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          }

          // Update selected node if it's the one being modified
          if (selectedNode && selectedNode.id === id) {
            setSelectedNode(updatedNode)
          }

          return updatedNode
        }
        return node
      }),
    )
  }

  return (
    <div className="w-full h-screen bg-background text-foreground" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
        >
          <Background color="#444" gap={16} />
          <Controls className="bg-background border border-border text-foreground" />
          <Panel position="top-left" className="bg-card p-2 rounded-md border border-border shadow-md">
            <Button onClick={addNode} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Node
            </Button>
          </Panel>
        </ReactFlow>
        {selectedNode && <NodePropertiesPanel node={selectedNode} updateNodeProperties={updateNodeProperties} />}
      </ReactFlowProvider>
    </div>
  )
}
