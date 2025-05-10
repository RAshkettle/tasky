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
import {
  CheckCircle,
  PencilIcon,
  PlusCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import generateRandomName from "./project-name";
import ProjectEditDialog from "@/components/project-edit-dialog";

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
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
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

  // Handle editing project description
  const handleEditProject = () => {
    if (!projectToEdit) return;

    // Update the project with the new description
    const updatedProjects = projects.map((project) =>
      project.id === projectToEdit.id
        ? { ...project, description: editedDescription.trim() || undefined }
        : project
    );

    setProjects(updatedProjects);

    // If the edited project is the active project, update it too
    if (activeProject?.id === projectToEdit.id) {
      setActiveProject({
        ...activeProject,
        description: editedDescription.trim() || undefined,
      });
    }

    toast({
      title: "Project Updated",
      description: "The project description has been updated",
    });

    // Reset the edit state
    setProjectToEdit(null);
    setEditedDescription("");
  };

  // Handle edit button click - open edit dialog
  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent card click/project selection
    setProjectToEdit(project);
    setEditedDescription(project.description || "");
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
              <div className="grid gap-3 max-h-[420px] overflow-y-auto pr-1 projects-container">
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
                        {project.description && (
                          <div className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                            {project.description}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Created{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activeProject?.id === project.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleEditClick(e, project)}
                              title="Edit project"
                            >
                              <PencilIcon className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleEditClick(e, project)}
                              title="Edit project"
                            >
                              <PencilIcon className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleDeleteClick(e, project)}
                              title="Delete project"
                            >
                              <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                          </>
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

      {/* Edit Project Dialog */}
      <ProjectEditDialog
        projectToEdit={projectToEdit}
        editedDescription={editedDescription}
        setProjectToEdit={setProjectToEdit}
        setEditedDescription={setEditedDescription}
        handleEditProject={handleEditProject}
      />
    </div>
  );
}
