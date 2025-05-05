"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

// Types
interface Project {
  id: string;
  name: string;
  createdAt: number;
}

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load projects from localStorage on component mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    setIsLoading(false);
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  // Generate a random project name
  const generateRandomName = () => {
    const adjectives = [
      "swift",
      "brave",
      "bright",
      "cosmic",
      "dynamic",
      "elegant",
      "fierce",
      "golden",
      "hidden",
      "infinite",
      "jovial",
      "keen",
      "lively",
      "mystic",
      "noble",
      "optimal",
      "prime",
      "quantum",
      "radiant",
      "stellar",
    ];

    const nouns = [
      "aurora",
      "beacon",
      "cascade",
      "delta",
      "echo",
      "falcon",
      "galaxy",
      "horizon",
      "impulse",
      "journey",
      "kingdom",
      "legacy",
      "meridian",
      "nexus",
      "orbit",
      "phoenix",
      "quasar",
      "reef",
      "summit",
      "tempest",
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    setNewProjectName(`${randomAdjective}-${randomNoun}`);
  };

  // Create a new project
  const createProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "Project name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if project name already exists
    if (
      projects.some(
        (project) => project.name.toLowerCase() === newProjectName.toLowerCase()
      )
    ) {
      toast({
        title: "Error",
        description: "A project with this name already exists",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName,
      createdAt: Date.now(),
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");

    toast({
      title: "Success",
      description: `Project "${newProjectName}" created successfully`,
    });
  };

  // Select a project
  const selectProject = (project: Project) => {
    // Here you would typically set this as the active project in your app state
    // For this example, we'll just show a toast
    toast({
      title: "Project Selected",
      description: `Now working with project: ${project.name}`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Project Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Existing Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Projects</CardTitle>
            <CardDescription>Select a project to work with</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No projects yet. Create your first project!
              </div>
            ) : (
              <div className="grid gap-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <CardContent
                      className="p-4"
                      onClick={() => selectProject(project)}
                    >
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create New Project Section */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Add a new project to your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateRandomName}
                  title="Generate random name"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Project names are used as tags to organize your storage and
                resources.
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={createProject}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
