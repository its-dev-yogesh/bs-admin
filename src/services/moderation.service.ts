import { apiClient } from "@/lib/api";

export type ReportStatus = "open" | "reviewed" | "actioned" | "rejected";
export type ReportTargetType = "post" | "user";

export type ReportRow = {
  _id: string;
  reporter_user_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  status: ReportStatus;
  action_note?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const moderationService = {
  listOpen: () =>
    apiClient.get<{ data: ReportRow[] }>("/moderation/reports/open"),
  listAll: () =>
    apiClient.get<{ data: ReportRow[] }>("/moderation/reports/all"),
  review: (id: string, status: ReportStatus, note?: string) =>
    apiClient.put<{ data: ReportRow }>(`/moderation/reports/${id}/review`, {
      status,
      note,
    }),
};
