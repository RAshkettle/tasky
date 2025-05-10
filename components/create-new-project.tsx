import generateRandomName from "@/app/projects/project-name";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/contexts/project-context";
import { generateUUID } from "@/lib/utils";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

type Props = {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
};

const CreateNewProject = (props: Props) => {
  const { projects, setProjects } = props;
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    createNewProjectName();
  }, []);
  const { toast } = useToast();

  const createNewProjectName = () => {
    const name = generateRandomName();
    setNewProjectName(`${name.randomAdjective}-${name.randomNoun}`);
  };

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
      id: generateUUID(),
      name: newProjectName,
      createdAt: Date.now(),
      description: newProjectDescription.trim() || undefined, // Only include if it has content
    };

    setProjects([...projects, newProject]);
    createNewProjectName();
    setNewProjectDescription(""); // Clear the description field

    toast({
      title: "Success",
      description: `Project "${newProjectName}" created successfully`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Add a new project to your workspace</CardDescription>
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
              onClick={createNewProjectName}
              title="Generate random name"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Input
                placeholder="Project description (optional)"
                value={newProjectDescription}
                onChange={(e) => {
                  // Limit description to 50 characters
                  if (e.target.value.length <= 50) {
                    setNewProjectDescription(e.target.value);
                  }
                }}
                maxLength={50}
              />
              <div className="absolute right-2 bottom-1 text-xs text-muted-foreground">
                {newProjectDescription.length}/50
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Project names are used as tags to organize your storage and
            resources.
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={createProject}
          disabled={!newProjectName?.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateNewProject;
