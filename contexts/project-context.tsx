"use client";

import generateRandomName from "@/app/projects/project-name";
import { generateUUID } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

// Types
export interface Project {
  id: string;
  name: string;
  createdAt: number;
  description?: string; // Optional project description
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  deleteProject: (projectId: string) => boolean;
  getProjectStorageKey: (baseKey: string) => string;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects and active project from localStorage on component mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    const activeProjectId = localStorage.getItem("activeProjectId");

    let parsedProjects: Project[] = [];
    let activeProj: Project | null = null;

    // If there are stored projects, load them
    if (storedProjects) {
      parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);

      // If there's an active project ID, find and set the active project
      if (activeProjectId) {
        activeProj =
          parsedProjects.find((p: Project) => p.id === activeProjectId) || null;

        if (activeProj) {
          setActiveProject(activeProj);
        }
      }
    }

    // If no projects exist, create a default one
    if (parsedProjects.length === 0) {
      const name = generateRandomName();
      const defaultProject: Project = {
        id: generateUUID(),
        name: `${name.randomAdjective}-${name.randomNoun}`,
        createdAt: Date.now(),
      };

      parsedProjects = [defaultProject];
      activeProj = defaultProject;

      setProjects(parsedProjects);
      setActiveProject(defaultProject);

      // Save to localStorage immediately
      localStorage.setItem("projects", JSON.stringify(parsedProjects));
      localStorage.setItem("activeProjectId", defaultProject.id);
    }
    // If we have projects but no active project, select the first one
    else if (parsedProjects.length > 0 && !activeProj) {
      activeProj = parsedProjects[0];
      setActiveProject(activeProj);
      localStorage.setItem("activeProjectId", activeProj.id);
    }

    setIsLoading(false);
  }, []);

  // Save active project ID to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      if (activeProject) {
        localStorage.setItem("activeProjectId", activeProject.id);
      } else {
        localStorage.removeItem("activeProjectId");
      }
    }
  }, [activeProject, isLoading]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  // Delete a project by id and clean up all associated data in localStorage
  const deleteProject = (projectId: string) => {
    // Cannot delete the active project
    if (activeProject?.id === projectId) {
      return false;
    }

    // Find the project to be deleted
    const projectToDelete = projects.find(
      (project) => project.id === projectId
    );
    if (projectToDelete) {
      // Clear all localStorage data associated with this project
      const projectPrefix = `${projectToDelete.name}:`;

      // Get all keys in localStorage
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          // If the key starts with the project's prefix, add it to our removal list
          if (key && key.startsWith(projectPrefix)) {
            keysToRemove.push(key);
          }
        }

        // Remove all associated data
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
        });

        console.log(
          `Deleted ${keysToRemove.length} localStorage items for project: ${projectToDelete.name}`
        );
      } catch (error) {
        console.error(
          "Failed to clean up project data from localStorage:",
          error
        );
      }
    }

    // Filter out the project with the matching id
    setProjects(projects.filter((project) => project.id !== projectId));
    return true;
  };

  // Helper function to create project-specific storage keys
  const getProjectStorageKey = (baseKey: string) => {
    if (!activeProject) return baseKey;
    return `${activeProject.name}:${baseKey}`;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setProjects,
        setActiveProject,
        deleteProject,
        getProjectStorageKey,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
