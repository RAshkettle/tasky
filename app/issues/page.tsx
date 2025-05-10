"use client";

import IssueList from "@/components/issue-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/contexts/project-context";
import { ArrowUpDown, Filter, PlusCircle, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Issue, IssuePriority, IssueStatus } from "../../types/issue";

export default function IssueTracker() {
  const { getProjectStorageKey, activeProject, isLoading } = useProjects();

  // Define base storage key for issues
  const BASE_ISSUES_STORAGE_KEY = "tasky-issues-data";
  const [storageKey, setStorageKey] = useState(BASE_ISSUES_STORAGE_KEY);
  const [isLoaded, setIsLoaded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50";
      case "IN-PROGRESS":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-800/50";
      case "PARKED":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50";
      case "DONE":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50";
      case "INVESTIGATE":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-800/50";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:hover:bg-gray-800/50";
    }
  };

  const [issues, setIssues] = useState<Issue[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Update storage key when active project changes
  useEffect(() => {
    if (!isLoading) {
      setStorageKey(getProjectStorageKey(BASE_ISSUES_STORAGE_KEY));
    }
  }, [getProjectStorageKey, activeProject, isLoading, BASE_ISSUES_STORAGE_KEY]);

  // Load issues from localStorage when component mounts or project changes
  useEffect(() => {
    if (isLoading) return;

    try {
      const savedIssues = localStorage.getItem(storageKey);
      if (savedIssues) {
        const parsedIssues = JSON.parse(savedIssues);
        setIssues(parsedIssues);
      } else {
        // Reset issues when switching to a project with no saved issues
        setIssues([]);
      }
    } catch (error) {
      console.error("Failed to load issues from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, isLoading]);

  // Memoized save function to avoid unnecessary re-renders
  const saveIssuesToStorage = useCallback(
    (issuesToSave: Issue[]): void => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(issuesToSave));
      } catch (error) {
        console.error("Failed to save issues to localStorage:", error);
      }
    },
    [storageKey]
  );

  // Save issues to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isLoaded && !isLoading) {
      saveIssuesToStorage(issues);
    }
  }, [issues, saveIssuesToStorage, isLoaded, isLoading]);

  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    title: "",
    description: "",
    status: "INVESTIGATE",
    priority: "medium",
  });

  // Filter and sort issues
  const filteredIssues = issues
    .filter(
      (issue) =>
        searchQuery === "" ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((issue) => statusFilter === "all" || issue.status === statusFilter)
    .filter(
      (issue) => priorityFilter === "all" || issue.priority === priorityFilter
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "priority-high") {
        const priorityOrder: Record<IssuePriority, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };
        return (
          priorityOrder[a.priority as IssuePriority] -
          priorityOrder[b.priority as IssuePriority]
        );
      } else if (sortBy === "priority-low") {
        const priorityOrder: Record<IssuePriority, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };
        return (
          priorityOrder[b.priority as IssuePriority] -
          priorityOrder[a.priority as IssuePriority]
        );
      }
      return 0;
    });

  const handleCreateIssue = () => {
    // Input validation
    if (!newIssue.title || !newIssue.description) {
      return; // Don't create issue if title or description is empty
    }

    const issueToAdd: Issue = {
      id: (issues.length + 1).toString(),
      title: newIssue.title || "",
      description: newIssue.description || "",
      status: (newIssue.status as IssueStatus) || "INVESTIGATE",
      priority: (newIssue.priority as IssuePriority) || "medium",
      createdAt: new Date().toISOString(),
    };

    const updatedIssues = [...issues, issueToAdd];
    setIssues(updatedIssues);

    // Explicitly save to localStorage to ensure creation is persisted
    saveIssuesToStorage(updatedIssues);

    setNewIssue({
      title: "",
      description: "",
      status: "INVESTIGATE",
      priority: "medium",
    });

    // Close the dialog
    setDialogOpen(false);
  };

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    const updatedIssues = issues.map((issue) =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    );

    setIssues(updatedIssues);

    // Explicitly save to localStorage to ensure status change is persisted
    saveIssuesToStorage(updatedIssues);
  };

  const handleDeleteIssue = (issueId: string) => {
    const updatedIssues = issues.filter((issue) => issue.id !== issueId);
    setIssues(updatedIssues);

    // Explicitly save to localStorage to ensure deletion is persisted
    saveIssuesToStorage(updatedIssues);
  };

  const handleUpdateIssue = (updatedIssue: Issue) => {
    const updatedIssues = issues.map((issue) =>
      issue.id === updatedIssue.id ? updatedIssue : issue
    );

    setIssues(updatedIssues);

    // Explicitly save to localStorage to ensure update is persisted
    saveIssuesToStorage(updatedIssues);
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Issue Tracker</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Issue</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new issue.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Issue title"
                  value={newIssue.title}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail"
                  value={newIssue.description}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, description: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newIssue.status}
                    onValueChange={(value) =>
                      setNewIssue({ ...newIssue, status: value as IssueStatus })
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className={getStatusColor(
                        newIssue.status || "INVESTIGATE"
                      )}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="INVESTIGATE"
                        className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-800/50"
                      >
                        Investigate
                      </SelectItem>
                      <SelectItem
                        value="TODO"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50"
                      >
                        To Do
                      </SelectItem>
                      <SelectItem
                        value="IN-PROGRESS"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-800/50"
                      >
                        In Progress
                      </SelectItem>
                      <SelectItem
                        value="PARKED"
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50"
                      >
                        Parked
                      </SelectItem>
                      <SelectItem
                        value="DONE"
                        className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50"
                      >
                        Done
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newIssue.priority}
                    onValueChange={(value) =>
                      setNewIssue({
                        ...newIssue,
                        priority: value as IssuePriority,
                      })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateIssue}
                disabled={!newIssue.title || !newIssue.description}
              >
                Create Issue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className={`w-[130px] ${
                    statusFilter !== "all" ? getStatusColor(statusFilter) : ""
                  }`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem
                    value="INVESTIGATE"
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-800/50"
                  >
                    Investigate
                  </SelectItem>
                  <SelectItem
                    value="TODO"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50"
                  >
                    To Do
                  </SelectItem>
                  <SelectItem
                    value="IN-PROGRESS"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-800/50"
                  >
                    In Progress
                  </SelectItem>
                  <SelectItem
                    value="PARKED"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50"
                  >
                    Parked
                  </SelectItem>
                  <SelectItem
                    value="DONE"
                    className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50"
                  >
                    Done
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority-high">
                    Highest Priority
                  </SelectItem>
                  <SelectItem value="priority-low">Lowest Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <IssueList
          issues={filteredIssues}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteIssue}
          onUpdate={handleUpdateIssue}
        />
      </div>
    </main>
  );
}
