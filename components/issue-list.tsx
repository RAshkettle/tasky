"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import type { Issue, IssueStatus } from "../types/issue";

interface IssueListProps {
  issues: Issue[];
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
}

export default function IssueList({ issues, onStatusChange }: IssueListProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="text-left hover:underline"
                          onClick={() => setSelectedIssue(issue)}
                        >
                          {issue.title}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{issue.title}</DialogTitle>
                          <DialogDescription>
                            Issue #{issue.id} • Created{" "}
                            {formatDistanceToNow(new Date(issue.createdAt))} ago
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Status
                              </h4>
                              <Badge
                                className={`${getStatusColor(
                                  issue.status
                                )} capitalize`}
                              >
                                {issue.status === "IN-PROGRESS"
                                  ? "In Progress"
                                  : issue.status === "TODO"
                                  ? "To Do"
                                  : issue.status === "INVESTIGATE"
                                  ? "Investigate"
                                  : issue.status}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Priority
                              </h4>
                              <Badge
                                className={`${getPriorityColor(
                                  issue.priority
                                )} capitalize cursor-default`}
                              >
                                {issue.priority}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Description
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {issue.description}
                            </p>
                          </div>
                        </div>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
