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

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setProjects,
        setActiveProject,
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
