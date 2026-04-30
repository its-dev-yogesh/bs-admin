import { apiClient } from "@/lib/api";

export type LeadStatus = "new" | "contacted" | "converted" | "closed";

export type AdminLeadRow = {
  _id: string;
  status: LeadStatus;
  broker_user_id: string;
  client_user_id: string;
  post_id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const leadsService = {
  list: () =>
    apiClient.get<{ data: AdminLeadRow[] }>("/leads/admin/all"),
};
