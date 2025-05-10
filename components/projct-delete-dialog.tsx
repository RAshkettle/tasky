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
import { Project, useProjects } from "@/contexts/project-context";
import { useToast } from "@/hooks/use-toast";

type Props = {
  projectToDelete: Project | null;
  setProjectToDelete: (project: Project | null) => void;
};

const ProjectDeleteConfirmationDialog = (props: Props) => {
  const { projectToDelete, setProjectToDelete } = props;
  const { deleteProject } = useProjects();
  const { toast } = useToast();
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

  return (
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
  );
};

export default ProjectDeleteConfirmationDialog;
