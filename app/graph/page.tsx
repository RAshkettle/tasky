import NodeGraphEditor from "@/components/node-graph-editor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1">
        <NodeGraphEditor />
      </div>
    </main>
  );
}
