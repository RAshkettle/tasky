import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { Input } from "./ui/input";

type Props = {
  newProjectName: string;
  setNewProjectName: (id: string) => void;
  createNewProjectName: () => void;
  newProjectDescription: string;
  setNewProjectDescription: (description: string) => void;
  createProject: () => void;
};

const CreateNewProject = (props: Props) => {
  const {
    newProjectName,
    setNewProjectName,
    createNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    createProject,
  } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Add a new project to your workspace</CardDescription>
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
              <RefreshCcw className="h-4 w-4" />
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
  );
};

export default CreateNewProject;
