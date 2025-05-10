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
import type { Issue, IssueStatus } from "@/types/issue";
import { formatDistanceToNow } from "date-fns";
import { Key, useState } from "react";

interface IssueListProps {
  issues: Issue[];
  onStatusChange: (issueId: string, newStatus: IssueStatus) => void;
}

export default function IssueList({ issues, onStatusChange }: IssueListProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "backlog":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "closed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
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
              <TableHead>Assignee</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Labels</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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
                                {issue.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Priority
                              </h4>
                              <Badge
                                className={`${getPriorityColor(
                                  issue.priority
                                )} capitalize`}
                              >
                                {issue.priority}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Assignee
                            </h4>
                            <p>{issue.assignee}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              Description
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {issue.description}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Labels</h4>
                            <div className="flex flex-wrap gap-2">
                              {issue.labels.map(
                                (label: any, index: Key | null | undefined) => (
                                  <Badge key={index} variant="outline">
                                    {String(label)}
                                  </Badge>
                                )
                              )}
                            </div>
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
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getPriorityColor(
                        issue.priority
                      )} capitalize`}
                    >
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.assignee}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(issue.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {issue.labels
                        .slice(0, 2)
                        .map((label: any, index: Key | null | undefined) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {String(label)}
                          </Badge>
                        ))}
                      {issue.labels.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{issue.labels.length - 2}
                        </Badge>
                      )}
                    </div>
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
