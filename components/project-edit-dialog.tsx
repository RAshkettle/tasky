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
  projectToEdit: Project | null;
  setProjectToEdit: Dispatch<SetStateAction<Project | null>>;
  editedDescription: string;
  setEditedDescription: Dispatch<SetStateAction<string>>;
  handleEditProject: () => void;
};

const ProjectEditDialog = (props: Props) => {
  const {
    projectToEdit,
    editedDescription,
    setProjectToEdit,
    setEditedDescription,
    handleEditProject,
  } = props;

  return (
    <AlertDialog
      open={!!projectToEdit}
      onOpenChange={() => setProjectToEdit(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Project</AlertDialogTitle>
          <AlertDialogDescription>
            Update the description for project{" "}
            <span className="font-medium">{projectToEdit?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="relative">
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Project description"
              value={editedDescription}
              onChange={(e) => {
                // Limit description to 50 characters
                if (e.target.value.length <= 50) {
                  setEditedDescription(e.target.value);
                }
              }}
              maxLength={50}
            />
            <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
              {editedDescription.length}/50
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEditProject}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectEditDialog;
