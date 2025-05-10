import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/contexts/project-context";
import { CheckCircle, PencilIcon, Trash2 } from "lucide-react";

type Props = {
  projects: Project[];
  activeProject: Project | null;
  selectProject: (project: Project) => void;
  handleEditClick: (e: React.MouseEvent, project: Project) => void;
  handleDeleteClick: (e: React.MouseEvent, project: Project) => void;
};

const ExistingProjectList = (props: Props) => {
  const {
    projects,
    activeProject,
    selectProject,
    handleEditClick,
    handleDeleteClick,
  } = props;
  return (
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
                      Created {new Date(project.createdAt).toLocaleDateString()}
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
  );
};

export default ExistingProjectList;
