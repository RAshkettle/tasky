export type IssueStatus = "open" | "in-progress" | "backlog" | "closed";
export type IssuePriority = "critical" | "high" | "medium" | "low";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string;
  createdAt: string;
  labels: string[];
}
