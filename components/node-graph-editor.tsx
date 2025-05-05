"use client";

import type React from "react";

import { CustomNode } from "@/components/custom-node";
import { NodePropertiesPanel } from "@/components/node-properties-panel";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/project-context";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Base storage key for persisting graph data
const BASE_STORAGE_KEY = "node-graph-data";

/**
 * Node Graph Editor component for creating interactive node-based graphs.
 *
 * @returns {JSX.Element} The rendered Node Graph Editor component
 */
export default function NodeGraphEditor(): JSX.Element {
  const {
    getProjectStorageKey,
    activeProject,
    isLoading: projectLoading,
  } = useProjects();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [storageKey, setStorageKey] = useState(BASE_STORAGE_KEY);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Auto-save interval ID
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Update storage key when active project changes
  useEffect(() => {
    if (!projectLoading) {
      setStorageKey(getProjectStorageKey(BASE_STORAGE_KEY));
    }
  }, [getProjectStorageKey, activeProject, projectLoading]);

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback(
    (changes: NodeChange[]): void => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);

      // Update selected node if it was changed
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(
          (node) => node.id === selectedNode.id
        );
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
    },
    [nodes, selectedNode]
  );

  // Handle edge changes
  const onEdgesChange = useCallback((changes: EdgeChange[]): void => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Handle connecting nodes
  const onConnect = useCallback((connection: Connection): void => {
    setEdges((eds) => addEdge({ ...connection, id: `e-${uuidv4()}` }, eds));
  }, []);

  // Handle node selection
  const onNodeClick = (_: React.MouseEvent, node: Node): void => {
    setSelectedNode(node);
  };

  // Handle background click (deselect)
  const onPaneClick = (): void => {
    setSelectedNode(null);
  };

  // Add a new node
  const addNode = (): void => {
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
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Update node properties
  const updateNodeProperties = (id: string, data: any): void => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };

          // Update selected node if it's the one being modified
          if (selectedNode && selectedNode.id === id) {
            setSelectedNode(updatedNode);
          }

          return updatedNode;
        }
        return node;
      })
    );
  };

  // Add a save button to manually save the graph data
  const saveGraph = (): void => {
    const data = { nodes, edges };
    localStorage.setItem(storageKey, JSON.stringify(data));
    alert("Graph saved successfully!");
  };

  // Load graph data from localStorage on initial render or when project changes
  useEffect(() => {
    if (projectLoading) return;

    // Clear existing data when project changes
    setNodes(initialNodes);
    setEdges(initialEdges);

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (error) {
        console.error("Failed to parse graph data from localStorage:", error);
      }
    }

    // Start auto-save loop
    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
    }

    autoSaveInterval.current = setInterval(() => {
      const data = { nodes, edges };
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log("Auto-saved graph data to localStorage");
    }, 10000);

    return () => {
      // Clear auto-save interval on route exit
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
        autoSaveInterval.current = null;
      }
    };
  }, [storageKey, projectLoading]);

  return (
    <div
      className="w-full h-screen bg-background text-foreground"
      ref={reactFlowWrapper}
    >
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
          <Panel
            position="top-left"
            className="bg-card p-2 rounded-md border border-border shadow-md"
          >
            <h2 className="mb-2 text-sm">
              <i>Work in progress...</i>
            </h2>
            <Button onClick={addNode} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Node
            </Button>
            <Button
              onClick={saveGraph}
              className="flex items-center gap-2 mt-2"
            >
              Save Graph
            </Button>
          </Panel>
        </ReactFlow>
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            updateNodeProperties={updateNodeProperties}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
}
