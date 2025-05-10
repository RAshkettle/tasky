"use client";

import IssueList from "@/components/issue-list";
import { Badge } from "@/components/ui/badge";
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
import { ArrowUpDown, Filter, PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import type { Issue, IssuePriority, IssueStatus } from "../../types/issue";

export default function IssueTracker() {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      title: "Login page not responsive on mobile devices",
      description:
        "The login page breaks on screens smaller than 320px width. Inputs overflow and buttons are cut off.",
      status: "open",
      priority: "high",
      assignee: "Sarah Chen",
      createdAt: "2025-05-01T10:30:00Z",
      labels: ["bug", "frontend", "mobile"],
    },
    {
      id: "2",
      title: "Add dark mode support",
      description:
        "Implement dark mode toggle and corresponding styles across the application.",
      status: "in-progress",
      priority: "medium",
      assignee: "Alex Johnson",
      createdAt: "2025-05-03T14:15:00Z",
      labels: ["feature", "ui", "enhancement"],
    },
    {
      id: "3",
      title: "API rate limiting not working correctly",
      description:
        "Users are able to make unlimited API calls, causing performance issues during peak hours.",
      status: "open",
      priority: "critical",
      assignee: "Unassigned",
      createdAt: "2025-05-05T09:45:00Z",
      labels: ["bug", "backend", "performance"],
    },
    {
      id: "4",
      title: "Implement user profile page",
      description:
        "Create a user profile page where users can update their information and preferences.",
      status: "backlog",
      priority: "low",
      assignee: "Jamie Smith",
      createdAt: "2025-05-02T11:20:00Z",
      labels: ["feature", "frontend"],
    },
    {
      id: "5",
      title: "Fix memory leak in dashboard component",
      description:
        "Dashboard component doesn't clean up event listeners properly, causing memory leaks over time.",
      status: "closed",
      priority: "high",
      assignee: "Robin Taylor",
      createdAt: "2025-04-28T16:00:00Z",
      labels: ["bug", "frontend", "performance"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    assignee: "",
    labels: [],
  });

  const [newLabel, setNewLabel] = useState("");

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
    const issueToAdd: Issue = {
      id: (issues.length + 1).toString(),
      title: newIssue.title || "",
      description: newIssue.description || "",
      status: (newIssue.status as IssueStatus) || "open",
      priority: (newIssue.priority as IssuePriority) || "medium",
      assignee: newIssue.assignee || "Unassigned",
      createdAt: new Date().toISOString(),
      labels: newIssue.labels || [],
    };

    setIssues([...issues, issueToAdd]);
    setNewIssue({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
      assignee: "",
      labels: [],
    });
  };

  const handleAddLabel = () => {
    if (newLabel && !newIssue.labels?.includes(newLabel)) {
      setNewIssue({
        ...newIssue,
        labels: [...(newIssue.labels || []), newLabel],
      });
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (label: string) => {
    setNewIssue({
      ...newIssue,
      labels: newIssue.labels?.filter((l: string) => l !== label),
    });
  };

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Issue Tracker</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">
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
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
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
              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  placeholder="Assignee name"
                  value={newIssue.assignee}
                  onChange={(e) =>
                    setNewIssue({ ...newIssue, assignee: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="labels">Labels</Label>
                <div className="flex gap-2">
                  <Input
                    id="labels"
                    placeholder="Add label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddLabel}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newIssue.labels?.map((label: string) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {label}
                      <button
                        onClick={() => handleRemoveLabel(label)}
                        className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center text-xs hover:bg-muted"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateIssue}>
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
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
        />
      </div>
    </main>
  );
}
