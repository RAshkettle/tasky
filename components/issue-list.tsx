"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { Issue, IssuePriority, IssueStatus } from "../types/issue";

interface IssueListProps {
  issues: Issue[];
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
  onDelete: (issueId: string) => void;
  onUpdate: (updatedIssue: Issue) => void;
}

export default function IssueList({
  issues,
  onStatusChange,
  onDelete,
  onUpdate,
}: IssueListProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No issues found. Try adjusting your filters or create a new
                  issue.
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue) => (
                <TableRow
                  key={issue.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <Dialog
                      open={editDialogOpen}
                      onOpenChange={(open) => {
                        setEditDialogOpen(open);
                        if (open) {
                          setEditingIssue({ ...issue });
                        } else {
                          setEditingIssue(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <button
                          className="text-left hover:underline"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setEditDialogOpen(true);
                          }}
                        >
                          {issue.title}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Edit Issue</DialogTitle>
                          <DialogDescription>
                            Issue #{issue.id} • Created{" "}
                            {formatDistanceToNow(new Date(issue.createdAt))} ago
                          </DialogDescription>
                        </DialogHeader>
                        {editingIssue && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                value={editingIssue.title}
                                onChange={(e) =>
                                  setEditingIssue({
                                    ...editingIssue,
                                    title: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                  value={editingIssue.status}
                                  onValueChange={(value) =>
                                    setEditingIssue({
                                      ...editingIssue,
                                      status: value as IssueStatus,
                                    })
                                  }
                                >
                                  <SelectTrigger
                                    id="status"
                                    className={getStatusColor(
                                      editingIssue.status
                                    )}
                                  >
                                    <SelectValue />
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
                                  value={editingIssue.priority}
                                  onValueChange={(value) =>
                                    setEditingIssue({
                                      ...editingIssue,
                                      priority: value as IssuePriority,
                                    })
                                  }
                                >
                                  <SelectTrigger id="priority">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="critical">
                                      Critical
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                className="min-h-[120px]"
                                value={editingIssue.description}
                                onChange={(e) =>
                                  setEditingIssue({
                                    ...editingIssue,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              if (editingIssue) {
                                onUpdate(editingIssue);
                                setEditDialogOpen(false);
                              }
                            }}
                            disabled={
                              !editingIssue?.title || !editingIssue?.description
                            }
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={issue.status}
                      onValueChange={(value) =>
                        onStatusChange(issue.id, value as IssueStatus)
                      }
                    >
                      <SelectTrigger
                        className={`w-[130px] ${getStatusColor(issue.status)}`}
                      >
                        <SelectValue />
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getPriorityColor(
                        issue.priority
                      )} capitalize cursor-default`}
                    >
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(issue.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIssueToDelete(issue);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-red-200 dark:border-red-900/50">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this issue? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {issueToDelete && (
            <div className="py-4">
              <h3 className="font-medium mb-2">{issueToDelete.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {issueToDelete.description}
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (issueToDelete) {
                  onDelete(issueToDelete.id);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
