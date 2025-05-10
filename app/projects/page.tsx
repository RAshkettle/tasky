"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Project, useProjects } from "@/contexts/project-context";
import { useToast } from "@/hooks/use-toast";
import { generateUUID } from "@/lib/utils";
import { CheckCircle, PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import generateRandomName from "./project-name";

export default function ProjectSelector() {
  const {
    projects,
    setProjects,
    activeProject,
    setActiveProject,
    deleteProject,
    isLoading,
  } = useProjects();
  const [newProjectName, setNewProjectName] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    createNewProjectName();
  }, []);

  const createNewProjectName = () => {
    const name = generateRandomName();
    setNewProjectName(`${name.randomAdjective}-${name.randomNoun}`);
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
      id: generateUUID(),
      name: newProjectName,
      createdAt: Date.now(),
    };

    setProjects([...projects, newProject]);
    createNewProjectName();

    toast({
      title: "Success",
      description: `Project "${newProjectName}" created successfully`,
    });
  };

  // Select a project
  const selectProject = (project: Project) => {
    setActiveProject(project);

    toast({
      title: "Project Selected",
      description: `Now working with project: ${project.name}`,
    });
  };

  // Handle project deletion
  const handleDeleteProject = (projectId: string) => {
    const success = deleteProject(projectId);

    if (success) {
      toast({
        title: "Project Deleted",
        description: "The project has been permanently deleted",
      });
      setProjectToDelete(null);
    } else {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete the currently active project",
        variant: "destructive",
      });
    }
  };

  // Handle delete button click - open confirmation dialog
  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent card click/project selection

    if (project.id === activeProject?.id) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete the currently active project",
        variant: "destructive",
      });
      return;
    }

    setProjectToDelete(project);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        Loading projects...
      </div>
    );
  }

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
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                      activeProject?.id === project.id
                        ? "border-primary bg-primary/10"
                        : ""
                    }`}
                  >
                    <CardContent
                      className="p-4 flex items-center justify-between"
                      onClick={() => selectProject(project)}
                    >
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Created{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activeProject?.id === project.id ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteClick(e, project)}
                            title="Delete project"
                          >
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        )}
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
                  onClick={createNewProjectName}
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
            <Button
              className="w-full"
              onClick={createProject}
              disabled={!newProjectName?.trim()}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={() => setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the project{" "}
              <span className="font-medium">{projectToDelete?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteProject(projectToDelete!.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
