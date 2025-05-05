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

// Generate a random project name - same logic as in projects page
const generateRandomProjectName = (): string => {
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

  return `${randomAdjective}-${randomNoun}`;
};

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
      const defaultProject: Project = {
        id: crypto.randomUUID(),
        name: generateRandomProjectName(),
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
