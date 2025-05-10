export type IssueStatus =
  | "TODO"
  | "IN-PROGRESS"
  | "PARKED"
  | "DONE"
  | "INVESTIGATE";
export type IssuePriority = "critical" | "high" | "medium" | "low";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string;
  createdAt: string;
}
