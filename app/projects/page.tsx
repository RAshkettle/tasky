"use client";

import ExistingProjectList from "@/components/existing-project-list";
import ProjectDeleteConfirmationDialog from "@/components/projct-delete-dialog";
import ProjectEditDialog from "@/components/project-edit-dialog";

import { Project, useProjects } from "@/contexts/project-context";
import { useToast } from "@/hooks/use-toast";
import { generateUUID } from "@/lib/utils";

import CreateNewProject from "@/components/create-new-project";
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
        <ExistingProjectList
          projects={projects}
          activeProject={activeProject}
          selectProject={selectProject}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
        {/* Create New Project Section */}
        <CreateNewProject
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          createNewProjectName={createNewProjectName}
          newProjectDescription={newProjectDescription}
          setNewProjectDescription={setNewProjectDescription}
          createProject={createProject}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ProjectDeleteConfirmationDialog
        projectToDelete={projectToDelete}
        setProjectToDelete={setProjectToDelete}
        handleDeleteProject={handleDeleteProject}
      />
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
