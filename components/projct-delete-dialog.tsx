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
import { Project } from "@/contexts/project-context";
import { Dispatch, SetStateAction } from "react";

type Props = {
  projectToDelete: Project | null;
  setProjectToDelete: Dispatch<SetStateAction<Project | null>>;
  handleDeleteProject: (id: string) => void;
};

const ProjectDeleteConfirmationDialog = (props: Props) => {
  const { projectToDelete, setProjectToDelete, handleDeleteProject } = props;
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
