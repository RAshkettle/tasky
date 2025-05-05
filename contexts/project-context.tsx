"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Types
export interface Project {
  id: string;
  name: string;
  createdAt: number;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  deleteProject: (projectId: string) => void;
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

    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      setProjects(parsedProjects);

      // If there's an active project ID, find and set the active project
      if (activeProjectId) {
        const active = parsedProjects.find(
          (p: Project) => p.id === activeProjectId
        );
        if (active) {
          setActiveProject(active);
        }
      }
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

  // Delete a project by id
  const deleteProject = (projectId: string) => {
    // Cannot delete the active project
    if (activeProject?.id === projectId) {
      return false;
    }

    // Filter out the project with the matching id
    setProjects(projects.filter((project) => project.id !== projectId));
    return true;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setProjects,
        setActiveProject,
        deleteProject,
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
